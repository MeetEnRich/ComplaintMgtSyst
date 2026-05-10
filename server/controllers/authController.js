const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    const usernameMatch = username === process.env.ADMIN_USERNAME;
    const passwordMatch = usernameMatch
        ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
        : false;

    if (!usernameMatch || !passwordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        token
    });
};

module.exports = { login };