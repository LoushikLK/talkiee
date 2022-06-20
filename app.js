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
const getUserDetails = require("./socket/helper/getUserDetails");

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
app.use("/message/group", require("./routes/messages/groupMessage"));
app.use("/feed", require("./routes/post/postFeed"));
app.use("/self", require("./routes/user/self"));
app.use("/friends", require("./routes/user/friends"));
app.use("/user", require("./routes/user/details"));
app.use("/self/group", require("./routes/user/group"));
app.use("/group", require("./routes/group/group"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// io.use((socket, next) => auth(socket, next));

let socket = null;

let onlineUsers = new Map();

io.on("connection", (socketObj) => {
  socket = socketObj;
  socket.on("user-online", (userId) => {
    setOnline(userId, socket);
    onlineUsers.set(userId, socket.id);
    socket.emit("user-online", userId);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiver);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-receive", data);
    }
  });

  // socket.on("get-user-data", async (data) => {
  //   console.log("socket-id: " + socket.client.id);
  //   await getUserDetails(socket, data);
  // });

  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    socket.emit("user-offline", socket.id);
    // console.log(onlineUsers);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        setOffline(key, socket);

        onlineUsers.delete(key);
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
