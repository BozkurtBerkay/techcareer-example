const axios = require('axios')
const _ = require('lodash')
const orderController = {
    getOrders: async (req, res) => {
        const { data } = await axios.get(`https://northwind.vercel.app/api/orders`);
        
        if (!_.isEmpty(data) && _.isEmpty(req.query)) return res.status(200).json(data);
    
        let filteredData = [];
        req.query.year ? filteredData = _.filter(data, (item) => item.orderDate?.split('-')[0] === req.query.year) : '';
        if (req.query.months) {
            if (req.query.months < 10) {
                filteredData = _.filter(filteredData, (item) => item.orderDate?.split('-')[1] === `0${req.query.months}`);
            } else {
                filteredData = _.filter(filteredData, (item) => item.orderDate?.split('-')[1] === req.query.months)
            }
        }
    
        !_.isEmpty(filteredData) ? res.status(200).json(filteredData) : res.status(404).json({ message: 'Orders not found' })
    },
    getOrder: async (req, res) => {
        const id = req.params.id
        const { data } = await axios.get(`https://northwind.vercel.app/api/orders/${id}`);
        !_.isEmpty(data) ? res.status(200).json(data) : res.status(404).json({ message: 'Customer is not found' })
    }
}

module.exports = orderController