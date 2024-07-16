import { Router } from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getAllJobController,
  getJobController,
  getJobsStatsController,
  updateJobController,
} from "../controllers/jobsController.js";

const router = Router();

// routes

router.post("/create-job", userAuth, createJobController);
router.get("/get-job/:id", getJobController);
// get all jobs of a user
router.get("/get-all-jobs", userAuth, getAllJobController);
// update jobs of a user
router.patch("/update-job/:id", userAuth, updateJobController);
// delete jobs of a user
router.delete("/delete-job/:id", userAuth, deleteJobController);

// JOBS stats and filter thats why we have dummy data in JSON file
router.get("/job-stats", userAuth, getJobsStatsController);

export default router;
