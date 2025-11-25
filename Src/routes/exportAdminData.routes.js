import {Router} from 'express';
import { generateReportPDF } from "../controllers/exportAdminData.controller.js";
import {authorizeRole} from '../middlewares/authorizeRole.js';

const router = Router();

router.get("/", authorizeRole("admin"), generateReportPDF);
router.get("/:id", authorizeRole("admin"), generateReportPDF);

export default router;