let mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://localhost/infovis_ca');

module.exports = {mongoose: mongoose, connection: connection};