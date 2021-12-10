const _ = require('lodash');
const suppliers = require('../models/supplierModel');

const suppliersController = {
    getSuppliers : async (req, res) => {
        try {
            // const {data} = await axios.get(`https://northwind.vercel.app/api/suppliers`);
            const data = [...suppliers];
            if (_.isEmpty(req.query)) return res.status(200).json(data);
    
            let filteredData = [];
            req.query.orderBy === 'asc' ? filteredData = _.orderBy(data, (item) => item.companyName, ['asc']) : ''
            req.query.orderBy === 'desc' ? filteredData = _.orderBy(data, (item) => item.companyName, ['desc']) : ''
            _.isEmpty(filteredData) ? filteredData = data : filteredData
            req.query.country ? filteredData = _.filter(filteredData, (item) => item.address.country?.toLowerCase() === req.query.country.toLowerCase()) : ''
            req.query.city ? filteredData = _.filter(filteredData, (item) => item.address.city?.toLowerCase() === req.query.city.toLowerCase()) : ''
    
            !_.isEmpty(filteredData) ? res.status(200).json(filteredData) : res.status(404).json({ message: 'Suppliers not found' });
    
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    createSupplier : async (req, res) => {
        const { companyName, contactName, contactTitle, street, city, region, postalCode, country, phone } = req.body;
        const supplier = {
            id: suppliers.length + 1,
            companyName: companyName,
            contactName: contactName,
            contactTitle: contactTitle,
            address: {
                street: street,
                city: city,
                region: region,
                postalCode: postalCode,
                country: country,
                phone: phone
            }
        }
        suppliers.push(supplier);
        res.status(200).json({ success: true, data: supplier })
    },
    getSupplier : async (req, res) => {
        try {
            const id = req.params.id;
            //const {data} = await axios.get(`https://northwind.vercel.app/api/suppliers/${id}`);
            const data = _.find(suppliers, item => item.id === id * 1);
            data ? res.status(200).send(data) : res.status(404).send({ message: 'Suppliers not found' });
    
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteSupplier : async (req, res) => {
        try {
            const id = req.params.id;
            //const {data} = await axios.get(`https://northwind.vercel.app/api/suppliers/${id}`);
            const data = _.find(suppliers, item => item.id === id * 1);
            if (!_.isEmpty(data)) {
                suppliers.pop(data);
                res.status(200).json({ message: 'Suppliers deleted' })
            } else res.status(404).send({ message: 'Suppliers not found' });
    
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateSupplier : async (req, res) => {
        const id = req.params.id;
        console.log(id);
        let data = _.find(suppliers, (supplier) => supplier.id === id * 1);
        console.log(data);
        if (!_.isEmpty(data)) {
            const { companyName, contactName, contactTitle, street, city, region, postalCode, country, phone } = req.body;
            data.companyName = companyName;
            data.contactName = contactName;
            data.contactTitle = contactTitle;
            data.street = street;
            data.city = city;
            data.region = region;
            data.postalCode = postalCode;
            data.country = country;
            data.phone = phone;
            res.status(200).json({ success: true, message: 'Suppliers update', data })
        }
        else res.status(404).json({ message: 'Suppliers not found' });
    }
}

module.exports = suppliersController