import userModel from "../models/userModel.js";

/**
 * @swagger
 * tags:
 *   name: user
 *   description: Testing endpoint
 */


/**
 * @swagger
 * /api/v1/user/update-user:
 *   put:
 *     summary: update the details of a user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
export const updateUserController = async (req, res, next) => {
  try {
    const { first_name, last_name, location, email } = req.body;

    const user = await userModel.findOne({ _id: req.user.userId });
    if (!user) {
      return next({ message: "User not found", statusCode: 404 });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (location) user.location = location;
    if (email) user.email = email;

    await user.save();
    // we are creaeting new token because we are also updating the email field and name which is thier in old token
    const token = await user.createJWT();

    return res
      .status(200)
      .json({ user, token, message: "User updated successfully" });
  } catch (error) {
    return next(error);
  }
};

/**
 * @swagger
 * /api/v1/user/get-user-details:
 *   get:
 *     summary: Get user details
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response containing user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userDetails:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 */
export const getUserDetailsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userDetails = await userModel.findById({ _id: userId });
    if (!userDetails) {
      return next({ message: "User not found", statusCode: 404 });
    }

    return res
      .status(200)
      .json({ userDetails, message: "User details updated successfully" });
  } catch (error) {
    return next(error);
  }
};
