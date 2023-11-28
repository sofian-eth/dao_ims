const file = require('./../helper/fileuploader');


let mediaResponse = class {

    constructor(media) {

        if (media.relativePath) {
            this.setUrl(media.relativePath);
        }

        this.originalFileName = media.originalFileName;
        this.mediaID = media.id;
        this.documentName = media.name;
        this.documentType = media.bucketId;
        this.documentSize = media.size;
        this.createdAt = media.createdAt
    }

    async setUrl(relativePath) {
        this.url = await file.getMedia(relativePath);
    }

};


module.exports = mediaResponse;