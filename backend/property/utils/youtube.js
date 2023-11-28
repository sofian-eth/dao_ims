const dotenv = require("dotenv");
const request = require("request");
const fs = require("fs");
dotenv.config();

async function fetchVideos(playlistID) {
  const path = './resources/youtube/' + playlistID + '.json';
  if (fs.existsSync(path) && process.env.youtubeCache=='true') {
    return new Promise(function (resolve, reject) {
      let rawdata = fs.readFileSync(path);
      rawdata = JSON.parse(rawdata);
      resolve(rawdata);
    });
  } else {
    let fetchUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" +
      playlistID +
      "&maxResults=55550&key=" + process.env.youtubekey + "&part=snippet";

    return new Promise(function (resolve, reject) {
      request(fetchUrl, function (error, response, body) {
        if (error) reject("Error occurred in fetching feed");
        var parsedData = JSON.parse(body);
        fs.writeFileSync(path, body);
        resolve(parsedData);
      });

    });

  }

}

module.exports.fetchVideos = fetchVideos;
