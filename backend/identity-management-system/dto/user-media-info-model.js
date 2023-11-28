module.exports = {
  'userMediaInfoModal':function(data, awsImageInfo){
    this.id = data && data.id ? data.id : 0 ;
    this.fileName =  data && data.fileName ? data.fileName : '';  
    this.originalFileName =  data && data.originalFileName ? data.originalFileName : '';
    this.relativePath =  data && data.relativePath ? data.relativePath : '' ;
    this.description =  data && data.description ? data.description : '' ;
    this.isImage =  data && data.isImage ? data.isImage : '' ;
    this.documentId =  data && data.documentId ? data.documentId : '' ;
    this.extension =  data && data.extension ? data.extension : '' ;
    this.size =  data && data.size ? data.size : '' ;
    this.awsImage = awsImageInfo ? awsImageInfo : '';
  }
}



