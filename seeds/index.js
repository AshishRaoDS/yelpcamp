const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const cities = require("./cities");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database connected");
});

const seeds = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 25) + 10;
    const camp = new Campground({
      author: "60bcb72428b96c2b1ca78eb1",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${seeds(descriptors)} ${seeds(places)}`,
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim reiciendis fugiat asperiores repellendus odio cumque officia corporis necessitatibus porro impedit. Adipisci unde maxime doloremque qui praesentium at cupiditate, voluptate sapiente?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dzuimj4fn/image/upload/v1623130477/Yelpcamp/wozo49ykdooijocwplsg.jpg",
          filename: "Yelpcamp/wozo49ykdooijocwplsg",
        },
        {
          url: "https://res.cloudinary.com/dzuimj4fn/image/upload/v1623130478/Yelpcamp/yxmfzlsbejyelccd9v26.jpg",
          filename: "Yelpcamp/yxmfzlsbejyelccd9v26",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
