import userModel from "../models/userModel.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           description: User first name
 *         last_name:
 *           type: string
 *           description: User last name
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password
 *         location:
 *           type: string
 *           description: User location (optional)
 */

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
export const registerController = async (req, res, next) => {
  try {
    const { first_name, email, password,last_name,location } = req.body;
    // validation
    if (!first_name) {
      return next({ message: "Name is required", statusCode: 400 });
    }
    if (!email) {
      return next({ message: "Email is required", statusCode: 400 });
    }

    if (!password) {
      return next({
        message: "Password is required and should be greator than 6 character",
        statusCode: 400,
      });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      //   return res.status(200).send({
      //     message: "Email already register please login",
      //     success: false,
      //     statusCode: 200
      //   });

      // use error handler middleware for error messages
      return next({
        message: "Email already exist please login",
        statusCode: 400,
      });
    }

    // the validation of database will perform here while creating the user like email validation or password length validation
    // and go in catch block if any validation error comes
    const user = await userModel.create({ first_name, email, password,last_name,location });

    // create token for the user
    const token = await user.createJWT();

    return res.status(201).send({
      message: "User registered successfully",
      success: true,
      user,
      token,
    });
  } catch (error) {
    // console.log(error);
    // return res
    //   .status(400)
    //   .send({ message: "Error in register controller", success: false, error });
    // now we can call errorhandler middleware
    return next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
export const loginController = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    // validate email and password
    if (!email || !password) {
      return next({ message: "Please provide all feild", statusCode: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return next({ message: "User not found", statusCode: 404 });
    }
    // compare password
    const passwordMatch = await user.comparePassword(password);
    if(!passwordMatch){
      return next({message:"Invalid password", statusCode:400})
    }

    // again generate JWT token for security purposes in authentication we always generate token in both register and login APIs
    const token = await user.createJWT();

    return res.status(200).send({
      message: "User logged in successfully",
      success: true,
      user,
      token,
    });
  } catch (error) {
    return next(error);
  }
};
