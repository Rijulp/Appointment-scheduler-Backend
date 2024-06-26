import Booking from "../models/BookingSchema.js";
import Counselor from "../models/CounselorSchema.js";

export const updateCounselor = async(req,res)=>{
    const id = req.params.id;

    try {
        const updatedCounselor = await Counselor.findByIdAndUpdate(
            id, 
            { $set:req.body }, 
            { new:true }
        );
        
        res
        .status(200)
        .json({
            success:true, 
            message: 'Successfully updated', 
            data:updatedCounselor
        });

    } catch (err) {
        res.status(500).json({success:false, message: 'Failed to update' });
    }
};

export const deleteCounselor = async(req,res)=>{
    const id = req.params.id;

    try {
        await Counselor.findByIdAndDelete(id);
        
        res
        .status(200)
        .json({
            success:true, 
            message: 'Successfully deleted', 
           
        });

    } catch (err) {
        res.status(500).json({success:false, message: 'Failed to delete' });
    }
};
export const getSingleCounselor = async(req,res)=>{
    const id = req.params.id;

    try {
        const counselor = await Counselor.findById(id)
        .populate("reviews")
        .select("-password");
        
        res
        .status(200)
        .json({
            success:true, 
            message: 'User found', 
            data: counselor,
        });

    } catch (err) {
        res.status(404).json({success:false, message: 'No user found' });
    }
};

export const getAllCounselor = async(req,res)=>{
    

    try {

        const { query } = req.query;
        let counselors;

        if(query) {
            counselors = await Counselor.find({
                isApproved:'approved', 
                $or:[
                    { name: { $regex: query, $options: 'i' } }, 
                    { specialization: { $regex: query, $options: 'i' } },
                ],
                }).select("-password");
        } else {
             counselors = await Counselor.find({ isApproved: "approved" }).select(
                "-password"
            );
        }

        res
        .status(200)
        .json({
            success:true, 
            message: 'Users found', 
            data:counselors,
        });

    } catch (err) {
        res.status(404).json({success:false, message: 'Not found' });
    }
};

export const getCounselorProfile = async(req, res)=>{
    const counselorId = req.userId;//might change to counselorId

    try {
        const counselor = await Counselor.findById(counselorId);

        if(!counselor) {
            return res
            .status(404)
            .json({ success:false, message: "Counselor not found" });
        }

        const { password, ...rest } = counselor._doc;
        const appointments = await Booking.find({counselor:counselorId})

        res
        .status(200)
        .json({
            success: true,
            message: "Profile info is getting",
            data: { ...rest, appointments },
        });
    } catch (err) {
        res
        .status(500)
        .json({ success: false, message: "Something went wrong, cannot get"});
    }
}