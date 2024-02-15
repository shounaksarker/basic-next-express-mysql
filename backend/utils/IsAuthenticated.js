// <----- jwt autherntications start ----->

// const jwt = require("jsonwebtoken");
// const jwt_token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiaWF0IjoxNzA0OTUwNDM0LCJleHAiOjE3MDQ5NTQwMzR9.uZfCu5Wrcko-HSuza6NbfwGz6HOD4VlONJxYuAS9trU";

// const jwtVerification = (token) => {
//   return jwt.verify(token, "pathao_secret_key", (err, decoded) => {
//     if (err) {
//       return err;
//     } else {
//       return decoded;
//     }
//   });
// };


// const jwt_verification = jwtVerification(jwt_token);
// if (jwt_verification.JsonWebTokenError) {
//   res.status(401).send({
//     status: 401,
//     msg: "Verification Failed",
//     error: jwt_verification.JsonWebTokenError,
//   });
// } else {
//   next();
// }

// <----- jwt autherntications end ----->

const authentication = (req, res, next) => {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(401).send({
      msg: "Need Authentication.",
    });
  } else {
    const auth = new Buffer.from(auth_header.split(" ")[1], "base64")
      .toString()
      .split(":");
    const user = auth[0];
    const pass = auth[1];

    if (user == "admin" && pass == "password") {
      // If Authorized user
      next();
    } else {
      res.status(401).send({
        msg: "Invalid Credential for Authorization.",
      });
    }
  }
};

module.exports = authentication;
