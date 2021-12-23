const axios = require('axios')

const northwindController = {
    getAllProducts: async (req, res) => {
        const { data } = await axios.get('https://northwind.vercel.app/api/products');
        res.render('northwindProduct', { data: data })
    },
    getAddProduct: (req, res) => {
        res.render('add-product');
    },
    addProduct: async (req, res) => {
        const { id, name, unitPrice } = req.body;
        await axios.post('https://northwind.vercel.app/api/products', {
            id,
            name,
            unitPrice
        })
        res.redirect('/api/northwind/products');
    },
    deleteProduct: async (req, res) => {
        await axios.delete(`https://northwind.vercel.app/api/products/${req.params.id}`);
        res.redirect('/api/northwind/products')
    },
    getUpdateProduct: async (req, res) => {
        const { data } = await axios.get(`https://northwind.vercel.app/api/products/${req.params.id}`)
        res.render('update-product', { data: data })
    },
    updateProduct: async (req, res) => {
        const { name, unitPrice } = req.body;
        await axios.put(`https://northwind.vercel.app/api/products/${req.params.id}`, {
            name: name,
            unitPrice: unitPrice
        })
        res.redirect('/api/northwind/products')
    }

}

module.exports = northwindController