const { productModel } = require('../models/productModel');
const _ = require('lodash');
const mongoose = require('mongoose');

const productController = {
    getProducts: async (req, res) => {
        try {
            const query = {};
            let fields = req.query.fields;

            !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

            !_.isUndefined(req.query.name) ? query.name = req.query.name : '';

            productModel.find(query, fields, (err, docs) => {
                if (!err) return res.status(200).json(docs);

                res.status(500).json({ msg: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getProduct: async (req, res) => {
        try {
            productModel.find({ _id: req.params.id }, (err, docs) => {
                if (!err) return res.status(200).json(docs);
                res.status(500).json({ msg: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const { name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId } = req.body;

            const newProduct = new productModel({
                name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId
            })

            await newProduct.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, msg: 'Product registered successfully', data: doc })
                res.status(500).json({ msg: err })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await productModel.findOne({ _id: req.params.id })
            if (!product) return res.status(404).json({ msg: "Product not found" })

            product.remove((err, doc) => {
                if (err) return res.status(500).json({ msg: err.message })
                res.status(200).json({ msg: 'Product deleted successfully', data: doc })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            console.log("buradayım");
            const { name, quantityPerUnit, unitPrice, unitsInStock, userId, categoryId } = req.body;
            const product = await productModel.findOne({ _id: req.params.id })
            if (!product) return res.status(404).json({ msg: "Product not found" })
            
            product.name = name;
            product.quantityPerUnit = quantityPerUnit;
            product.unitPrice = unitPrice;
            product.unitsInStock = unitsInStock;
            product.userId = userId;
            product.categoryId = categoryId;

            await product.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, msg: 'Product updated successfully', data: doc })
                res.status(500).json({ msg: err })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = productController;


