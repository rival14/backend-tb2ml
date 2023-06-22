const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
let bodyParser = require('body-parser');

require("dotenv").config();

const productRoute = require('./routes/product.route')

// middleware
const corsOptions = {
  // origin: "http://localhost:3000" // frontend URI (ReactJS)
}
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  const PORT = process.env.PORT || 8000
  app.listen(PORT, () => {
    console.log(`App is Listening on PORT ${PORT}`);
  })
}).catch(err => {
  console.log(err);
});

// route

app.use('/products', productRoute)
