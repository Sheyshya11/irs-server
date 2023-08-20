const { Router } = require("express");
const {
  createNewItem,
  getAllItems,
  requestItems,
  getRequestItemsByName,
  getVisitCount,
  getItemsByName,
  editSSID,
  deleteSSID,
  deleteInBulk,
  editInBulk,
} = require("../controller/itemController");
const { isAdmin, Auth } = require("../middleware/auth");
const router = Router();

router.use(Auth);

// router.route("/:id").get(getItemsById);
router.route("/:name").get(getRequestItemsByName);
router.route("/itemList/:name").get(getItemsByName);
router.route("/").get(getAllItems);
router.route("/visit/:name").get(getVisitCount);
router.route("/").post(isAdmin, createNewItem);
router.route("/requestItem").post(requestItems);
router.route("/editssid").put(isAdmin, editSSID);
router.route("/deletessid/:ssid").delete(deleteSSID);
router.route("/deleteInBulk/:name").delete(deleteInBulk);
router.route("/editInBulk").put(editInBulk);

module.exports = router;
