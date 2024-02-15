const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const book_routes = require("./routes/books");
const user_route = require("./routes/users")
const session = require('express-session');

const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'pathao_secret_key', resave: true, saveUninitialized: true }));


//  <========== routes ==========>
app.use("/api/books", book_routes);
app.use("/api/user", user_route)

// <========== listening app ==========>ç
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
