const mongoose = require("mongoose");
const app = require("./app");

// mongodb+srv://kuprykovrodion:epp8njC9ksbhPbk@phonebook.14yk2yv.mongodb.net/dab-contacts?retryWrites=true&w=majority&appName=AtlasApp

const DB_HOST =
  "mongodb+srv://kuprykovrodion:epp8njC9ksbhPbk@phonebook.14yk2yv.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=AtlasApp";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Connect success");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
