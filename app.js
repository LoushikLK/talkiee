const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config();

const auth = require("./socket/auth/auth");
//import mongodb server and connect to it
const dbConnect = require("./db/connectDb");
const setOnline = require("./socket/helper/setOnline");
const setOffline = require("./socket/helper/setOffline");

//mongo db connection
dbConnect();

const PORT = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cookieParser());

// api routes
app.use("/register", require("./routes/auth/register"));
app.use("/login", require("./routes/auth/login"));
app.use("/checkuser", require("./routes/auth/checkUser"));
app.use("/message/private", require("./routes/messages/privateMessage"));
app.use("/feed", require("./routes/post/postFeed"));
app.use("/self", require("./routes/user/self"));
app.use("/friends", require("./routes/user/friends"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// io.use((socket, next) => auth(socket, next));

let socket = null;

const users = [];

io.on("connection", (socketObj) => {
  socket = socketObj;

  // console.log(users);
  socket.on("user-online", (userId) => {
    // console.log(`user ${userId} is online`);
    setOnline(userId, socket);

    if (!users?.includes(userId)) {
      users.push({
        userId,
        socketId: socket.id,
      });
    }
  });

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`room ${userId} joined`);
  });

  socket.on("send-message", (data) => {
    console.log(data);
    socket.to(data?.conversationId).emit("receive-message", data);
  });

  socket.on("disconnect", async () => {
    users?.forEach((user) => {
      if (user.socketId === socket.id) {
        setOffline(user.userId, socket);
        users.splice(users.indexOf(user), 1);
      }
    });
    socket.disconnect();
    console.log("disconnected");
  });
});

exports = { io, socket };

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
