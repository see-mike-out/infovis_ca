let mongoose = require('mongoose');
//Define a schema
let Schema = mongoose.Schema;

let SubSampleSchema = new Schema({
    name: String,
    parentVis: String,
    order: Number,
    is_coded: [ { coder: String, date: Date } ]
});

let SubSample = mongoose.model('SubSample', SubSampleSchema);

module.exports = SubSample;