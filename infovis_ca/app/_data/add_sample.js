const csv = require('ya-csv');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

// Connect
const connection = (closure) => {
  return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    assert.equal(null, err);
        
    let db = client.db('infovis_ca');
    closure(db);
  });
};

console.log('connection 1')

let reader = csv.createCsvFileReader('sample_roaster.csv', { columnsFromHeader: true });

console.log('data start')
reader.addListener('data', function(data) {
  connection((db) => {
    db.collection('samples')
      .insertOne(data);
  });
});