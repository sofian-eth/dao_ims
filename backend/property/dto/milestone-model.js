module.exports = {
  'milestoneModel': function (data) {
    this.title = data.title,
      this.completionProgress = data.completionProgress,
      this.lastUpdated = data.updatedAt,
      this.mediaUrl = data.mediaUrl,
      this.propertySymbol = data.propertySymbol,
      this.propertyName = data.propertyName,
      this.coverPhoto = data.coverPhoto,
      this.status = data.status,
      this.estimatedDate = data.estimatedDate,
      this.completionDate = data.completionDate
  }
};





