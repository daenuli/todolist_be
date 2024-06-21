const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

TaskSchema.methods.toJSON = function () {
    const task = this.toObject();
    delete task.__v;
    delete task.user_id;
    return task;
};

module.exports = mongoose.model("Task", TaskSchema);