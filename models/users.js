const mongoose = require('mongoose')
const schema = mongoose.Schema
const mongoosePassport = require('passport-local-mongoose')

const userSchema = new schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(mongoosePassport)
module.exports = mongoose.model('User', userSchema)