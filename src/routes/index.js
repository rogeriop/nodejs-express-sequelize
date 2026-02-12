const express = require('express');
const pessoas = require('./pessoasRouter.js');
const categorias = require('./categoriasRouter.js');
const cursos = require('./cursosRouter.js');

module.exports = app => {
    app.use(
        express.json(),
        pessoas,
        categorias,
        cursos
  
    );
};


