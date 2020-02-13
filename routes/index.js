const express=require('express')
const router=express.Router()
const {ensureAuthenticated} = require('../config/auth')


//welcome page
router.get('/',(req,res)=> {
res.render('index')

});

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