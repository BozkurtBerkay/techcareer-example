const _ = require('lodash');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { userLogModel } = require('../models/userLog');

const userController = {
    getUsers: async (req, res) => {
        const query = {};
        let fields = req.query.fields;

        !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

        !_.isUndefined(req.query.name) ? query.name = req.query.name : '';
        !_.isUndefined(req.query.email) ? query.email = req.query.email : '';

        userModel.find(query, fields, (err, docs) => {
            if (!err) return res.status(200).json(docs);

            res.status(500).json({ message: err.message });
        })
    },
    getUser: async (req, res) => {
        userModel.find({ _id: req.params.id }, (err, docs) => {
            if (!err) return res.status(200).json(docs);
            res.status(500).json({ message: err.message });
        })
    },
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await userModel.findOne({ email })
            if (user) return res.status(400).json({ message: "The email already exists." })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new userModel({
                name, email, password: passwordHash
            })

            await newUser.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'Registration Successful', data: doc })
                res.status(500).json({ message: err })
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await userModel.findOne({ _id: req.params.id })
            if (!user) return res.status(404).json({ message: "User not found" })
            const passwordHash = await bcrypt.hash(password, 10)
            user.name = name;
            user.password = passwordHash;
            await user.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'User updated successfully', data: doc })
                res.status(500).json({ message: err })
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params.id })
            if (!user) return res.status(404).json({ message: "User not found" })

            user.remove((err, doc) => {
                if (err) return res.status(500).json({ message: err.message })
                res.status(200).json({ message: 'User deleted successfully', data: doc })
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email })
            if (!user) return res.status(404).json({ message: "User not found" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                let userLog = new userLogModel({
                    userId: user._id,
                    loginType: "Failed",
                    ipAddress: req.socket.remoteAddress
                })
                userLog.save((err, doc) => {
                    if(err) return res.status(400).json({ message: err._message })
                    user.failLoginCount = user.failLoginCount + 1;

                    user.save((err, doc) => {
                        if(err) return res.status(400).json({ message: err})
                    })
                })
                return res.status(400).json({ message: "Wrong Password!..." })
            }

            let userLog = new userLogModel({
                userId: user._id,
                loginType: 'Success',
                ipAddress: req.socket.remoteAddress
            })

            userLog.save((err, doc) => {
                if (err) return res.status(err).json({ message: err._message })
                user.failLoginCount = 0;
                user.save((err, doc) => {
                    if (err) return res.status(err).json({ message: err._message })
                })
                res.status(200).json({ message: "Login successful" })
            })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = userController