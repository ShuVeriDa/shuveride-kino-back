import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { MovieModel } from "./movie.model";
import { UpdateMovieDto } from "./dto/updateMovie.dto";
import { Types } from "mongoose";

@Injectable()
export class MovieService {
  constructor(@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>) {
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm)
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, "i")
          }
        ]
      };

    return this.movieModel
      .find(options)
      .select("-updatedAt -__v")
      .sort({
        createdAt: "desc"
      }).populate("actors genres")
      .exec();
  }

  async bySlug(slug: string) {
    const movie = await this.movieModel.findOne({ slug }).populate("actors genres").exec();
    if (!movie) throw new NotFoundException("Movies not found");

    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const actors = await this.movieModel.findOne({ actors: actorId }).exec();
    if (!actors) throw new NotFoundException("Movies not found");

    return actors;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const genres = await this.movieModel.findOne({ genres: { $in: genreIds } }).exec();
    if (!genres) throw new NotFoundException("Movies not found");

    return genres;
  }

  async getMostPopular() {
    return await this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate("genres")
      .exec();
  }

  async updateCountOpened(slug: string) {
    const updateMovie = await this.movieModel.findOneAndUpdate({ slug }, {
        $inc: { countOpened: 1 }
      },
      {
        new: true
      }).exec();

    if (!updateMovie) throw new NotFoundException("Movie not found");

    return updateMovie;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movieModel.findByIdAndUpdate(id,
      { rating: newRating },
      { new: true }
    ).exec();
  }

  //Admin place
  async byId(_id: string) {
    const movie = await this.movieModel.findById(_id);
    if (!movie) throw new NotFoundException("Movie not found");
    return movie;
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: "",
      actors: [],
      genres: [],
      poster: "",
      title: "",
      videoUrl: "",
      slug: ""
    };

    const movie = await this.movieModel.create(defaultValue);
    return movie._id;
  }

  async update(_id: string, dto: UpdateMovieDto) {
    /* Telegram notification*/

    const updateMovie = await this.movieModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec();

    if (!updateMovie) throw new NotFoundException("Movie not found");

    return updateMovie;
  }

  async delete(id: string) {
    const deleteMovie = await this.movieModel.findByIdAndDelete(id).exec();

    if (!deleteMovie) throw new NotFoundException("Movie not found");

    return deleteMovie;
  }
}