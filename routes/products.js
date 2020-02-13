const express=require('express')
const router=express.Router()

//get products
const Product=require('../models/product')



//All Customer Router
router.get('/',(req,res)=> {
res.render('products/index')

})

//new customer routes
router.get('/new', async(req,res)=> {
 
res.render('products/new',{product: new Product})
   
})


//creating 
router.post('/', (req,res)=> {
res.send('create')
})



////customer profile




module.exports=router