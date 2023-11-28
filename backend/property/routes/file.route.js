const express = require('express');
const fileRouter = express.Router();
const { getFile } = require("../Controllers/files/file.controller");
fileRouter.get('/',getFile);
module.exports = {fileRouter}