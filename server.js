require('dotenv').config()
const express=require('express')
const app= express()
const expresslayouts=require('express-ejs-layouts')
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport = require('passport');
const methodOverRide=require('method-override')

//Passport config
require('./config/passport')(passport);



mongoose.connect(process.env.DATABASE_URL,
    {useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    const db=mongoose.connection
    db.on('error',(error) => console.error(error))
    db.once('open',() => console.log('Connected to database'))
    


//EJS
app.set('view engine', 'ejs')
app.set('views', __dirname +'/views')
app.set('layout','layouts/layout')



app.use(expresslayouts)
app.use(express.static('public'))
//body parser
app.use(bodyParser.urlencoded({limit: '10mb',extended: false}))
app.use(methodOverRide('_method'))


//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
   
  }));

///Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  //connect flash
  app.use(flash());

  //Global vars
  app.use((req, res, next)=> {
     res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('success_msg');
      res.locals.error = req.flash('error');
//server keep on round it wont load if u dont put next
next();

    });
  

//routes
const indexRouter=require('./routes/index')
const userRouter=require('./routes/users')
const customerRouter=require('./routes/customers')
const productRouter=require('./routes/products')





//Routes
app.use('/', indexRouter)


//dashboard ma dekhako
app.use('/users', userRouter)
app.use('/customers', customerRouter)

app.use('/products', productRouter)




///
///   
app.listen(process.env.PORT || 2800)



/////authtentication for 1:20 after u need to logged in
//layout.ejs 
//<!--    -->
/////7mins