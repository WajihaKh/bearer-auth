
'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET;

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, secretKey);
      },
    },
  });

  model.beforeCreate(async (user) => {
    const hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    if (!user) throw new Error('Invalid User');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid Password');
    return user;
  };

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      console.log('token ', token);
      console.log('secret key', process.env.SECRET);
      const user = await this.findOne({ where: { username: parsedToken.username } });
      console.log('user', user);
      if (!user) throw new Error('User Not Found');
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userSchema;
