import mongoose from "mongoose";
import Counselor from "./CounselorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    Counselor: {
      type: mongoose.Types.ObjectId,
      ref: "Counselor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(counselorId){
  //this points the current review
  const stats = await this.aggregate([{
    $match:{counselor:counselorId}
  },
{
  $group:{
    _id:'$counselor',
    numofRating:{$sum:1},
    avgRating:{$avg:'$rating'},
  },
},
]);

await Counselor.findByIdAndUpdate(counselorId, {
  totalRating: stats[0].numofRating,
  averageRating: stats[0].avgRating,
});
};

reviewSchema.post('save', function(){
  this.constructor.calcAverageRatings(this.counselor);
});

export default mongoose.model("Review", reviewSchema);
