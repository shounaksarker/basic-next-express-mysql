const jwt = require("jsonwebtoken");

//  <----- jwt create for authentication ----->
const jwtCreate = (userDetails) => {
    const token = jwt.sign(
      userDetails,
      "pathao_secret_key",
      { expiresIn: "2h" }
    );
  
    return token;
  };

  
  module.exports = jwtCreate