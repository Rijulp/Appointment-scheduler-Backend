// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     counselor: {
//       type: mongoose.Types.ObjectId,
//       ref: "Counselor",
//       required: true,
//     },
//     user: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     ticketPrice: { type: String, required: true },
    
//     status: {
//       type: String,
//       enum: ["pending", "approved", "cancelled"],
//       default: "pending",
//     },
//     isPaid: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    counselor: {
      type: Schema.Types.ObjectId,
      ref: 'Counselor',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
