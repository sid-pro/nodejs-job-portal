import express from 'express';
import testController from '../controllers/testController.js';
import { userAuth } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

//routes
router.get('/',(req,res)=>{
    res.send('Inside router');
})

// send the user token generated from login or register api to execute test controller
router.post('/test-post',userAuth,testController);

export default router;