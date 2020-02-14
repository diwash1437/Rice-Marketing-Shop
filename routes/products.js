const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Product = require('../models/product')
const Customer = require('../models/customer')
const uploadPath = path.join('public', Product.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Product Route
router.get('/', async (req, res) => {
   
  try {
    const product = await Product.find({})
    res.render('products/index', {
      product: product,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})




// New Product Route
router.get('/new', async(req, res) => {

    renderNewPage(res, new Product())
})


// Create Product Route
router.post('/', upload.single('cover'), async (req, res) =>
 {

const fileName = req.file != null ? req.file.filename : null
const product=new Product({
productname: req.body.productname,
customer: req.body.customer,
quantity: req.body.quantity,
publishDate: new Date(req.body.publishDate),
coverImageName: fileName,



    })

    try {
        const newProduct = await product.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`products`)
      } catch {
          if(product.coverImageName !=null)
          {
            removeProductCover(product.coverImageName)
          }
      
        renderNewPage(res, product, true)
      }
    


})

function removeProductCover(fileName)
{
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
      } catch {
        res.redirect('/products')
      }
    }


module.exports = router