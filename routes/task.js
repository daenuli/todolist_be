const express = require('express')
const router = express.Router()
const Task = require('../model/Task')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.user._id })
        res.send(tasks)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, user_id: req.user._id })
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user_id: req.user._id })
        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { $set: { status: req.body.status } }, { new: true })
        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user._id })
        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router