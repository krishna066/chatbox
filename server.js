import http from "http";
import express from "express";
import logger from "morgan";
import db from "./src/models/index.js";
import { indexRouter } from "./src/routes.index.js";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
// routes
// middlewares
// import { decode } from "./middlewares/jwt.js";

const app = express();

const port = process.env.PORT || "3000";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/chatbox", indexRouter);

// Set the root directory
const __dirname = path.resolve();
console.log("__dirname", __dirname);
const rootDirectory = path.join(__dirname);
const corsOptions = {
  origin: "*",
};
const users = {};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: rootDirectory });
});
app.get("/script.js", (req, res) => {
  res.sendFile("./script.js", { root: rootDirectory });
});
export const io = new Server(process.env.SOCKET_PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    console.log("message", message);
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("new-user", (user) => {
    users[socket.id] = user;
    socket.broadcast.emit("user-connected", user);
  });
});

app.use(express.static(path.resolve(__dirname, "client")));
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io-client/dist/socket.io.js");
});

const server = http.createServer(app);
server.listen(port);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("");
    console.log("----------------------- DB CONNECTED ----------------------");
  })
  .catch((error) => console.log("this is a db error => ", error));

db.sequelize
  .sync({ force: false }) // Set force to true to drop and recreate the tables
  .then(() => {
    console.log("Database & tables synchronized");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
