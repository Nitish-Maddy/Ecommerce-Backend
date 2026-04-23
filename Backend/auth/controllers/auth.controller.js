const authServices = require("../services/auth.services");


const register = async (req, res, next) => {
    try {
        const { name, email, username, password, role } = req.body;

        // Input validation
        if (!name && !username) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const { user, token } = await authServices.register({ name, username, email, password, role });
        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (err) {
        const status = err.message.includes("already exists") ? 400 : 500;
        res.status(status).json({ success: false, message: err.message });
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const { user, token } = await authServices.login({ email, password });
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (err) {
        const status = err.message.includes("Invalid") ? 401 : 500;
        res.status(status).json({ success: false, message: err.message });
    }
};

module.exports = { register, login };