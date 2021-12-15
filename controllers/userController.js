require('dotenv').config();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require('../models/userModel');
const { Product } = require('../models/productModel');
const { userLogModel } = require('../models/userLog');

const userController = {
    getUsers: async (req, res) => {
        const query = {};
        let fields = req.query.fields;

        !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

        User.find(query, fields, (err, docs) => {
            const users = docs.map(user => {
                return {
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                }
            })
            if (!err) return res.status(200).json(users);

            res.status(500).json({ message: err.message });
        })
    },
    getUser: async (req, res) => {
        try {
            const user = await User.find({ _id: req.params.id }).populate('products').exec();

            if (!user) return res.status(404).json({ message: 'User not found' });

            //await getUserProducts(req.params.id, user);

            const mapUser = user.map(user => {
                return {
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive,
                    products: user.products,
                }
            })
            res.status(200).json(mapUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ message: "The email already exists." })

            const passwordHash = await bcrypt.hash(password, process.env.PASSWORD_KEY * 1)
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(), name, email, password: passwordHash
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
            const user = await User.findOne({ _id: req.params.id })
            if (!user) return res.status(404).json({ message: "User not found" })
            const passwordHash = await bcrypt.hash(password, process.env.PASSWORD_KEY * 1)
            user.name = name;
            user.password = passwordHash;
            user.email = user.email;
            user.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'User updated successfully', data: doc })
                res.status(500).json({ message: err })
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id })
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
            const user = await User.findOne({ email })
            if (!user) return res.status(404).json({ message: "User not found" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                let userLog = new userLogModel({
                    userId: user._id,
                    loginType: "Failed",
                    ipAddress: req.socket.remoteAddress
                })
                userLog.save((err, doc) => {
                    if (err) return res.status(400).json({ message: err._message })
                    user.failLoginCount = user.failLoginCount + 1;

                    user.save((err, doc) => {
                        if (err) return res.status(400).json({ message: err })
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

const getUserProducts = async (id, user) => {
    try {
        const products = await Product.find({ userId: id });
        if (products) {
            user[0].product = products.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    quantityPerUnit: item.quantityPerUnit,
                    unitPrice: item.unitPrice,
                    unitsInStock: item.unitsInStock,
                    discontinued: item.discontinued
                }
            });

            return user[0].product;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = userController