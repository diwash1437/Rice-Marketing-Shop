const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({

productname:{
    type: String,
    required: true
},
price:{
    type: Number,
    required: true
},
Quantity:{
    type: Number,
    required: true
},

publishDate:{
    type: Date,
    required: true
},

createdAt:{
    type: Date,
    required: true,
    default: Date.now
},
coverImageName:
{
    type: String,
    required: true
}

})
module.exports=mongoose.model('Product', productSchema)
