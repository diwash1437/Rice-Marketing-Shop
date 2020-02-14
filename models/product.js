const mongoose=require('mongoose')
const path=require('path')
const coverImageBasePath='uploads/productCovers'

const productSchema=new mongoose.Schema({

productname:{
    type: String,
    required: true
},

quantity:{
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
},
place:{
    type: String,
    required: true
},
customer:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Cutsomer'

}

})

productSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null)
    {
return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports=mongoose.model('Product', productSchema)
module.exports.coverImageBasePath=coverImageBasePath