const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const generateToken = (userId, email, role) => {
    const secret = process.env.JWT_SECRET || "changeme";
    return jwt.sign({ id: userId, email, role: role || "user" }, secret, { expiresIn: '30d' });
};

const register = async ({ name, username, password, email, role }) => {
    // Validate required fields
    const finalName = (name || username || "").trim();
    if (!finalName) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");

    const existing = await User.findOne({ email });
    if (existing) throw new Error('User already exists');

    const userData = { name: finalName, email, password };
    if (role && ['user', 'admin'].includes(role)) {
        userData.role = role;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id, user.email, user.role);
    return { user, token };
};


const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid email or password');

    // Handle case where stored password is not hashed (legacy data)
    if (user.password && !user.password.startsWith('$2')) {
        // Password was stored as plain text — rehash it now
        if (user.password === password) {
            user.password = password; // pre-save hook will hash it
            await user.save();
            const token = generateToken(user._id, user.email, user.role);
            return { user, token };
        }
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = generateToken(user._id, user.email, user.role);
    return { user, token };
};

module.exports = { register, login, generateToken };