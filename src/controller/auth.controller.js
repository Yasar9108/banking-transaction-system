const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const gmailService = require("../service/gmail.service.js");

// api/auth/register -- post method for user registration

async function registerUserController(req , res){
    console.debug("-->" +  "Entered into registerUser Function : " + Date.now());

    try{
        const gmail = req.body.gmail;   
        const ifUserExit = await userModel.findOne({gmail: gmail})
        if(ifUserExit){
            return res.status(422).json({
                message: " User With this gmail already exist, Please try with another gmail",
                status : "Failed"
            })
        }
        const JSONOBJ = new Object();
        JSONOBJ.gmail = req.body.gmail;
        JSONOBJ.name = req.body.name;
        JSONOBJ.password = req.body.password;
        JSONOBJ.timeStamp = Date.now();

        const user = new userModel(JSONOBJ);
        const records = await user.save();
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "20d"});
        res.cookie("token", token)
        res.status(201).json({
            records : records
        })
        await gmailService.sendRegistrationEmail(user.gmail, user.name);    

    }catch(err){
        res.status(400).json({
            message: " Error in registering userm please tray again",
            status : " Failed"
        })
    }
    console.debug(" Exited from registerUser Function : " + Date.now());    
}

// api/auth/login -- post method for user login

async function loginUserController(req, res){
    console.debug(" -->" + " Entered into loginUser post mehod  : " + Date.now());
    try{
         const gmail = req.body.gmail;
         const password = req.body.password;
         const userExit = await userModel.findOne({gmail : gmail}).select("+password");

         if(!userExit){
            return res.status(404).json({
                message : " User with this gmail does not exist, please try with anpther gmail",
                status : "Failed"
            })
         }

         if(userExit){
            const isPasswordMatch = await userExit.comparePassword(password);

            if(!isPasswordMatch){
                return res.status(401).json({
                    message : " Invalid password, please try again",
                    status : " Failed"
                })
            }

            if(isPasswordMatch){
                const token = await jwt.sign({id: userExit._id}, process.env.JWT_SECRET, {expiresIn: "20d"});
                res.cookie("token", token);
                return res.status(200).json({
                    message : ' User login successfully',
                    status : " Success"
                })
            }
         }

        res.status(200).json({
            message : ' User login successfully',
            status : " Sucess"
        })

    }catch(err){
        res.status(400).json({
            message : " Error on login user , please try again",
            status : " Failed"
        })
    }
    console.debug(" --> " + " Exited from loginUser post method : " + Date.now());
}

module.exports = {
    registerUserController,
    loginUserController
}

