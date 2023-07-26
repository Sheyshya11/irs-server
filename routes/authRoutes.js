const { Router } = require("express");
const { refresh, login, logout, loginWithGoogle, register, signupwithgoogle } = require("../controller/authController");



const router = Router();

router.route("/refresh").get(refresh);
router.route("/").post(login);
router.route("/logout").post(logout);
router.route("/google").post(loginWithGoogle);
router.route('/register').post(register)
router.route('/google/signup').post(signupwithgoogle)


module.exports = router;
