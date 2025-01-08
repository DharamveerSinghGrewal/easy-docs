const {Schema, model } = require('mongoose')

const Document = new Schema({
    _id: String,
    name: { type: String, default: "Untitled" },
    data: Object
})

module.exports = model("Document", Document)