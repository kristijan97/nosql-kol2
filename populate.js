const mongo = require('mongodb').MongoClient;
const faker = require('faker');
const helpers = require('./helpers');

faker.setLocale('en_US');
const streets = [];
for (let i = 0; i < 20; i++) {
  streets.push(faker.address.streetName());
}

const cities = [];
for (let i = 0; i < 5; i++) {
  cities.push(faker.address.city());
}

const residents = [];
for (let i = 0; i < 1000000; i++) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const resident = {
    firstName,
    lastName,
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(firstName, lastName, 'gmail'),
    city: cities[helpers.randomNumber(5)],
    street: streets[helpers.randomNumber(20)],
    number: helpers.randomNumber(50),
    job: faker.name.jobTitle(),
  }
  residents.push(resident)
}

mongo.connect('mongodb://127.0.0.1:27017/klk1', { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err;
  db = db.db('klk1');
  await await db.collection('residents').drop();
  await db.collection('residents').insertMany(residents);
  console.log('Database populated');
  process.exit(0);
});
