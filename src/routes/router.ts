import express from 'express'
import { getUser, loginUser, logoutUser, registerUser, showWelcome } from '../controller/user';
import { authUser } from '../middlewares/authUser';

const router = express.Router();

router.get('/user/:id', authUser, getUser)
router.get('/logout', authUser, logoutUser)
router.post('/create', registerUser)
router.post('/login', loginUser)
export default router;