const express = require('express')
const router = express.Router()
const Customer= require('../models/customer')
const Product = require('../models/product')
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
    } catch (err){
      console.log(err)
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
res.redirect(`/customers/${customer.id}`)

  }
  catch
  {

    res.render('customers/new',{
        customer: customer ,
        errorMessage:'Error creating customer'  
       })
  }  
})


router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    const product = await Product.find({ customer: customer.id }).limit(6).exec()
    res.render('customers/show', {
      customer: customer,
      productsByCustomer: product
    })
  } catch {
    res.redirect('/')
  }
})


router.get('/:id/edit',async (req, res) => {
  try
  {
    const customer=await Customer.findById(req.params.id)
    res.render('customers/edit',{customer: new Customer()})
 
  }
  catch
  {
res.redirect('/customers')
  }

})



router.put('/:id', async (req, res) => {
  let customer
  try {
    customer = await Customer.findById(req.params.id)
    customer.name = req.body.name
    await customer.save()
    res.redirect(`/customers/${customer.id}`)
  } catch (err)

  {
    console.log(err)
    if (customer == null) {
      res.redirect('/')
    } else {
      res.render('customers/edit', {
        customer: customer,
        errorMessage: 'Error updating customer'
      })
    }
  }
})

 
router.delete('/:id', async (req, res) => {
  let customer
  try {
    customer = await Customer.findById(req.params.id)
    await customer.remove()
    res.redirect('/customers')
  } catch {
    if (customer == null) {
      res.redirect('/')
    } else {
      res.redirect(`/customers/${customer.id}`)
    }
  }
})
module.exports = router