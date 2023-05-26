const mongoose = require('mongoose');
const { Schema } = mongoose
imageSchema = new Schema({
    
        url: String,
        filename: String,
    
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/c_thumb,g_center,w_200')
})
const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    images: [imageSchema],
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema)
