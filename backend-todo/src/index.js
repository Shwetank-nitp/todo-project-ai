const app = require("./app");
const mongoDBConnection = require("./db/mongo-db");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

mongoDBConnection();

app.listen(3000, () => {
  console.log("app is running at :", 3000);
});
