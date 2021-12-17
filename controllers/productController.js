const _ = require('lodash');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Product } = require('../models/productModel');
const { User } = require('../models/userModel');

const productController = {
    getProducts: async (req, res) => {
        try {
            const query = {};
            let fields = req.query.fields;

            !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

            Product.find(query, fields).populate('category').exec((err, docs) => {
                const products = docs.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        unitPrice: product.unitPrice,
                        unitsInStock: product.unitsInStock,
                        quantityPerUnit: product.quantityPerUnit,
                        category: product.category?.name
                    }
                })
                if (!err) return res.status(200).json(products);

                res.status(500).json({ message: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getProduct: async (req, res) => {
        try {
            Product.find({ _id: req.params.id }).populate('category').exec((err, docs) => {
                const product = docs.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        unitPrice: product.unitPrice,
                        unitsInStock: product.unitsInStock,
                        quantityPerUnit: product.quantityPerUnit,
                        category: product.category?.name
                    }
                })
                if (!err) return res.status(200).json(product);
                res.status(500).json({ message: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const { name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId } = req.body;

            const newProduct = new Product({
                _id: new mongoose.Types.ObjectId(), name, quantityPerUnit, unitPrice, unitsInStock, user: userId, category: categoryId
            })

            User.findOne({ _id: userId }, (err, user) => {
                if (err) return res.status(500).json({ message: err.message });
                user.products.push(newProduct._id);
                user.save((err, docs) => {
                    if (err) return res.status(500).json({ message: err.message })
                });
            });

            newProduct.save(async (err, product) => {
                if (err) return res.status(500).json({ message: err })

                res.status(201).json({ success: true, message: 'Product registered successfully', data: product })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id })
            if (!product) return res.status(404).json({ message: "Product not found" })

            User.findOne({ _id: product.user }, async (err, user) => {
                if (err) return res.status(500).send({ message: err })
                const deleteProduct = user.products?.find(item => item.toString() === product._id.toString())
                user.products?.pop(deleteProduct);
                user.save((err, doc) => {
                    if (err) return res.status(500).json({ message: err })
                })
            })

            product.remove((err, doc) => {
                if (err) return res.status(500).json({ message: err.message })
                res.status(200).json({ success: true, message: 'Product deleted successfully', data: doc })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId } = req.body;
            const product = await Product.findOne({ _id: req.params.id })
            if (!product) return res.status(404).json({ message: "Product not found" })

            product.name = name;
            product.quantityPerUnit = quantityPerUnit;
            product.unitPrice = unitPrice;
            product.unitsInStock = unitsInStock;
            product.user = userId;
            product.category = categoryId;
            product.updateDate = Date.now();

            product.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'Product updated successfully' })
                res.status(500).json({ message: err })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = productController;


