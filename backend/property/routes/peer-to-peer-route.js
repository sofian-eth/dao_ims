const peerToPeer = require("express").Router();
const peerToPeerController = require("./../Controllers/Investors/PeerToPeer/peerToPeerController");
const userPermissions = require('../utils/user-authentication');
peerToPeer.post("/transfer-area"
,userPermissions.checkUserPermissions('FETCH_MILESTONES')
,peerToPeerController.transferArea);

peerToPeer.post("/verify-wallet-address",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.verifyWalletAddress)

peerToPeer.get("/recent-transfer-area",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.recentTransferArea)

peerToPeer.get("/frequent-recipients",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.frequentRecipients)

peerToPeer.post("/frequent-recipients",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.postFrequentRecipients)

peerToPeer.get("/my-area",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.myArea)

peerToPeer.get("/projects",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.projects)

peerToPeer.post("/delete-recipient",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.deleteRecipient)

peerToPeer.post("/edit-recipient",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.editRecipient)

peerToPeer.post("/get-transfer-area-receipt",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.getReceiptData)

peerToPeer.get("/hide-popup",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.hidePopup)

peerToPeer.get("/popup",
userPermissions.checkUserPermissions('FETCH_MILESTONES'),
peerToPeerController.p2p2Popup)

module.exports = {peerToPeer}