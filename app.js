const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");

dotenv.config();

//import mongodb server and connect to it
const dbConnect = require("./db/connectDb");

//mongo db connection
dbConnect();

const PORT = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());
app.use(cookieParser());

// api routes
app.use("/register", require("./routes/auth/register"));

app.get("/", (req, res) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  console.log(socket);
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
