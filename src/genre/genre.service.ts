import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { genSalt, hash } from "bcryptjs";
import { GenreModel } from "./genre.model";
import { CreateGenreDto } from "./dto/createGenre.dto";

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>
  ) {
  }

  async bySlug(slug: string) {
    const genre = await  this.genreModel.findOne({ slug }).exec();
    if (!genre) throw new NotFoundException('Genre not found')

    return genre
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm)
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, "i")
          },
          {
            slug: new RegExp(searchTerm, "i")
          },
          {
            description: new RegExp(searchTerm, "i")
          }
        ]
      };

    return this.genreModel.find(options).select("-updatedAt -__v").sort({
      createdAt: "desc"
    }).exec();
  }

  async getCollections() {
    const genres = await this.getAll()
    const collections = genres
    return collections
  }

  //Admin place

  async byId(_id: string) {
    const genre = await this.genreModel.findById(_id);
    if (!genre) throw new NotFoundException("Genre not found");
    return genre;
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: "",
      slug: "",
      description: "",
      icon: ""
    };

    const genre = await this.genreModel.create(defaultValue);
    return genre._id;
  }

  async update(_id: string, dto: CreateGenreDto) {
    const updateGenre = await this.genreModel.findByIdAndUpdate(_id, dto, {
      new: true //будем новый жанр
    }).exec();

    if (!updateGenre) throw new NotFoundException('Genre not found')

    return updateGenre
  }

  async delete(id: string) {
    const deleteGenre = await this.genreModel.findByIdAndDelete(id).exec();

    if (!deleteGenre) throw new NotFoundException('Genre not found')

    return deleteGenre
  }
}
