const mongoose = require("mongoose");
mongoose.set("sanitizeFilter", true);

const url = process.env.MONGO_URI;
const dbConnect = () => {
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("MongoDB connected");
      }
    }
  );
};

module.exports = dbConnect;
