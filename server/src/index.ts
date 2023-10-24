import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Image } from "./entity/Image";
import multer from "multer";
import express, { Express } from "express";
import { hashPassword, comparePassword } from "./utils/utils";
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
import "dotenv/config";

const app: Express = express();
app.use(cors());
console.log(process.env.JWT_SECRET);
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); // Set the destination folder for uploaded files
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename for the uploaded file
      },
    });
    const upload = multer({ storage });

    app.use(express.json());
    console.log("Database connection established.");

    app.get("/", (req, res) => {
      res.send("API v2 | Lukas Moe Olsen");
    });

    app.post("/api/v2/user", async (req, res) => {
      const body = req.body;

      const { username, password, email } = body;

      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ error: "Incorrect credentials provided" });
      }

      try {
        const user = new User();
        user.email = email;
        user.username = username;
        user.password_hash = await hashPassword(password);

        await User.save(user);
        res.send({
          message: "User created successfully",
          jwt: user.generateJWT(),
        });
      } catch (e) {
        res.json({ error: "Incorrect credentials" });
      }
    });

    app.get("/api/v2/users", async (req, res) => {
      // Do not get back the ID

      const users = await User.find({
        select: ["id", "username", "email"],
      });

      res.json(users);
    });

    app.post("/api/v2/upload", upload.single("image"), async (req, res) => {
      // Get the JSON body data
      const body = req.body;

      if (!body) {
        return res.status(400).json({ error: "No body provided" });
      }
      console.log(req.body.id);

      if (!body.id || !body.name) {
        return res
          .status(400)
          .json({ error: "Incorrect credentials provided" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      console.log(req.body.id);

      const image = new Image();

      image.user_id = body.id;
      image.name = body.name;

      image.created_at = new Date();
      image.updated_at = new Date();

      image.file_path = req.file.path;

      try {
        await Image.save(image);
        res
          .status(201)
          .json({ message: "Image saved successfully", image_id: image.id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/api/v2/download/:id", async (req, res) => {
      try {
        const image = await Image.findOne({
          where: { id: parseInt(req.params.id) },
          select: ["id", "name", "file_path"],
        });
        console.log(image);

        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }

        res.download(image.file_path);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/v2/images", async (req, res) => {
      const images = await Image.find({
        select: ["id", "name", "file_path"],
      });

      res.json(images);
    });

    app.get("/api/v2/images/:user_id", async (req, res) => {
      try {
        const images = await Image.findOne({
          where: { user_id: parseInt(req.params.user_id) },
          select: ["id", "name", "file_path"],
        });

        res.json(images ?? "No image found");
      } catch (e) {
        res.json({ error: "Incorrect credentials" });
      }
    });

    app.listen(process.env.port, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};

startServer();
