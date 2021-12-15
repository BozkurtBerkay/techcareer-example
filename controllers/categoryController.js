const { Category } = require('../models/CategoryModel');
const _ = require('lodash');
const mongoose = require('mongoose');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const query = {};
            let fields = req.query.fields;

            !_.isUndefined(fields) ? fields = fields.split(",").join(" ") : '';

            !_.isUndefined(req.query.name) ? query.name = req.query.name : '';

            Category.find(query, fields, (err, docs) => {
                if (!err) return res.status(200).json(docs);

                res.status(500).json({ message: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getCategory: async (req, res) => {
        try {
            Category.find({ _id: req.params.id }, (err, docs) => {
                if (!err) return res.status(200).json(docs);
                res.status(500).json({ message: err.message });
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;

            const newCategory = new Category({
                _id: new mongoose.Types.ObjectId(), name })

            await newCategory.save(async (err, doc) => {
                if (err) return res.status(500).json({ message: err })
                res.status(201).json({ success: true, message: 'Category registered successfully', data: doc })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id })
            if (!category) return res.status(404).json({ message: "Category not found" })

            category.remove((err, doc) => {
                if (err) return res.status(500).json({ message: err.message })
                res.status(200).json({ success: true, message: 'Category deleted successfully', data: doc })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await Category.findOne({ _id: req.params.id })
            if (!category) return res.status(404).json({ message: "Category not found" })

            category.name = name;

            category.save((err, doc) => {
                if (!err) return res.status(201).json({ success: true, message: 'Category updated successfully' })
                res.status(500).json({ message: err })
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = categoryController;


