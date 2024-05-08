'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { return next( new Error('Invalid Authentication')); }

    const token = req.headers.authorization.split(' ')[1];
    console.log('Token: ', token);
    const validUser = await users.authenticateToken(token);

    req.user = validUser;
    req.token = token;

    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }
};