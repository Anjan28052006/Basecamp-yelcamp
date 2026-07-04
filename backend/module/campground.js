const mongoose=require('mongoose');
const Review = require('./reveiws');
const User=require('./user');
const Schema=mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const campgroundSchema=new Schema({
    titel:String,
    location:String,
     geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    
    price:Number,
    image:[{
        url:String,
        filename:String,
    }],
    description:String,
    population:String,
    rank:String,
    state:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:Review
        }
    ]
},opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campground/${this._id}">${this.titel}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
//when we delete the campground the reviews assosciated with it  is not deleted
// in order to delete the reviews that is asscociated with the campground
// the below middleware is must be defined

campgroundSchema.post('findOneAndDelete',async function(doc){
  console.log(doc);
      if(doc){
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
  }
})

module.exports=mongoose.model('Campground',campgroundSchema);