'use strict';
const isCpfValido = require('../../utils/validaCpfHelper.js');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: 'docente_id'
      })
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      })
    }
  }
  Pessoa.init({
    nome: {
      type: DataTypes.STRING,
      validate: {
        len:{
          args: [3, 30],
          msg: 'O campo nome deve conter entre 3 e 30 caracteres.'
        }
      }

    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'O campo email deve conter um endereço de email válido.'
        }
      }
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
        cpfValido: (cpf) => {
          if (!isCpfValido(cpf)) {
            throw new Error('O campo cpf deve conter um número de CPF válido.');
          }
        }
      }
    }, 
    ativo: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true,
    defaultScope: {
      where: {
        ativo: true
      }
    },
    scopes: {
      todosOsRegistros: {
        where: {}
      }
    }
  });
  return Pessoa;
};