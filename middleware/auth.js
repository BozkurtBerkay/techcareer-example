const jwt = require('jsonwebtoken')

const Auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Authorization Invalid"})

        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) =>{
            if(err) return res.status(400).json({msg: "Authorization Invalid"})

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = Auth