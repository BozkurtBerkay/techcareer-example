require('dotenv').config();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
            const user = await User.find({ _id: req.params.id });

            if (!user) return res.status(404).json({ message: 'User not found' });

            //await getUserProducts(req.params.id, user);

            const mapUser = user.map(user => {
                return {
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                    //products: user.products,
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

            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            await newUser.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'Registration Successful', token: accesstoken })
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

            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            userLog.save((err, doc) => {
                if (err) return res.status(err).json({ message: err._message })
                user.failLoginCount = 0;
                user.save((err, doc) => {
                    if (err) return res.status(err).json({ message: err._message })
                })
                res.status(200).json({ success: true, message: "Login successful", token: accesstoken })
            })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    authGoogle: async (req, res) => {
        try {
            const accesstoken = createAccessToken({ id: req.user._id })
            const refreshtoken = createRefreshToken({ id: req.user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            res.status(200).json({ success: true, message: 'User logged in successfully', token: accesstoken })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },
    getAllProducts: async (req, res) => {
        try {
            const user = await User.find({ user: req.params.id }).populate("products");
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' })
}

const getUserProducts = async (id, user) => {
    try {
        const products = await Product.findOne({ userId: id });
        if (products) {
            user.products = products.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    quantityPerUnit: item.quantityPerUnit,
                    unitPrice: item.unitPrice,
                    unitsInStock: item.unitsInStock,
                    discontinued: item.discontinued
                }
            });

            return user.products;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = userController