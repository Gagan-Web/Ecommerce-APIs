const express = require("express");
// const { route } = require("../app")
const {
  getAllProducts,
  createproduct,
  Updateproduct,
  DeleteProduct,
  getproductDetailes,
  createproductReview,
} = require("../controllers/productControler");
const { isAuthenticatedUser, authorizeroles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, authorizeroles("admin"), createproduct);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeroles("admin"), Updateproduct)
  .delete(isAuthenticatedUser, authorizeroles("admin"), DeleteProduct);

router.route("/product/:id").get(getproductDetailes);

router.route("/review").put(isAuthenticatedUser,createproductReview);


module.exports = router;
