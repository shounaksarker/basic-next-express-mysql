const db = require("../utils/dbConnection");
const bcrypt = require("bcrypt");
const sendServerError = require("../utils/sendServerError");
const jwtCreate = require("../utils/jwtCreate");

//  <========== API routes ==========>

//  <----- GET all users ----->

const getAllUsers = async (req, res, next) => {
  const sql_query =
    "SELECT userID, name, username, email, last_login FROM users";
  db.query(sql_query, (err, data) => {
    if (err) {
      sendServerError(res, next, err);
    } else {
      res.status(200).send({
        status: 200,
        success: true,
        data: data,
      });
    }
  });
};

//  <----- GET single user ----->

const getSingleUser = (req, res, next) => {
  const { userID } = req.params;
  const sql_query =
    "SELECT userID, name, username, email FROM users WHERE userID = ?";
  db.query(sql_query, [userID], (err, data) => {
    if (err) {
      sendServerError(res, next, err);
    }
    if (data.length === 0) {
      res.status(404).send({
        status: 404,
        success: false,
        data: "no data found.",
      });
    } else {
      res.status(200).send({
        status: 200,
        success: true,
        data: data,
      });
    }
  });
};

//  <----- POST / create user ----->

const createUser = async (req, res, next) => {
  const { name, username, email, password } = req.body;
  if (!name) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "name must be included.",
    });
    return;
  } else if (!username) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "username must be included.",
    });
    return;
  } else if (!email) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "email must be included.",
    });
    return;
  } else if (!password) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "password must be included.",
    });
    return;
  } else {
    const getNextUserIDQuery =
      "SELECT MAX(userID) + 1 as nextUserID FROM users";
    db.query(getNextUserIDQuery, async (nextIdErr, result) => {
      if (nextIdErr) {
        sendServerError(res, next, nextIdErr);
        return;
      } else {
        const nextUserID = result[0].nextUserID || 101; // If there are no existing users, start from 101

        const sql_query =
          "INSERT INTO users (userID, name, username, email, password) VALUES(?, ?, ?, ?, ?)";
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          sql_query,
          [nextUserID, name, username, email, hashedPassword],
          (err, data) => {
            if (err) {
              sendServerError(res, next, err);
              return;
            } else {
              const token = jwtCreate({
                userID: nextUserID,
                name: name,
                username: username,
                email: email,
                password: hashedPassword,
                last_login: new Date()
              });

              res.status(201).send({
                status: 201,
                success: true,
                data: data,
                token: token
              });
            }
          }
        );
      }
    });
  }
};

//  <----- POST / user login ----->

const login = (req, res) => {
  const { user, password } = req.body; // in "user", req can be email or username.
  if (!user) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "username or email must be included.",
    });
    return;
  }
  if (!password) {
    res.status(400).send({
      status: 400,
      success: false,
      data: "password must be included.",
    });
    return;
  } else {
    const sql_query = "SELECT * FROM users WHERE username = ? OR email = ?";

    db.query(sql_query, [user, user], async (err, data) => {
      if (err) {
        sendServerError(res, next, err);
      }
      if (data.length === 0) {
        res.status(400).send({
          status: 400,
          success: false,
          data: "No user found.",
        });
        return;
      } else {
        const isPasswordMatch = await bcrypt.compare(
          password,
          data[0].password
        );

        if (data.length > 0 && isPasswordMatch) {
          req.session.user = data[0];
          const token = jwtCreate(data[0]);

          res.status(200).send({
            status: 200,
            success: true,
            data: "login successful.",
            token: token,
          });
          return;
        } else {
          res.status(400).send({
            status: 400,
            success: false,
            data: "Invalid user-details or password",
          });
          return;
        }
      }
    });
  }
};

//  <----- POST / update user ----->

const updateUser = async (req, res, next) => {
  const { name, email, username, oldPassword, newPassword } = req.body;
  const userID = req.session.user.userID;

  // Fetch the current user data
  const selectQuery = "SELECT * FROM users WHERE userID = ?";
  db.query(selectQuery, [userID], async (selectErr, selectResults) => {
    if (selectErr) {
      sendServerError(res, next, selectErr);
      return;
    }

    if (selectResults.length > 0) {
      const currentUser = selectResults[0];

      // Check if the email or username is already taken by another user
      const checkDuplicateQuery =
        "SELECT * FROM users WHERE (email = ? OR username = ?) AND userID != ?";
      db.query(
        checkDuplicateQuery,
        [email, username, userID],
        async (duplicateErr, duplicateData) => {
          if (duplicateErr) {
            sendServerError(res, next, duplicateErr);
            return;
          }

          if (duplicateData.length > 0) {
            if (duplicateData[0].email === email) {
              res.status(400).send({
                status: 400,
                success: false,
                data: "this email has already registered.",
              });
              return;
            } else if (duplicateData[0].username === username) {
              res.status(400).send({
                status: 400,
                success: false,
                data: "this username has already taken.",
              });
              return;
            }
          }

          // Check if the old password matches (if updating the password)
          if (
            oldPassword &&
            !(await bcrypt.compare(oldPassword, currentUser.password))
          ) {
            res.status(400).send("Old password is incorrect");
            return;
          }

          // Update user data
          const updateQuery =
            "UPDATE users SET name = ?, email = ?, username = ?, password = ? WHERE userID = ?";
          const hashedPassword = newPassword
            ? await bcrypt.hash(newPassword, 10)
            : currentUser.password;
          const updateValues = [
            name || currentUser.name,
            email || currentUser.email,
            username || currentUser.username,
            hashedPassword,
            userID,
          ];

          db.query(updateQuery, updateValues, (updateErr, updateData) => {
            if (updateErr) {
              res.status(400).send({
                status: 400,
                success: false,
                msg: {
                  code: updateErr.code,
                  sqlMsg: updateErr?.sqlMessage,
                },
              });
            } else {
              res.status(200).send({
                status: 200,
                success: true,
                msg: updateData,
              });
            }
          });
        }
      );
    } else {
      res.status(404).send("User not found");
    }
  });
};

module.exports = { getAllUsers, getSingleUser, createUser, login, updateUser };
