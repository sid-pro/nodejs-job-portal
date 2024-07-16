
/**
 * @swagger
 * tags:
 *   name: test
 *   description: Testing endpoint
 */

/**
 * @swagger
 * /api/v1/test/test-post:
 *   post:
 *     summary: Test endpoint
 *     tags: [test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with the user's name
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: your name is test
 */
const testController = (req,res) =>{
  const {name} = req.body;
  return res.status(200).send(`your name is ${name}`);
}

export default testController;