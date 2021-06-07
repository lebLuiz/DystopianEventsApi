const express = require('express');
const login = require('../middleware/login');

const routes = express.Router();

const UserController = require('./controllers/UserController');

routes.get('/users', login.obrigatorio, UserController.index);

routes.post('/createUser', UserController.createUser);

routes.post('/loginUser', UserController.loginUser);

module.exports = routes;