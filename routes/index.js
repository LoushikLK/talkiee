const express = require("express");

const app = express();

app.use("/register", require("./auth/register"));
