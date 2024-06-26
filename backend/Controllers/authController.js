import User from '../models/UserSchema.js';
import Counselor from '../models/CounselorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const generateToken = user=>{
    return jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET_KEY, {
        expiresIn:"15d",
    })
}

export const register = async(req,res)=>{

    const {email, password, name, role, photo, gender} = req.body

    try {    

        let user = null

        if(role==='client'){
            user = await User.findOne({email});
        }
        else if(role==='counselor'){
            user = await Counselor.findOne({email})
        }

        //check is user exist
        if(user){
            return res.status(400).json({message:'User already exist'})
        }


        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        if(role==='client'){
            user = new User({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }

        if(role==='counselor'){
            user = new Counselor({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()

        res
        .status(200)
        .json({success:true, message:'User successfully created'});

    } catch (err) {
        res
        .status(500)
        .json({success:false, message:'Internal server error, Try again'});
    }
}

export const login = async(req,res)=>{

    const {email, password} = req.body

    try {   
        
        let user = null

        const client = await User.findOne({email})
        const counselor = await Counselor.findOne({email})

        if(client){
            user = client
        }
        if(counselor){
            user = counselor
        }

        //check if user exist or not
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        //compare password
        const isPasswordMatch = await bcrypt.compare(
            req.body.password, 
            user.password
        );

        if(!isPasswordMatch){
            return res
            .status(400)
            .json({ status:false, message: "Invalid credentials"});
        }

        //get token
        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc

        res
        .status(200)
        .json({ status:true, message: "Successfully login", token, data:{...rest}, role });

    } catch (err) {    
        res
        .status(500)
        .json({ status:false, message: "Failed to login" });
    }
}