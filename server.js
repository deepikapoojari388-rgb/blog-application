const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary storage
let users = [];
let blogs = [];

// Test API
app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

// REGISTER
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const user = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(user);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// CREATE BLOG
app.post("/api/blogs", (req, res) => {
    const { title,category, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            message: "Title, content and author are required"
        });
    }

    const blog = {
        id: blogs.length + 1,
        title,
        category,
        content,
        author,
        createdAt: new Date()
    };

    blogs.push(blog);

    res.status(201).json({
        message: "Blog created successfully",
        blog
    });
});

// GET ALL BLOGS
app.get("/api/blogs", (req, res) => {
    res.json(blogs);
});

// GET SINGLE BLOG
app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find(
        blog => blog.id === parseInt(req.params.id)
    );

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    res.json(blog);
});

// UPDATE BLOG
app.put("/api/blogs/:id", (req, res) => {
    const blog = blogs.find(
        blog => blog.id === parseInt(req.params.id)
    );

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    const { title, content } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;

    res.json({
        message: "Blog updated successfully",
        blog
    });
});

// DELETE BLOG
app.delete("/api/blogs/:id", (req, res) => {
    const index = blogs.findIndex(
        blog => blog.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    blogs.splice(index, 1);

    res.json({
        message: "Blog deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});