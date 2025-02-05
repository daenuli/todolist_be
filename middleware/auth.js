const jwt = require('jsonwebtoken')
const User = require('../model/User')
const { model } = require('mongoose')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error()
        }

        // check if token is expired
        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
            return res.status(401).json({ message: 'Token expired' })
        }

        // check if token is valid
        if (!user.tokens.find(item => item.token === token)) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Unauthorized' })
    }
}

module.exports = auth