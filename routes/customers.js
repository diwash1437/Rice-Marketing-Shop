const express = require('express')
const router = express.Router()
const Customer= require('../models/customer')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const customer = await Customer.find(searchOptions)
      res.render('customers/index', {
        customer: customer,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })



// New Author Route
router.get('/new', (req, res) => {
  res.render('customers/new',{customer: new Customer()})
})


// Create Author Route
router.post('/', async (req, res) => {
    const customer = new Customer({
      name: req.body.name
    })
  try{
   
const newCustomer=await customer.save()
res.redirect(`customers`)
  }
  catch
  {

    res.render('customers/new',{
        customer: customer ,
        errorMessage:'Error creating customer'  
       })
  }  
})

module.exports = router