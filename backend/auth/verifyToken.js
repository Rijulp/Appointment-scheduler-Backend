import jwt from "jsonwebtoken";
import Counselor from "../models/CounselorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req,res,next) => {

    //get token from headers
    const authToken = req.headers.authorization;

    //check token is existing
    if(!authToken || !authToken.startsWith('Bearer ')){
        return res
        .status(401)
        .json({success:false, message:"No token, authorization denied"});
    }

    try {
        
        const token = authToken.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decoded.id;
        req.role = decoded.role;

        next(); //must be call the next function
    } catch (err) {
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({ message:"Token is expired" });
        }

        return res.status(401).json({ success:false, message:"Invalid token" });
    }
};

export const restrict = roles => async(req,res,next) => {
    const userId = req.userId;

    let user;

    const client = await User.findById(userId);
    const counselor = await Counselor.findById(userId);
    
    if(client){
        user = client;
    }
    if(counselor){
        user = counselor;
    }

    if(!roles.includes(user.role)){
        return res
        .status(401)
        .json({ success: false, message: "You're not authorized" });
    }

    next();

}

