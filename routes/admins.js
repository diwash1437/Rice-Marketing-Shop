const express=require('express')
const router=express.Router()
const bcrypt = require('bcrypt')
const passport= require('passport');


//user model
const User=require('../models/Admin')



//Login Page
router.get('/login',(req,res)=> {
    //(views/customers(foldername) index.ejs is file name)
res.render('login')

})

//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/admins/login',
        failureFlash: true
      })(req, res, next);
    });
    

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admins/login');
  });






//Register Page
router.get('/register', (req,res)=> {
    //(views/customers(foldername) new.ejs is file name)
   res.render('register')
})


//Register Hanle
router.post('/register',(req,res)=>{
const {name, email, password, password2} = req.body;
let errors=[];

//check required fields
if(!name || !email || !password || !password2)
{
    errors.push({msg: 'Please fill in all fields'});
}

//check passwords match
if(password != password2)
{
    errors.push({msg: 'Passwords do not match'})
}

//check pass length
if(password.length <6)
{
    errors.push({msg:'Password should be at least 6 characters'})
}

if(errors.length > 0)
{
   res.render('register', {
       errors,
       name,
       email,
       password,
       password2

   });
}
else
{

  //validation passed
User.findOne({email:email})
.then(user => {
    if(user)
    {
        errors.push({msg: 'Email is already registered'});
        //user exists
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        const newUser= new User({
            name,
            email,
            password
        });

       // console.log(newUser)
       // res.send('hello');

       ////Hash password
       bcrypt.genSalt(10, (err,salt)=> 
       bcrypt.hash(newUser.password, salt, (err, hash) =>{
if(err) throw err;
//set password to hashed

newUser.password=hash;

//save user
newUser.save()
.then(user =>{
    req.flash('success_msg','you are now registered');
    res.redirect('/admins/login');
})
.catch(err => console.log(err));

}))
}
});


}

});



module.exports=router