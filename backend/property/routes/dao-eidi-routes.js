const express = require("express");
const eidRoutes = express.Router();
const eidController = require("../Controllers/Investors/eid/eidController");


eidRoutes.post("/send-eidi",
eidController.sendEidi);

eidRoutes.get("/getEidiRecieved",
eidController.getEidiRecieved);


eidRoutes.get("/getEidiSent",
eidController.getEidiSent)

eidRoutes.get("/getEidiCount",
eidController.getEidiCount)
eidRoutes.get("/searchUser",
eidController.searchUser)


module.exports = {eidRoutes}