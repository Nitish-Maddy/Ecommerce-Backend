const authServices = require("../services/auth.services");


const register = async (req, res, next) => {
    try {
        const { email, username, password, role } = req.body;
        const { user, token } = await authServices.register({ username, email, password, role });
        res.status(201).json({ success: true, user, token });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authServices.login({ email, password });
        res.status(200).json({ success: true, user, token });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = { register, login };