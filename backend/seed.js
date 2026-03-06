require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const FeatureClick = require('./models/FeatureClick');

const FEATURES = ['date_picker', 'filter_age', 'chart_bar', 'filter_gender'];
const GENDERS = ['male', 'female', 'other']; 

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create 10 dummy users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const age = Math.floor(Math.random() * 50) + 10; // 10-60
    const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      username: `user${i}`,
      password: hashedPassword,
      age,
      gender
    });
    await user.save();
    users.push(user);
  }

  // Create 120 random feature clicks 
  const startDate = new Date('2024-01-01').getTime();
  const endDate = new Date('2024-05-08').getTime();
  const dateRange = endDate - startDate;

  for (let i = 0; i < 120; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
    const timestamp = new Date(startDate + Math.random() * dateRange);
    const click = new FeatureClick({
      userId: user._id,
      featureName: feature,
      timestamp
    });
    await click.save();
  }

  console.log('Database seeded!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});