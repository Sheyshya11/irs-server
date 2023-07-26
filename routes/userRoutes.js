const { Router } = require("express");
const {
  updateUser,
  deleteUser,
  getAllUsers,
  createPassword,
  getUser,
  getApproval,
} = require("../controller/userController");
const { Auth, isAdmin } = require("../middleware/auth");
const router = Router();

router.use(Auth);

router
  .route("/")
  .get(getAllUsers) //get all user
  .patch(updateUser) //update user
  .delete(deleteUser); //delete user
router.route("/:id").get(getUser); // get single user info
router.route("/createPass").patch(createPassword);
router.route("/approve").put(isAdmin, getApproval);

module.exports = router;
