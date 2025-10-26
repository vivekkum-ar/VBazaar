import jwt from 'jsonwebtoken'

export const authUser = async (req, res, next) => {
  const {token} = req.cookies;
  if(!token){
    return res.json({ success: false, message: "Not Authorised" });
  }
  try {
    const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
    if(tokenDecode.id){
        console.log(tokenDecode.id);
        req.body = {...req.body};
        req.body.userId = tokenDecode.id;
        console.log("userID",req.body.userId);
    }else{
      return res.json({ success: false, message:"Not Authorised" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}