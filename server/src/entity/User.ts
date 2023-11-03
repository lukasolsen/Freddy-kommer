import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import * as jwt from "jsonwebtoken";

import { Image } from "./Image";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password_hash: string;

  @Column()
  email: string;

  @OneToMany(() => Image, (image) => image.user_id, {
    cascade: true,
  })
  images: Image[];

  generateJWT() {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        username: this.username,
      },
      process.env.JWT_SECRET
    );
  }
}
