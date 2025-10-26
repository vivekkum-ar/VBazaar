import jwt from "jsonwebtoken";

/* ---------------------------------------- seller Login ---------------------------------------- */
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", token, {
        // Prevents client-side JS from reading the cookie
        httpOnly: true,
        // Secure flag ensures the cookie is sent over HTTPS in production
        secure: process.env.NODE_ENV === "production",
        // SameSite attribute to control cross-site sending of the cookie
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        // Cookie expiration set to 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        success: true,
        message: "Logged In",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


/* --------------------------------- Check auth api/seller/is-auth -------------------------------- */
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------- Logout seller /api/seller/logout -------------------------------- */
export const sellerLogout = async (req,res) => {
  try {
    res.clearCookie('sellerToken',{
      // Prevents client-side JS from reading the cookie
      httpOnly: true,
      // Secure flag ensures the cookie is sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // SameSite attribute to control cross-site sending of the cookie
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // Cookie expiration set to 7 days in milliseconds
    });
return res.json({success:true,message:"Logout success"})
  } catch (error) {
     console.log(error.message);
         res.json({
          success: false,
          message: error.message,
        });
  }
} 