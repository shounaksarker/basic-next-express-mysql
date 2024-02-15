const express = require('express');
const router = express.Router();
const auth = require("../utils/IsAuthenticated");

const {getAllUsers, getSingleUser, createUser, login, updateUser} = require('../controller/user')


router.route('/').get(getAllUsers);
router.route('/:userID').get(getSingleUser);
router.route('/').post(createUser);
router.route('/login').post(login);
router.route('/updateUser').post(updateUser);

module.exports = router;