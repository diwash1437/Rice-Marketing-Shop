  
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Cutsomer', customerSchema)