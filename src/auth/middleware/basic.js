'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { 
    return next( new Error('Invalid Login')); }

  const basic = req.headers.authorization.split(' ')[1];
  const [username, password] = base64.decode(basic).split(':');

 

  try {
    console.log('Authenticating user with username: ', username);
    req.user = await users.authenticateBasic(username, password);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }

};