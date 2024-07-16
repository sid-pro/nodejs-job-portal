import mongoose from "mongoose";
import jobsModel from "../models/jobsModel.js";

/**
 * @swagger
 * tags:
 *   name: jobs
 *   description: Jobs CRUD API documentation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Jobs:
 *       type: object
 *       required:
 *         - company
 *         - position
 *       properties:
 *         company:
 *           type: string
 *           description: User company name
 *         position:
 *           type: string
 *           description: User position in the company
 *         status:
 *           type: string
 *           description: User email address
 *         work_type:
 *           type: string
 *           description: User password
 *         work_location:
 *           type: string
 *           description: User location (optional)
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *   post:
 *     summary: Create a new job listing
 *     tags: [jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jobs'
 *     responses:
 *       '200':
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newJob:
 *                   $ref: '#/components/schemas/Jobs'
 *                 message:
 *                   type: string
 */
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;

    if (!company || !position)
      return next({
        message: "Please Provide all information",
        statusCode: 404,
      });

    req.body.createdBy = req.user.userId;
    const newJob = await jobsModel.create(req.body);

    return res
      .status(200)
      .json({ newJob, message: "Job created successfully" });
  } catch (error) {
    return next(error);
  }
};


/**
 * @swagger
 * /api/v1/job/get-job/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to retrieve
 *     responses:
 *       '200':
 *         description: get job details successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobDetails:
 *                   $ref: '#/components/schemas/Jobs'
 *                 message:
 *                   type: string
 */
export const getJobController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const jobDetails = await jobsModel.findById(id);
    if (!jobDetails) {
      return next({ message: "Job not found", statusCode: 404 });
    }

    return res.status(200).json({ jobDetails });
  } catch (error) {
    return next(error);
  }
};

// in this controller we recieve value from query to apply search parameters
/**
 * @swagger
 * /api/v1/job/get-all-jobs:
 *   get:
 *     summary: Get all jobs based on filters, with pagination
 *     tags: [jobs]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter jobs by status (pending, reject,interview)
 *       - in: query
 *         name: work_type
 *         schema:
 *           type: string
 *         description: Filter jobs by work type (full-time, part-time,freelance,intership)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Perform a partial search on job positions (case-insensitive)
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The maximum number of items to return per page (default is 10)
 *     responses:
 *       '200':
 *         description: Successful response containing jobs based on filters and pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobDetails:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Jobs'
 *                 totalJobs:
 *                   type: integer
 *                   description: Total number of jobs matching the query criteria
 *     security:
 *       - bearerAuth: []
 */
export const getAllJobController = async (req, res, next) => {
  try {
    const createdBy = req.user.userId;
    const { status, work_type, search } = req.query;
    // conditions for searching filters
    const queryObject = {
      createdBy: createdBy,
    };

    if (status) {
      queryObject.status = status;
    }
    if (work_type) {
      queryObject.work_type = work_type;
    }

    // partial search
    if (search) {
      queryObject.position = { $regex: search, $options: "i" }; // case insensitive "i" for case-insensitive search
    }

    //pagination
    const pageNo = req.query.pageNo || 1;
    const limit = req.query.limit || 10;

    // how many page to skip when page no is specified
    const skip = (pageNo - 1) * limit;

    // find all jobs and sorted in descending order of creation

    const jobDetails = await jobsModel
      .find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // const jobDetails = await jobsModel.find({ createdBy: createdBy });
    if (!jobDetails) {
      return next({ message: "Job not found", statusCode: 404 });
    }

    //  Total count of jobs matching the query criteria
    const totalCount = await jobsModel.countDocuments(queryObject);

    return res.status(200).json({ jobDetails, totalJobs: totalCount });
  } catch (error) {
    return next(error);
  }
};

/**
 * @swagger
 * /api/v1/job/update-job/{id}:
 *   patch:
 *     summary: Update a job listing by ID
 *     tags: [jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: Updated company name
 *               position:
 *                 type: string
 *                 description: Updated job position
 *     responses:
 *       '200':
 *         description: Successful response containing the updated job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Jobs'
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */
export const updateJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    const id = req.params.id;
    const createdBy = req.user.userId;

    const job = await jobsModel.findOneAndUpdate(
      { _id: id, createdBy },
      {
        company,
        position,
      },
      { new: true } // // Return the updated document
    );
    if (!job) {
      return next({ message: "Job not found", statusCode: 404 });
    }

    return res.status(200).json({ job, message: "Job updated successfully" });
  } catch (error) {
    return next(error);
  }
};


/**
 * @swagger
 * /api/v1/job/delete-job/{id}:
 *   delete:
 *     summary: Delete a job listing by ID
 *     tags: [jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to delete
 *     responses:
 *       '200':
 *         description: Successful response indicating job deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const deleteJobController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const createdBy = req.user.userId;

    const job = await jobsModel.deleteOne({ _id: id, createdBy });
    if (job.deletedCount === 0) {
      return next({ message: "Job not found", statusCode: 404 });
    }

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// JOBS stats and filters
/**
 * @swagger
 * /api/v1/job/job-stats:
 *   get:
 *     summary: Get statistics of jobs created by the user
 *     tags: [jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response containing job statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: The status of the jobs
 *                       count:
 *                         type: integer
 *                         description: The count of jobs with the specified status
 *                 count:
 *                   type: integer
 *                   description: The total number of job status entries
 *                 monthlyStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         description: The year of the job creation
 *                       month:
 *                         type: integer
 *                         description: The month of the job creation
 *                       count:
 *                         type: integer
 *                         description: The count of jobs created in the specified month and year
 */

export const getJobsStatsController = async (req, res, next) => {
  try {
    const createdBy = req.user.userId;
    const stats = await jobsModel.aggregate([
      //search for user jobs
      // this will give all data with required userId
      // {
      //     $match:{
      //         createdBy:new mongoose.Types.ObjectId(createdBy)   // to get the object we use new keyword
      //     }
      // }

      // using both match and group
      // we now recive values on basis of status and thier count
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(createdBy), // to get the object we use new keyword
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }, // $sum:1 means increment the count by 1
        },
      },
      // to use alias
      {
        $project: {
          _id: 0, // Exclude the default _id field
          status: "$_id", // Rename _id to status
          count: 1, // Include the count field
        },
      },
    ]);

    // monthly yearly stats
    const monthlyStats = await jobsModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(createdBy), // to get the object we use new keyword
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          year: "$_id.year", // Project the year from _id to a top-level field
          month: "$_id.month", // Project the month from _id to a top-level field
          count: 1, // Include the count field
        },
      },
    ]);

    return res.status(200).json({ stats, count: stats.length, monthlyStats });
  } catch (error) {
    return next(error);
  }
};
