const _ = require('lodash');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const userController = {
    getUsers: async (req, res) => {
        const query = {};
        let fields = req.query.fields;

        !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

        !_.isUndefined(req.query.name) ? query.name = req.query.name : '';
        !_.isUndefined(req.query.email) ? query.email = req.query.email : '';

        userModel.find(query, fields, (err, docs) => {
            if (!err) return res.status(200).json(docs);

            res.status(500).json({ msg: err.message });
        })
    },
    getUser: async (req, res) => {
        userModel.find({ _id: req.params.id }, (err, docs) => {
            if (!err) return res.status(200).json(docs);
            res.status(500).json({ msg: err.message });
        })
    },
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await userModel.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new userModel({
                name, email, password: passwordHash
            })

            await newUser.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, msg: 'Registration Successful', data: doc })
                res.status(500).json({ msg: err })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await userModel.findOne({ _id: req.params.id })
            if (!user) return res.status(404).json({ msg: "User not found" })
            const passwordHash = await bcrypt.hash(password, 10)
            user.name = name;
            user.password = passwordHash;
            await user.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, msg: 'User updated successfully', data: doc })
                res.status(500).json({ msg: err })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params.id })
            if (!user) return res.status(404).json({ msg: "User not found" })

            user.remove((err, doc) => {
                if (err) return res.status(500).json({ msg: err.message })
                res.status(200).json({ msg: 'User deleted successfully', data: doc })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = userController