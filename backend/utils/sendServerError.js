const sendServerError = (res, next, err) => {
  try{
    res.status(500).send({
      success: false,
      status: 500,
      msg: "DB / Internal Server Error",
      error: {
        code: err.code,
        msg:err.sqlMessage
      },
    });
    // next(err);
    return
  } catch(err){
    console.log('📛 👉 ~ sendServerError ~ err:', err);
  }
  };

  module.exports = sendServerError;