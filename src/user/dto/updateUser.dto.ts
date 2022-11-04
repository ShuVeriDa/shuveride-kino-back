import { IsEmail, IsString } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  email: string

  password?: string

  isAdmin?: boolean //Не прописываем @IsBoolean потому что он не обязательный, и dto общая для всех
}