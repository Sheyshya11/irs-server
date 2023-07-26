const { Router } = require("express");
const {
  createNewItem,
  getItemsById,
  getAllItems,
  requestItems,
  getRequestItemsByName,
  getVisitCount,
} = require("../controller/itemController");
const { isAdmin, Auth } = require("../middleware/auth");
const router = Router();
router.use(Auth);

// router.route("/:id").get(getItemsById);
router.route("/:name").get(getRequestItemsByName);
router.route("/").get(getAllItems);
router.route('/visit/:name').get(getVisitCount)
router.route("/").post(isAdmin, createNewItem);
router.route("/requestItem").post(requestItems);

module.exports = router;
