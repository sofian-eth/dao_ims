const { getFileUrl } = require("../../services/files/file.service");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getFile = async function (req, res, next) {
  const file = await getFileUrl(req.query.key);
  res.Ok(file);
};

module.exports = {
  getFile,
};
