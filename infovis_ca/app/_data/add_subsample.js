let csv = require('csvtojson');
let csvFilePath='sample_roaster.csv';
let mongoose = require('mongoose');
let SubSample = require('../db_models/subsample');
mongoose.connect('mongodb://localhost/infovis_ca');

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  for (let i = 0; i < jsonObj.subvis; i++) {
    try {
      SubSample.create(
        { name : jsonObj.name+"-"+(i+1).toString(),
          parentVis: jsonObj.name,
          order: (i+1),
          is_coded: []
        },
        function(err, n) {
          console.log(err);
          console.log(n);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  
  
})
.on('done',(error)=>{
    console.log('end')
})
 