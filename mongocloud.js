const stitch = require("mongodb-stitch")
const clientPromise = stitch.StitchClientFactory.create('iolearn-bkyrt');
clientPromise.then(client => {
  const db = client.service('mongodb', 'mongodb-atlas').db('iolearnjoe');
  client.login().then(() =>
    db.collection('test').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
  ).then(() =>
    db.collection('test').find({owner_id: client.authedId()}).limit(100).execute()
  ).then(docs => {
    console.log("Found docs", docs)
    console.log("[MongoDB Stitch] Connected to Stitch")
  }).catch(err => {
    console.error(err)
  });
});

