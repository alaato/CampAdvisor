const cities = require('all-the-cities');
const mongoose = require('mongoose');
const {Campground, Image }= require('../models/campgrounds')
const {places, descriptors} = require('./SeedHelpers') 
main().catch(err => console.log(err));

async function main() {
    try {
        console.log("connected mongoose");
        await mongoose.connect('mongodb+srv://10alaato:u1D2ipWi8xPEhlpU@cluster0.prcgall.mongodb.net/?retryWrites=true&w=majority');
      } catch (error) {
        handleError(error);
      }
      mongoose.connection.on('error', err => {
        logError(err);
      });
}
const RandomName = array => array[Math.floor(Math.random ()* array.length)]
const SeedDB = async () =>
{
 await Image.deleteMany({})
 await Campground.deleteMany({description:'lorem ipsum'})
    for (let index = 0; index < 15; index++) {
      const img = new Image(
        {
          url : `https://source.unsplash.com/collection/2319173`
        }
      )
      await img.save()
        const ran1000 = Math.floor(Math.random()*1000);
        const newcamp = new Campground({
          author: "647604db7a1ac7a5f0770ec6",
          title: ` ${RandomName(descriptors)} ${RandomName(places)}`,
          location: `${cities[ran1000].name}, ${cities[ran1000].country}`,
          images: [img],
          description: 'lorem ipsum',
          price: `${Math.floor(Math.random()*20)+10}`
        })
        
        await newcamp.save()
        console.log(newcamp)
    }
}

SeedDB().then(()=>{
mongoose.connection.close();
})