import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export type UserModelType = Base

export class UserModel extends TimeStamps {
  _id: string

  @prop({ unique: true })
  email: string

  @prop()
  password: string

  @prop({ default: false })
  isAdmin: boolean

  @prop({ default: [] })
  favorites?: []
}
