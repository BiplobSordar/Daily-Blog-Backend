import Blog from "../models/Blog.js";



export const getAllBlogs = async (req, res) => {
  try {

    const blogs = await Blog.find()
      .populate("author", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};


export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id)
      .populate("author", "name email")
      .populate("category", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Blog ID" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, content, featuredImage, category, tags, feture, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, content, and category are required" });
    }

    const blog = new Blog({
      title,
      subtitle,
      content,
      featuredImage,
      category,
      tags,
      feture: feture || false,
      status: "published",
      publishedAt: new Date(),
      author: req.user._id,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    console.error("CreateBlog Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getMyBlogs = async (req, res) => {

  try {

    const userId = req.user._id;



    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("category");

    




    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });

  } catch (error) {
    console.error("getMyBlogs Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id.toString();

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });


    const authorId = blog.author._id
      ? blog.author._id.toString()
      : blog.author.toString();

    if (authorId !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Blog.deleteOne({ _id: blogId });
    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
