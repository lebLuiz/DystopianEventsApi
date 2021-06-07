const express = require('express');
const bodyParser = require('body-parser');

const metodOverride = require('method-override');

const routes = require('./routes');
const app = express();

//Habilitar o uso do JSON
app.use(express.json());

app.use(metodOverride('X-HTTP-Method-Override'));

//Habilitar o uso do req.body na aplicação
app.use(express.urlencoded({ extended: true }));

// FICA CRITÉRIO UTILIZAR O bodyParser OU O Express PARA AUTORIZAR O USO DO BODY
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use(routes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: error.message })
});

app.listen(3030, () => console.log('Server is running - editandoTeste(06/06/21)'));