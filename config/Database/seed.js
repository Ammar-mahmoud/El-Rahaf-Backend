const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './config.env' });

const Building = require('../../models/buildingModel');
const User = require('../../models/userModel');
const SmallUnit = require('../../models/smallUnitModel');
const Regiment = require('../../models/regimentModel');
const Trip = require('../../models/tripModel');
const Review = require('../../models/reviewModel');

const buildings = require('./data/buildingsData');
const users = require('./data/usersData');
const smallUnits = require('./data/smallUnitsData');
const regiments = require('./data/regimentsData');
const trips = require('./data/tripsData');
const reviews = require('./data/reviewsData');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Database connected successfully'));

const seedDatabase = async () => {
  try {
    await Building.deleteMany();
    await User.deleteMany();
    await SmallUnit.deleteMany();
    await Regiment.deleteMany();
    await Trip.deleteMany();
    await Review.deleteMany();

    // تشفير كلمات المرور باستخدام Promise.all
    await Promise.all(
      users.map(async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      })
    );

    const createdBuildings = await Building.insertMany(buildings);
    const createdUsers = await User.insertMany(users);

    smallUnits.forEach((unit) => {
      if (unit.type === 'room') {
        const hotel = createdBuildings.find(b => b.type === 'hotel');
        unit.building = hotel._id;
      } else if (unit.type === 'apartment') {
        const tower = createdBuildings.find(b => b.type === 'tower');
        unit.building = tower._id;
      }
    });

    const createdSmallUnits = await SmallUnit.insertMany(smallUnits);

    regiments.forEach((regiment) => {
      regiment.building = createdBuildings[0]._id;
    });
    const createdRegiments = await Regiment.insertMany(regiments);

    trips.forEach((trip) => {
      trip.regiment = createdRegiments[0]._id;
      trip.smallUnitID = createdSmallUnits[0]._id;
    });
    await Trip.insertMany(trips);

    reviews.forEach((review, index) => {
      review.user = createdUsers[index % createdUsers.length]._id;
      review.building = createdBuildings[index % createdBuildings.length]._id;
    });
    await Review.insertMany(reviews);

    console.log("Database seeded successfully with hashed passwords!");
  } catch (error) {
    console.error("Error while seeding the database: ", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
