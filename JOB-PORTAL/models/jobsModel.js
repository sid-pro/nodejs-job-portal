import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company Name is required"],
    },
    position: {
      type: String,
      required: [true, "Position Name is required"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    work_type: {
      type: String,
      enum: ["full_time", "part_time", "freelance", "internship"],
      default: "full_time",
    },
    work_location: {
      type: String,
      default: "Bangalore",
    },
    // foregin key of user who applied for this job
    // createdBy is name of user who applied for this job
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
