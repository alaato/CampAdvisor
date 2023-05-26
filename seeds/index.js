const cities = require('all-the-cities');
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds')
const {places, descriptors} = require('./SeedHelpers') 
main().catch(err => console.log(err));

async function main() {
    try {
        console.log("connected mongoose");
        await mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');
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
    await Campground.deleteMany({});
    console.log('delted')
    for (let index = 0; index < 50; index++) {
        const ran1000 = Math.floor(Math.random()*1000);
        const newcamp = new Campground({
          author: "642991fc5c1e3d6ebc75d459",
          title: ` ${RandomName(descriptors)} ${RandomName(places)}`,
          location: `${cities[ran1000].name}, ${cities[ran1000].country}`,
          image: `https://source.unsplash.com/collection/2319173`,
          description: 'lorem ipsum',
          price: `${Math.floor(Math.random()*20)+10}`
        })
        await newcamp.save()
    }
}

SeedDB().then(()=>{
mongoose.connection.close();
})