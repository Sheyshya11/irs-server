const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const path = require("path");
const corsOption = require("./config/corsOption");
const helmet = require("helmet");
const expressejslayout= require('express-ejs-layouts')

//routes path
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const itemRoute = require("./routes/itemRoutes");
const itemRequestRoute = require('./routes/requestItems')
const bodyParser = require("body-parser");

require("dotenv").config();

const PORT = 5000;
const app = express();

//middleware
app.use(helmet());
app.use(express.json({ limit: "50mb" })); //process json or allow to parse json
app.use(expressejslayout)
app.set('view engine','ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieparser());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use("/", express.static(path.join(__dirname, "public"))); //grabs static file
app.use(cors(corsOption));

//routes
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/items", itemRoute);
app.use('/requestItems',itemRequestRoute)

//mongodb connection
const start = async () => {
  try {
   await  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("MONGODB connected");
    })
    .catch((err) => {
      console.log({ err });
    });
    app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
    });
    
  } catch (error) {
      console.log({error});
  }
};

start();

