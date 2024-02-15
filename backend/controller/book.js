const db = require("../utils/dbConnection");
const jwtVerified = require("../utils/jwtVerified");
const sendServerError = require("../utils/sendServerError");

//  <========== API routes ==========>

//  <----- GET all books (admin) ----->
const getAllBooks = async (req, res, next) => {
  const sql_query = "SELECT * FROM booklist";
  db.query(sql_query, (err, data) => {
    if (err) {
      sendServerError(res, next, err);
    } else {
      res.status(200).send({
        status: 200,
        success: true,
        data: data,
      });
      return;
    }
  });
};

//  <----- GET all books by userID ----->
const getAllBooksByUser = async (req, res, next) => {
  const verifiedUser = jwtVerified(req, res);

  if (verifiedUser !== undefined && verifiedUser.success) {
    const sql_query = "SELECT * FROM booklist WHERE userID = ?";
    db.query(sql_query, [verifiedUser.data.userID], (err, data) => {
      if (err) {
        sendServerError(res, next, err);
      } else {
        res.status(200).send({
          status: 200,
          success: true,
          data: data,
        });
        return;
      }
    });
  }
  return;
};

//  <----- GET single book by bookID and userID ----->
const getSingleBook = (req, res, next) => {
  const { id: bookID } = req.params;
  const verifiedUser = jwtVerified(req, res);
  if (verifiedUser !== undefined && verifiedUser.success) {
    const sql_query = "SELECT * FROM booklist WHERE bookID = ? AND userID = ?";
    db.query(sql_query, [bookID, verifiedUser.data.userID], (err, data) => {
      if (err) {
        sendServerError(res, next, err);
      } else {
        res.status(200).send({
          status: 200,
          success: true,
          data: data.length > 0 ? data : "no book found for the user.",
        });
        return;
      }
    });
  }
  return;
};

//  <----- POST single book ----->
const insertBook = (req, res, next) => {
  const { title, author, description } = req.body;

  if (!title) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "title must be included.",
    });
    return;
  } else if (!author) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "Author must be included.",
    });
    return;
  } else {
    const verifiedUser = jwtVerified(req, res);
    if (verifiedUser !== undefined && verifiedUser.success) {
      const nextBookIDQuery =
        "SELECT MAX(bookID) + 1 as nextBookID FROM booklist";

      db.query(nextBookIDQuery, async (nextIdErr, result) => {
        if (nextIdErr) {
          sendServerError(res, next, nextIdErr);
        } else {
          const nextBookID = result[0].nextBookID || 1; // If there are no existing book, start from 1
          const sql_query =
            "INSERT INTO booklist (bookID, title, author, description, created_by, userID) VALUES(?, ?, ?, ?, ?, ?)";
          db.query(
            sql_query,
            [
              nextBookID,
              title,
              author,
              description,
              verifiedUser.data.name,
              verifiedUser.data.userID,
            ],
            (err, data) => {
              if (err) {
                sendServerError(res, next, err);
              } else {
                res.status(200).send({
                  status: 200,
                  success: true,
                  data: data,
                });
                return;
              }
            }
          );
        }
      });
    }
    return;
  }
};

//  <----- UPDATE single book ----->
const updateBook = (req, res, next) => {
  const { id:bookID } = req.params;
  const { title, author } = req.body;

  if (!title) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "title must be included.",
    });
    return;
  } else if (!author) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "Author must be included.",
    });
    return;
  } else {
    const verifiedUser = jwtVerified(req, res);
    if (verifiedUser !== undefined && verifiedUser.success) {
      const sql_query = `UPDATE booklist SET title = ? , author = ? WHERE bookID = ? AND userID = ?`;
      db.query(
        sql_query,
        [title, author, bookID, verifiedUser.data.userID],
        (err, data) => {
          if (err) {
            sendServerError(res, next, err);
          } else {
            res.status(200).send({
              status: 200,
              success: true,
              data: data,
            });
            return;
          }
        }
      );
    }
    return;
  }
};

//  <----- DELETE single book ----->
const deleteBook = (req, res) => {
  const { id:bookID } = req.params;
  const verifiedUser = jwtVerified(req, res);
  if (verifiedUser !== undefined && verifiedUser.success) {
    const sql_query = "DELETE FROM booklist WHERE bookID =? AND userID = ?";
    db.query(sql_query, [bookID, verifiedUser.data.userID], (err, data) => {
      if (err) {
        sendServerError(res, next, err);
      } else {
        res.status(200).send({
          status: 200,
          success: true,
          data: data,
        });
        return;
      }
    });
  }
  return;
};

module.exports = {
  getAllBooks,
  getSingleBook,
  insertBook,
  updateBook,
  deleteBook,
  getAllBooksByUser,
};
