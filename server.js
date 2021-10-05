/* eslint-disable no-console */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
