  
const mongoose = require('mongoose')
const Product=require('./product')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

customerSchema.pre('remove', function(next) {
  Product.find({ customer: this.id }, (err, products) => {
    if (err) {
      next(err)
    } else if (products.length > 0) {
      next(new Error('This customer has product still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Customer', customerSchema)