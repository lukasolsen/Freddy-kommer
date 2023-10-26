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
    //handle error
    getToken: function fromHeaderOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
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

    app.post("/api/v2/login", async (req, res) => {
      const body = req.body;

      const { username, password } = body;
      console.log(username, password);

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Incorrect credentials provided" });
      }

      try {
        const user = await User.findOne({
          where: { username: username },
        });
        console.log(user);

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        const isPasswordCorrect = await comparePassword(
          password,
          user.password_hash
        );
        console.log(isPasswordCorrect);

        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Incorrect password" });
        }

        res.send({
          message: "User logged in successfully",
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

    app.get(
      "/api/v2/current_user",
      jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
      async (req, res) => {
        try {
          // Access user ID from the decoded JWT
          const userId = req?.user?.id;

          // Use the user ID to query your database and retrieve the user information
          const user = await User.findOne({ id: userId });

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          // Respond with the user information (you may want to exclude sensitive data)
          res.json({
            id: user.id,
            username: user.username,
            email: user.email,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    app.post(
      "/api/v2/upload",
      jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
      upload.single("image"),
      async (req, res) => {
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

        image.user_id = req.user.id;
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
      }
    );

    app.post(
      "/api/v2/download/:id",
      jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
      async (req, res) => {
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
      }
    );

    app.get(
      "/api/v2/images",
      jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
      async (req, res) => {
        try {
          const images = await Image.find({
            select: ["id", "name", "file_path"],
          });

          res.json(images ?? []);
        } catch (e) {
          res.json({ error: "Incorrect credentials" });
        }
      }
    );

    app.get(
      "/api/v2/images/:user_id",
      jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
      async (req, res) => {
        try {
          const images = await Image.findOne({
            where: { user_id: parseInt(req.params.user_id) },
            select: ["id", "name", "file_path"],
          });

          res.json(images ?? "No image found");
        } catch (e) {
          res.json({ error: "Incorrect credentials" });
        }
      }
    );

    app.listen(process.env.port, () => {
      console.log("Server is running at http://localhost:" + process.env.port);
    });
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};

startServer();
