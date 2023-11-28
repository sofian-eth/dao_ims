class addressBookResponse {
  constructor(data) {
    this.id = data && data.id > 0 ? data.id : 0;
    this.addressLine1 = data ? data.addressLine1 : '';
    this.addressLine2 = data ? data.addressLine2 : '';
    this.city = data ? data.city : '';
    this.country = data ? data.country : '';
    this.isShipping = data ? data.isShipping : 1;
    this.userID = data ? data.userID : 0;
    this.createdAt = data.createdAt ? new Date(data.createdAt).toDateString("MM-dd-yyyy") : '';
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt).toDateString("MM-dd-yyyy") : '';
  }
};
module.exports = { addressBookResponse }
