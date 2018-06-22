let mongoose = require('mongoose');
//Define a schema
let Schema = mongoose.Schema;

let SampleSchema = new Schema({
    name: String,
    subvis: Number,
    year: String,
    journal: String,
    title: String,
    url: String,
    order: Number,
    is_coded: [ { coder: String, date: Date } ]
});

let Sample = mongoose.model('Sample', SampleSchema);

module.exports = Sample;