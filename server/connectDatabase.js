const mongoose = require("mongoose");
const db = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`;
const optionConnectDB =
process.env.DB_AUTHENTICATION === "true"
    ? {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
    }
    : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    };

mongoose // Connect to MongoDB
    .connect(db, optionConnectDB)
    .then(() => console.log("MongoDB successfully connected"))
    .catch((err) => console.log(err));