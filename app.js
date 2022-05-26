const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

const auth = require("./socket/auth/auth");
//import mongodb server and connect to it
const dbConnect = require("./db/connectDb");

//mongo db connection
dbConnect();

const PORT = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/socket",
});

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cookieParser());

// api routes
app.use("/register", require("./routes/auth/register"));
app.use("/login", require("./routes/auth/login"));
app.use("/checkuser", require("./routes/auth/checkUser"));
app.use("/message/private", require("./routes/messages/privateMessage"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

io.use((socket, next) => auth(socket, next));

let socket = null;

io.on("connection", (socketObj) => {
  socket = socketObj;

  console.log(socket.id);

  console.log(socket.handshake.auth);

  console.log("a user connected");

  socket.on("disconnect", async () => {
    socket.disconnect();

    // await setOffline(socket.handshake.auth.token, socket);

    console.log("user disconnected");
  });
});

exports = { io, socket };

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
