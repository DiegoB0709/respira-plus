import {Router} from 'express';
import {
  getUserProfile,
  getAllUsers,
  updateUser,
  getDoctors,
} from "../controllers/user.controller.js";
import {authRequired} from '../middlewares/authRequired.js';
import {authorizeRole} from '../middlewares/authorizeRole.js';

const router = Router();

router.get("/", authorizeRole("admin"), getAllUsers);

router.get("/doctors", authorizeRole("admin, doctor"), getDoctors);

router.get('/profile', authRequired, getUserProfile);

router.patch('/update', authRequired, updateUser);

export default router;