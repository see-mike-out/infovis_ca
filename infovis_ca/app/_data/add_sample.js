let csv = require('csvtojson');
let csvFilePath='sample_roaster.csv';
let mongoose = require('mongoose');
let Sample = require('../db_models/sample');
mongoose.connect('mongodb://localhost/infovis_ca');

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  //console.log(jsonObj)
  jsonObj['order'] = parseInt(jsonObj.name.split('-')[0])
  try {
    Sample.updateOne(
      { name : jsonObj.name },
      { $set: { order : jsonObj.order } },
      { upsert: false },
      function(err, n) {
        console.log(err);
        console.log(n);
      }
    );
  } catch (e) {
    console.log(e);
  }
})
.on('done',(error)=>{
    console.log('end')
})
 