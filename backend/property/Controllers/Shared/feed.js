const feedData = require("../../utils/youtube");
var fs = require('fs');

async function elementsFeed(req, res, next) {
  let err = {};
  try {
    let playlistIDs = "PLNCInmETtgm29TGqqsmr2-LxnCSDfz6so";
    if(req.query.id){
      playlistIDs = req.query.id;
    }

    vid = await feedData.fetchVideos(playlistIDs)
    return res
      .status(200)
      .json({ error: false, message: "", data: vid });
  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in fetching youtube feed";
    err.stackTrace = error;
    next(err);
  }
}

async function daoFeed(req, res, next) {
    let err = {};

    try {
      let playlistID = "PLNCInmETtgm3rldE1tUF_IVIEXlaPhgTc";
      let daoFeed = await feedData.fetchVideos(playlistID);
      return res
        .status(200)
        .json({ error: false, message: "", data: daoFeed });
    } catch (error) {
      console.log(error)
      err.statusCode = 400;
      err.message = "Error occurred in fetching youtube feed";
      err.stackTrace = error;
      next(err);
    }


}
async function deleteFeedFile(req, res, next) {
    let err = {};
    let playlistID = req.query.id;
    try {
      const path = './resources/youtube/' + playlistID + '.json';
     fs.unlinkSync(path);
        return res
        .status(200)
        .json({ error: false, message: "Youtube Feed File Deleted Successfuly" });
    } catch (error) {
      err.statusCode = 400;
      err.message = "Error occurred in deleting Youtube Feed File";
      err.stackTrace = error;
      next(err);
    }
}

module.exports.elementsFeed = elementsFeed;
module.exports.daoFeed = daoFeed;
module.exports.deleteFeedFile = deleteFeedFile;
