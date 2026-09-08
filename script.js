function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return false;
    }

    return true;
}
const API_URL = "https://blog-application-1-jacw.onrender.com";

/* =========================
   REGISTER
========================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful!");
            window.location.href = "login.html";

        } catch (error) {
            console.error(error);
            alert("Cannot connect to backend.");
        }
    });
}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            /* Save JWT token */
            localStorage.setItem("token", data.token);

            /* Save user information */
            localStorage.setItem("user", JSON.stringify(data.user));

            localStorage.setItem("loggedIn", "true");

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error(error);
            alert("Cannot connect to backend.");
        }
    });
}


/* =========================
   CHECK LOGIN
========================= */

function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


/* =========================
   CREATE BLOG
========================= */

const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const title = document.getElementById("blogTitle").value;
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value;

        try {
            const response = await fetch(`${API_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Blog published successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error(error);
            alert("Cannot connect to backend.");
        }
    });
}


/* =========================
   GET ALL BLOGS
   Used for public/home page
========================= */

async function getAllBlogs() {
    try {
        const response = await fetch(`${API_URL}/api/blogs`);

        const data = await response.json();

        if (!response.ok) {
            return [];
        }

        return data;

    } catch (error) {
        console.error("Get blogs error:", error);
        return [];
    }
}


/* =========================
   GET ONLY MY BLOGS
   Used for Dashboard
========================= */

async function getMyBlogs() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return [];
    }

    try {

        const response = await fetch(`${API_URL}/api/my-blogs`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to load your blogs.");
            return [];
        }

        return data;

    } catch (error) {
        console.error("My blogs error:", error);
        alert("Cannot connect to backend.");
        return [];
    }
}


/* =========================
   DISPLAY BLOGS
========================= */

function displayBlogs(blogs, containerId = "myBlogs") {

    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    if (blogs.length === 0) {
        container.innerHTML = `
            <p>No blogs found.</p>
        `;
        return;
    }

    container.innerHTML = "";

    blogs.forEach(blog => {

        const blogCard = document.createElement("div");

        blogCard.className = "blog-card";

        blogCard.innerHTML = `
            <h3>${blog.title}</h3>

            <p>
                <strong>Category:</strong>
                ${blog.category}
            </p>

            <p>
                ${blog.content}
            </p>

            <small>
                Author: ${blog.author}
            </small>
        `;

        container.appendChild(blogCard);
    });
}
async function getMyBlogs() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/api/my-blogs`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to load your blogs.");
            return [];
        }

        return data;

    } catch (error) {
        console.error(error);
        alert("Cannot connect to backend.");
        return [];
    }
}

/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

    if (!checkLogin()) {
        return;
    }

    const savedUser = localStorage.getItem("user");

    if (savedUser) {

        const user = JSON.parse(savedUser);

        const welcomeUser = document.getElementById("welcomeUser");

        if (welcomeUser) {
            welcomeUser.textContent = `Welcome, ${user.name}!`;
        }
    }

    /* IMPORTANT:
       Get ONLY logged-in user's blogs
    */

    const blogs = await getMyBlogs();

    displayBlogs(blogs, "myBlogs");
}


/* =========================
   PROFILE
========================= */

async function loadProfile() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");

        if (profileName) {
            profileName.textContent = data.name;
        }

        if (profileEmail) {
            profileEmail.textContent = data.email;
        }

    } catch (error) {
        console.error(error);
    }
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");

    alert("Logged out successfully!");

    window.location.href = "login.html";
}


/* =========================
   LOAD DASHBOARD
========================= */

if (document.getElementById("myBlogs")) {
    loadDashboard();
}


/* =========================
   LOAD PROFILE
========================= */

if (
    document.getElementById("profileName") ||
    document.getElementById("profileEmail")
) {
    loadProfile();
}