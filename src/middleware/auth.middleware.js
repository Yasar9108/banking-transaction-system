const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMddleware(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message : "Unauthorized, please login to access this resource"
        })
    }

    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const userId = await userModel.findById(decoded.id);
        // console.debug("Decoded token : " + JSON.stringify(decoded));
        // console.debug("User ID : " + userId);

        if(!userId){
            return res.status(404).json({
                message : " User not found, please login to access this resource"
            })
        }

        req.user = userId
        next();

    }catch(err){
        return res.status(401).json({
            message : " Invalid token, please login to access this resource"
        })  
    }
}

async function systemAuthMiddleWare(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : " Unauthorized, please login to access this resource"
        })
    }

    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const userId = await userModel.findById(decoded.id);
        // console.debug("Decoded token : " + JSON.stringify(decoded));
        // console.debug("User ID : " + userId);

        if(!userId){
            return res.status(404).json({
                message : " User not found, please login to access this resource"
            })
        }

        req.user = userId;
        // console.debug("-->", JSON.stringify(req.user))
        next();
        

    }catch(err){
        return res.status(401).json({
            message : " Invalid token, please login to access this resource"
        })  
    }
}

module.exports = {authMddleware, systemAuthMiddleWare};
