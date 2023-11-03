import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Image } from "./entity/Image";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.db_host || "localhost",
  port: parseInt(process.env.db_port) || 5432,
  username: process.env.db_username || "postgres",
  password: process.env.db_password || "postgres",
  database: process.env.db_database || "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Image],
  migrations: [],
  subscribers: [],
});
