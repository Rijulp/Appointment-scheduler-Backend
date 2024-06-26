
import express from "express";
import { 
    updateCounselor, 
    deleteCounselor, 
    getAllCounselor, 
    getSingleCounselor, 
    getCounselorProfile
} from "../Controllers/counselorController.js";
import { authenticate,restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

//nested route
router.use("/:counselorId/reviews", reviewRouter);

router.get('/:id', getSingleCounselor);
router.get('/', getAllCounselor);
router.put('/:id', authenticate,restrict(['counselor']), updateCounselor);
router.delete('/:id', authenticate,restrict(['counselor']), deleteCounselor);

router.get('/profile/me', authenticate, restrict(['counselor']), getCounselorProfile);

export default router;