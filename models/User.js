const { extendSchemaImpl } = require('graphql/utilities/extendSchema')
const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Provide a valid email address',
        ],
    },
    displayName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
})

model.exports = model("User", userSchema);