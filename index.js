'use strict';

require('dotenv').config();

const {startup}  = require('./src/server.js');
const { db } = require('./src/auth/models/index.js');


db.sync()
  .then(() => {
    startup(process.env.PORT);
  });