import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createGroup).get(protect, getGroups);
router
  .route("/:id")
  .get(protect, getGroup)
  .put(protect, updateGroup)
  .delete(protect, deleteGroup);
router.route("/:id/add-member").put(protect, addMember);
router.route("/:id/remove-member").put(protect, removeMember);

export default router;