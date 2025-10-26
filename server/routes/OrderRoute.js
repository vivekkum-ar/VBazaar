import express from "express"
import {authUser} from "../middleware/authUser.js"
import { authSeller } from "../middleware/authSeller.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from "../controllers/orderController.js";
const orderRouter = express.Router()

orderRouter.post("/cod",authUser,placeOrderCOD);
orderRouter.post("/stripe",authUser,placeOrderStripe);
orderRouter.get("/user",authUser,getUserOrders);
orderRouter.get("/seller",authSeller,getAllOrders);

export default orderRouter;