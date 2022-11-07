import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";
import { IsNumber } from "class-validator";

export class SetRatingDto {
  @IsObjectId({message: "Movie Id is Invalid"})
  movieId: Types.ObjectId

  @IsNumber()
  value: number
}