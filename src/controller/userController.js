const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { default: authMe } = require('../middleware/authMe');

const userController = {
    register: async (req, res) => {
        try {
            const { username, password, name } = req.body;
            if (!username || !password || !name) {
                res.status(400).send('Username or password is missing')
                return;
            }
            else {
                const user = await User.findOne({ username: username })
                if (user) {
                    res.status(400).send('Username already exists')
                    return;
                }
                else {
                    const passwordHash = await bcrypt.hash(password, 10);
                    const newUser = new User({
                        username,
                        name,
                        password: passwordHash,
                    });
                    await newUser.save()
                    const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
                    console.log(token)
                    res.send({ token: token })
                }
            }
        }
        catch (err) {
            res.status(500).send({ message: "Internal Server" })
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send('Username or password is missing')
            return;
        }
        const user = await User.findOne({ username: username })
        if (!user) {
            res.status(404).send('User not found')
            return;
        }
        else if (!bcrypt.compare(password, user.password)) {
            res.status(400).send('Incorrect password')
            return;
        }
        else {
            const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
            res.send({ token: token })
        }
    },
}
module.exports = userController