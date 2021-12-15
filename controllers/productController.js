const { Product } = require('../models/productModel');
const { User } = require('../models/userModel');
const _ = require('lodash');
const mongoose = require('mongoose');

const productController = {
    getProducts: async (req, res) => {
        try {
            const query = {};
            let fields = req.query.fields;

            !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

            !_.isUndefined(req.query.name) ? query.name = req.query.name : '';

            Product.find(query, fields, (err, docs) => {
                const products = docs.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        unitPrice: product.unitPrice,
                        unitsInStock: product.unitsInStock,
                        quantityPerUnit: product.quantityPerUnit,
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
            Product.find({ _id: req.params.id }, (err, docs) => {
                const product = docs.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        unitPrice: product.unitPrice,
                        unitsInStock: product.unitsInStock,
                        quantityPerUnit: product.quantityPerUnit,
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
                _id: new mongoose.Types.ObjectId(), name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId
            })

            await newProduct.save(async (err, doc) => {
                const user = await User.findOne({_id: doc.userId});
                user.products.push(doc._id);
                console.log(user);
                user.save();
                if (err) return res.status(500).json({ message: err })
                res.status(201).json({ success: true, message: 'Product registered successfully', data: doc })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id })
            if (!product) return res.status(404).json({ message: "Product not found" })

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
            product.userId = userId;
            product.categoryId = categoryId;
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


