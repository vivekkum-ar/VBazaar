import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe"
import User from "../models/User.js";
/* ------------------------------ Place Stripe order : /api/order/stripe/ ----------------------------- */
export const placeOrderStripe = async (req, res) => {
  // Part 1: Destructuring, Validation, and Amount Calculation
  try {
    const { userId, items, address } = req.body;
    const {origin} = req.headers;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    // // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
    productData.push({
      name:product.name,
      price: product.offerPrice,
      quantity:item.quantity
    })
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    // Part 2: Order Creation
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "ONLINE",
    });

    /* ------------------------------------- Stripe gateway init ------------------------------------ */
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02)*100,
        },
        quantity:item.quantity,
      };
    })

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode:"payment",
      success_url:`${origin}/loader?next=my-orders`,
      cancel_url:`${origin}/cart`,
      metadata:{
        orderId:order._id.toString(),
        userId
      }
    })

    return res.json({ success: true, url: session.url });
  } catch (error) {
    // ... error handling
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- stripe webhook to verify payment /stripe -------------------------- */
export const stripeWebhooks = async (req,res) => {
      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripeInstance.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        )
      } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
      }
      switch (event.type) {
        case "payment_intent.succeeded":{
          const paymentIntent = event.data.object;
          const paymentIntentId = paymentIntent.id;

          /* ---------------------------------- getting session metadata ---------------------------------- */
          const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId
          })

          const {orderId,userId} = session.data[0].metadata;
          /* ---------------------------------------- Mark as paid ---------------------------------------- */
          await Order.findByIdAndUpdate(orderId,{isPaid:true})
          /* ----------------------------------------- clear cart ----------------------------------------- */
          await User.findByIdAndUpdate(orderId,{cartItems:{}})
          break;

        }
        case "payment_intent.payment_failed":{
          const paymentIntent = event.data.object;
          const paymentIntentId = paymentIntent.id;

          /* ---------------------------------- getting session metadata ---------------------------------- */
          const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId
          })

          const {orderId} = session.data[0].metadata;
          await Order.findByIdAndDelete(orderId);
          break;

        }
        default:
          console.error("Unhandled Error type: ",event.type);break; 
      }
      res.json({received:true});
}

/* ------------------------------ Place COD order : /api/order/cod/ ----------------------------- */
export const placeOrderCOD = async (req, res) => {
  // Part 1: Destructuring, Validation, and Amount Calculation
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    // Part 2: Order Creation
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    // ... error handling
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------------------- get orders by userId /api/order/user ---------------------------- */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }] 
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
        console.log("Error is Here",error.message);
    return res.json({ success: false, message: error.message });
  }
};

/* ------------------------------ Get all orders /api/order/seller ------------------------------ */
export const getAllOrders = async (req,res) => {
    try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
   return res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}