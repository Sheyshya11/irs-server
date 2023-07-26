const { Router } = require("express");

const { isAdmin, Auth } = require("../middleware/auth");
const {
  getRequestedItems,
  approveItemRequest,
  getRequestedItemByQuery,
  ReturnItem,
} = require("../controller/itemController");
const { sendMail } = require("../nodemailer/email");
const router = Router();
router.use(Auth);
router.route("/").get(isAdmin, getRequestedItems);
router.route("/requestedItemByQuery").get(getRequestedItemByQuery);
router.route("/approveRequestItem").put(isAdmin, sendMail, approveItemRequest);
router.route("/returnItem").put(isAdmin, ReturnItem);
router.route("/sendMail").post(sendMail);

module.exports = router;
