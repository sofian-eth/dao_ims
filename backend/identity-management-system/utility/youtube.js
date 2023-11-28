const request = require('request');
const { youtubeKey } = require('./keys');
async function fetchElementsUpdate() {

    let fetchUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLNCInmETtgm29TGqqsmr2-LxnCSDfz6so&maxResults=50&key=' + youtubeKey + '&part=snippet';

    return new Promise(function (resolve, reject) {
        request(fetchUrl, function (error, response, body) {
            if (error)
                reject('Failed in fetching youtube videos');
            var parsedData = JSON.parse(body);

            resolve(parsedData.items);

        });
    });
}




module.exports.fetchElementsUpdate = fetchElementsUpdate;