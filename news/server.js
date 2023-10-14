const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt");

client.on("connect", () => {
  console.log(`Connected successfuly`);
  client.subscribe("testtopic/#", (err) => {
    if (!err) {
      client.publish("testtopic/web", "Hello Krismt");
    }
  });
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  console.log(`Your topic: ${topic}, msg: ${msg}`);
});

mongoose.connect("mongodb://mongo:27017/node-api-101", {
    authSource: "admin",
    user: "root",
    pass: "example",
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());

app.get('/datas', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/datas/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.json(product);
});

app.post('/datas', async (req, res) => {
  const payload = req.body;
  const product = new Product(payload);
  await product.save();
  res.status(201).json(product);
});

app.put('/datas/:id', async (req, res) => {
  const payload = req.body;
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, { $set: payload });
  res.json(product);
});

app.delete('/datas/:id', async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndDelete(id);
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('Application is running on port 3000');
});
/*
const cleanup = () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
*/