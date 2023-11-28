class AreaUnitsRequest {
  constructor(obj) {
    this.space_type = obj ? obj.space_type : null;
    this.unit_type = obj ? obj.unit_type : null;
    this.beds = obj ? obj.beds : null;
    this.floor = obj ? obj.floor : null;
    this.property = obj ? obj.property : null;
    this.page = obj ? obj.page : null;
    this.limit = obj ? obj.limit : null;
  }
  get params() {
    return [
      this.space_type,
      this.unit_type,
      this.beds,
      this.floor,
      this.property,
      this.page,
      this.limit,
    ];
  }
}
module.exports = {AreaUnitsRequest}