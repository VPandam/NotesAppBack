const mongoose = require("mongoose");

//Using process env we can use global parameters for the application
//It's important to add a gitignore for the env file
//We need to install dotenv dependency
const dbURI = process.env.MONGO_DB_URI;
const db = mongoose.connection;

mongoose.connect(dbURI).catch((err) => console.log(err));

//Event triggered on database connected and on error
db.on("open", () => console.log("dataBase opened"));
db.on("error", (err) => console.log(err));


