import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModule) private readonly UserModel: ModelType<UserModel>) {
  }

  async register(dto: any) {
    return this.
  }
}
