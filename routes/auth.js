const express = require('express')
const router = express.Router()
const User = require('../model/User')
const auth = require('../middleware/auth')

router.post('/signup', async (req, res) => {
    const { name, email, password, device } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // validate email format
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(email).toLowerCase())) {
            return res.status(400).json({ message: 'Invalid email' })
        }

        // create a new user
        user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken(device)

        res.status(200).json({ user, token })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/signin', async (req, res) => {
    const { email, password, device } = req.body

    try {
        const user = await User.findOne({ email })

        // validate email format
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(email).toLowerCase())) {
            return res.status(400).json({ message: 'Invalid email' })
        }
        // check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' })
        }
        // validate password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const token = await user.generateAuthToken(device)
        res.status(200).json({ user, token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router