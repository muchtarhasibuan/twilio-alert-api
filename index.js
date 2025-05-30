
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Twilio } = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/alert', async (req, res) => {
  const { suhu, asap } = req.body;

  if (!suhu || !asap) {
    return res.status(400).send('Missing parameters');
  }

  const message = `🚨 PERINGATAN !!! Suhu = ${suhu}°C, Asap = ${asap}`;

  try {
    await client.messages.create({
      from: process.env.TWILIO_NUMBER,
      to: process.env.TARGET_NUMBER,
      body: message
    });

    res.send('Alert sent!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send alert');
  }
});

app.get('/', (req, res) => {
  res.send('Twilio Alert API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
