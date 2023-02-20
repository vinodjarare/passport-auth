const mongoose = require("mongoose");

const connectDb = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });
};

module.exports = connectDb;
