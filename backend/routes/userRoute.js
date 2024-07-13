const express = require("express");
const { isAuthenticatedUser, authorizeroles } = require("../middleware/auth");
const {
  RegisterUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  GetAllUser,
  GetSingleUser,
  getSingleUser,
  getAllUsers,
  updateRole,
  deleteUser,
} = require("../controllers/userControler");

const router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/forgot/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeroles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeroles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeroles("admin"), updateRole)
  .delete(isAuthenticatedUser, authorizeroles("admin"), deleteUser);

module.exports = router;
