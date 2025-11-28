import express from "express";
import { getAllBlogs, getBlogById,createBlog,getMyBlogs,deleteBlog} from "../controllers/blogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/", getAllBlogs);

router.get("/my-blogs/my", authMiddleware, getMyBlogs);
router.get("/:id", getBlogById);

router.post("/", authMiddleware, createBlog);




router.delete("/delete/:id", authMiddleware, deleteBlog);


export default router;
