import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connect();
  console.log(`Server started on port ${port}`);
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
  const userId = req.auth.userId;
  console.log(userId);
  res.send("Success!!");
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId, text } = req.body;

  try {
    // create new chat
    const newChat = new Chat({
      userId: userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });
    const savedChat = await newChat.save();

    // check if user exist
    const userChats = await UserChats.findOne({ userId: userId }); //ini tadinya find doang.

    // if it doesnt create a new one and add the chat in the chats array
    if (!userChats) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChats.save();
    } else {
      // if exist, push the chat to existing array
      await UserChats.updateOne(
        {
          userId: userId,
        },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("error creating chat");
  }
});
