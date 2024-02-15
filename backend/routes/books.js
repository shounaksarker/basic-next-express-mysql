const express = require("express");
const router = express.Router();
const auth = require("../utils/IsAuthenticated");


const {
  getAllBooks,
  getSingleBook,
  insertBook,
  updateBook,
  deleteBook,
  getAllBooksByUser
} = require("../controller/book");

router.route("/").get(auth, getAllBooks);
router.route("/allBooks").get(getAllBooksByUser);
router.route("/:id").get(getSingleBook);
router.route("/insertBook").post(insertBook);
router.route("/:id").put(updateBook);
router.route("/:id").delete(deleteBook);

module.exports = router;
