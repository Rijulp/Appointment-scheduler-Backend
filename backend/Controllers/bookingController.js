// import User from "../models/UserSchema.js";
// import Counselor from "../models/CounselorSchema.js";
// import Booking from "../models/BookingSchema.js";
// import Stripe from "stripe";

// export const getCheckoutSession = async(req, res)=>{
//     try {
        

//         //get currently booked counselor
//         const counselor = await Counselor.findById(req.params.counselorId)
//         const user = await User.findById(req.userId)

//         const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//         //create stripe checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types:['card'],
//             mode:"payment",
//             success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
//             cancel_url:`${req.protocol}://${req.get("host")}/counselors/${counselor.id}`,
//             customer_email:user.email,
//             client_reference_id:req.params.counselorId,
//             line_items:[
//                 {
//                     price_data:{
//                         currency:"inr",
//                         unit_amount:counselor.ticketPrice * 100,
//                         product_data:{
//                             name:counselor.name,
//                             description:counselor.bio,
//                             images:[counselor.photo]
//                         }
//                     },
//                     quantity:1
//                 }
//             ]
//         })


//         //create new booking
//         const booking = new Booking({
//             counselor:counselor._id,
//             user:user._id,
//             ticketPrice:counselor.ticketPrice,
//             session:session.id
//         })

//         await booking.save()

//         res.status(200)
//         .json({success:true, message:"Successfully paid", session})

//     } catch (err) {

//         console.log(err)

//                 res
//                 .status(500)
//                 .json({success:false, message:"Error creating checkout session" })

//     }
// };

const Booking = require('../models/Booking');
const User = require('../models/User'); // Assuming you have a User model
const Counselor = require('../models/Counselor'); // Assuming you have a Counselor model

// Controller to fetch bookings for a specific user (client)
exports.getBookingsForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in params
    const bookings = await Booking.find({ user: userId }).populate('counselor');

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to fetch bookings for a specific counselor
exports.getBookingsForCounselor = async (req, res) => {
  try {
    const counselorId = req.params.counselorId; // Assuming counselorId is passed in params
    const bookings = await Booking.find({ counselor: counselorId }).populate('user');

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


