const express=require('express')
const router=express.Router()
const {ensureAuthenticated} = require('../config/auth')
const Product=require('../models/product')

//welcome page
router.get('/', async (req, res) => {
   let products
   try {
     products = await Product.find().sort({ createdAt: 'desc' }).limit(10).exec()
   } catch {
    products = []
   }
   res.render('index', { products: products })
 })
//dashboard
///for authenticated for protected login gare pochi matra chirne only put ensureAuthenticated,(req,res)
router.get('/dashboard', ensureAuthenticated, (req, res) =>

 res.render('dashboard',{
    name: req.user.name
 })
 
);

//admindashboard
router.get('/admindashboard',(req,res)=> {
   res.render('admindashboard')
   
   });

module.exports=router