const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");


const generateToken = async (userId) => {
    const secret = process.env.JWT_SECRET || "changeme";
    return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

const register = async ({ username, password, email, role }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('User already exists');

    const userData = { username, email, password };
    if (role && ['user', 'admin'].includes(role)) {
        userData.role = role;
    }

    const user = await User.create(userData);
    const token = await generateToken(user._id);
    return { user, token };
};


const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email not found');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid password');

    const token = await generateToken(user._id);
    return { user, token };
};

module.exports = { register, login, generateToken };