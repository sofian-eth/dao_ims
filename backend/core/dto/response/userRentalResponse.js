
class userRentalStats {
    
  constructor(data) {
    this.propertyName = data.propertyName,
    this.propertyLogo = data.propertyLogo,
    this.area = data.area,
    this.occupancyPercentage = data.occupancyPercentage,
    this.rentPerUnit = data.rentPerUnit,
    this.creditsPerUnit = data.creditsPerUnit,
    this.disbursedAt = data.disbursedAt,
    this.rentalStats = data.status,
    this.rentDisbursementDuration = this.getRentalDisbursementDuration(data.rentDisbursementDuration),
    this.rentDisbursementTime = data.rentDisbursementTime,
    this.rentDisbursementYear = data.rentDisbursementYear;

  }


  getRentalDisbursementDuration(duration){
   

    switch (duration){
        case (duration = 3):
            return 'Quarter';
        case (duration = 6):
            return 'Bi-Annual';
        case (duration = 12):
            return 'Annual'

    }

  }


}
  


module.exports = {userRentalStats};