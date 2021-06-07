const knex = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel.js');

module.exports = {

    async index(req, res) {
        try {
            const results = await knex('users');

            return res.json(results);
        } catch (error) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        }
        
    },

    async createUser(req, res, next) {
        try {

            const { email, pass } = req.body;

            bcrypt.hash(pass, 10, async (errBcrypt, hash) => {
                if (errBcrypt) return res.status(500).send({ error: errBcrypt })
                
                await knex('users')
                .insert([{
                    email,
                    pass: hash
                }])
                .then(result => {

                    const response = {
                        mensagem: 'Usuário criado com sucesso',
                        usuarioCriado: {
                            email
                        }
                    }

                    return res.status(201).send(response);
                })
                .catch(err => {
                    return res.status(500).send({ error: err })
                });
            });

        } catch (error) {
            res.send(400, error);
            next(error);
        }
    },

    async loginUser(req, res, next) {
        
        try {
            let userModel = UserModel;
            
            userModel = req.body;

            await knex('users')
            .where({
                'email': userModel.email
            })
            .then(userRes => {
                bcrypt.compare(userModel.pass, userRes[0].pass, (err, result) => {
                    if (err) return res.status(401).send({ mensagem: 'Falha na autenticação' });

                    if (result) {
                        const token = jwt.sign({
                            idUser: userRes[0].idUser,
                            email: userRes[0].email,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        });
    
                        return res.status(200).send({ 
                            mensagem: 'Autenticado com sucesso',
                            token: token,
                        });
                    }
                    
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });

                });
                
            })
            .catch(userErr => {
                return res.status(404).send({ mensagem: 'Usuário não encontrado' });
            });

        } catch (error) {
            next(error);
        }

    },

};