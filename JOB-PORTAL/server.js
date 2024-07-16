// imports
// const express = require('express');
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan"; // gives api name response time, status code and other info of API in console
// in JS we need to specify the file extension also unlike in typescript
import connectDb from "./config/db.js";
// swagger import API documentation
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
// routes imports
import testRoutes from "./routes/testRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import jobRoutes from "./routes/jobsRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// dotenv configuration
dotenv.config();

// mongodb connection configuration
connectDb();

// Swagger setup configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "API documentation for Job Portal Application",
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const spec = swaggerJsDoc(options);

// intialize express rest objects
const app = express();

// middleware
app.use(cors()); // to communicate with different port numbers
app.use(morgan("dev"));
app.use(express.json()); // for taking input in json format

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

// swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// after route we execute error middleware  validation middleware
app.use(errorHandler);

// port
const port = process.env.PORT || 3009;

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port} in ${process.env.DEV_MODE}`);
});

// Try to create job portal using MVC architecture only Backend in public folder we can have template engine if we want to use FE.
