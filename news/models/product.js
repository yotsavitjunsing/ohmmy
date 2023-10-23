const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  RFID:String,
  category: String,
  waterlevel: Number,
  tags: [String]
},{ timestamps: true, versionKey: false });

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
