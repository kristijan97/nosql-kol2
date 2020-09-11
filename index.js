const mongo = require('mongodb');
const helper = require('./helpers.js');
const url = 'mongodb://127.0.0.1:27017/klk1';

(async () => {
  const client = await mongo.MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db('klk1');

  const cities = await db.collection('residents').distinct('city');
  const streets = await db.collection('residents').distinct('street');
  console.log(`Cities (${cities.length}): ${cities.join(', ')}`);
  console.log(`Streets (5/${streets.length}): ${streets.slice(0, 5).join(', ')}`);

  // insert new record
  const newResident = await db.collection('residents').insertOne({
    firstName: 'Kristijan',
    lastName: 'Koncar',
    phone: '123456789',
    email: 'kaktus@gmail.com',
    city: 'New Maxwell',
    street: 'Jovana Popovica',
    number: 7,
    job: 'Neki tamo developer',
  });

  // delete inserted resident
  await db.collection('residents').deleteOne({_id: new mongo.ObjectID(newResident.insertedId)});

  // all developers
  const developers = await db.collection('residents').find({ job: { '$regex': '.*Developer.*' }}).toArray();
  console.log(`We have ${developers.length} developers`);

  // give all security workers the security clearance
  await db.collection('residents').updateMany(
    { job: { '$regex': '.*Security.*' } },
    { $set: { 'security_clearance': true } },
  );

  ///////////////////////////////////
  // Performance index check
  ///////////////////////////////////

  try {
    await db.collection('residents').dropIndex('job_1').catch();
    await helper.sleep(1000);
  } catch {}

  const testSearch = async function(testCase) {
    console.time(testCase);
    await db.collection('residents').find({ job: { '$regex': '.*Manager.*' }});
    console.timeEnd(testCase);
  }

  const indexes = await db.collection('residents').listIndexes().toArray();
  console.log(indexes);

  await testSearch('Normal (without index) search');

  await db.collection('residents').createIndex('job');
  await testSearch('Search using index');

  client.close();
})();
