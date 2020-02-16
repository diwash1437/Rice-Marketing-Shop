const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Product = require('../models/product')
const Customer=require('../models/customer')
const uploadPath = path.join('public', Product.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Products Route
router.get('/', async (req, res) => {
    let query = Product.find()
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
      const products = await query.exec()
      res.render('products/index', {
        products: products,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })

// New Products Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Product())

})

// Create Products Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const product = new Product({
      title: req.body.title,
      customer: req.body.customer,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
    })
  
    try {
      const newProduct = await product.save()
      res.redirect(`products/${newProduct.id}`)
 
    } catch(err) {
        console.log(err)
      if (product.coverImageName != null) {
        removeBookCover(product.coverImageName)
      }
      renderNewPage(res, product, true)
    }
  })



// Show Products Route
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                           .populate('customer')
                           .exec()
    res.render('products/show', { product: product })
  } catch {
    res.redirect('/')
  }
})


// Edit Products Route
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    renderEditPage(res, product)
  } catch {
    res.redirect('/')
  }
})



// Update Products Route
router.put('/:id', async (req, res) => {
  let product

  try {
    product = await Product.findById(req.params.id)
    product.title = req.body.title
    product.customer = req.body.customer
    product.publishDate = new Date(req.body.publishDate)
    product.pageCount = req.body.pageCount
    product.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(product, req.body.cover)
    }
    await product.save()
    res.redirect(`/products/${product.id}`)
  } catch {
    if (product != null) {
      renderEditPage(res, product, true)
    } else {
      redirect('/')
    }
  }
})


// Delete Prdocuts Page
router.delete('/:id', async (req, res) => {
  let product
  try {
    product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect('/products')
  } catch {
    if (product != null) {
      res.render('products/show', {
        product: product,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})




async function renderNewPage(res, product, hasError = false) {
  renderFormPage(res, product, 'new', hasError)
}

async function renderEditPage(res, product, hasError = false) {
  renderFormPage(res, product, 'edit', hasError)
}

async function renderFormPage(res, product, form, hasError = false) {
  try {
    const customer = await Customer.find({})
    const params = {
      customer: customer,
      product: product
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Book'
      } else {
        params.errorMessage = 'Error Creating Book'
      }
    }
    res.render(`products/${form}`, params)
  } catch {
    res.redirect('/products')
  }
}

  
  function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    })
  }


 
  


  async function renderNewPage(res, product, hasError = false) {
    try {
      const customer = await Customer.find({})
      const params = {
        customer: customer,
        product: product
      }
      if (hasError) params.errorMessage = 'Error Creating Book'
      res.render('products/new', params)
    } catch (err){
        console.log(err)
      res.redirect('/products')
    }
  }
  

module.exports = router