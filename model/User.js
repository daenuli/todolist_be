const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            },
            device: {
                type: String
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAuthToken = async function (device) {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' });
    this.tokens = this.tokens.concat({ token, device });
    await this.save();
    return token;
}

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.__v;
    return user;
}

module.exports = mongoose.model('User', UserSchema);