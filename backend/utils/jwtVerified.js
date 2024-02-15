const jwt = require("jsonwebtoken");

const jwtAuth = (token) => {
  return jwt.verify(token, "pathao_secret_key", (err, decoded) => {
    if (err) {
      return {
        success: false,
        error: err.message,
      };
    } else {
      return {
        success: true,
        data: {
          userID: decoded.userID,
          name: decoded.name,
          username: decoded.username,
          email: decoded.email,
          last_login: decoded.last_login,
          iat: decoded.iat,
          exp: decoded.exp,
        },
      };
    }
  });
};

const jwtVerified = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "Athentication Missing. User may not be logged in.",
    });
    return;
  } else {
    const verified = jwtAuth(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (verified.success === false) {
      res.status(400).send({
        status: 400,
        success: false,
        data: verified.error,
      });
      return;
    } else if (verified.data.success && verified.data.exp > currentTimestamp) {
      return verified;
    }
    return verified;
  }
};

const expired_token =
  " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEwMiwibmFtZSI6InRlc3QyIiwidXNlcm5hbWUiOiJ0ZXN0MiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkYjZDb2c0eFB5clZEYmE4OUN0Tk5OZS9GNE1ZenFPN3ZBaUpiY2lLeWdSYk1ZWWxsc1NaUzYiLCJsYXN0X2xvZ2luIjoiMjAyNC0wMS0yMFQxNDoxNzozNy4wMDBaIiwiaWF0IjoxNzA1ODk2NDAwLCJleHAiOjE3MDU5MDAwMDB9.xqegOYe7ycOEj8-XzuXfMpU7dzByfdcLLuwm0u_kwlQ";

module.exports = jwtVerified;
