const express = require('express');
const pessoas = require('./pessoasRouter.js');

module.exports = app => {
    app.use(
        express.json(),
        pessoas,
    );
};


