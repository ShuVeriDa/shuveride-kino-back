import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ActorModel } from "./actor.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { ActorDto } from "./dto/actor.dto";

@Injectable()
export class ActorService {
  constructor(@InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>) {}

  async bySlug(slug: string) {
    const actor = await  this.actorModel.findOne({ slug }).exec();
    if (!actor) throw new NotFoundException('Actor not found')

    return actor
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
        ]
      };

    // Aggregation

    return this.actorModel
      .find(options)
      .select("-updatedAt -__v")
      .sort({
      createdAt: "desc"
    }).exec();
  }

  //Admin place
  async byId(_id: string) {
    const actor = await this.actorModel.findById(_id);
    if (!actor) throw new NotFoundException("Actor not found");
    return actor;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: "",
      slug: "",
      photo: ""
    };

    const actor = await this.actorModel.create(defaultValue);
    return actor._id;
  }

  async update(_id: string, dto: ActorDto) {
    const updateActor = await this.actorModel.findByIdAndUpdate(_id, dto, {
      new: true //будем новый жанр
    }).exec();

    if (!updateActor) throw new NotFoundException('Actor not found')

    return updateActor
  }

  async delete(id: string) {
    const deleteActor = await this.actorModel.findByIdAndDelete(id).exec();

    if (!deleteActor) throw new NotFoundException('Actor not found')

    return deleteActor
  }
}
