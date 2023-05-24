'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
    /* materia pertenece a carrera */
    materia.belongsTo(models.carrera,{
      as: 'carrera_relacionada',
      foreignKey:'id_carrera'
    }),
    materia.hasOne(models.profesor,{
      as: 'profesor_relacionada',
      foreignKey:'id_materia'
    }),
    materia.hasMany(models.horario,{
      as: 'horario_relacionada',
      foreignKey: 'id_materia'
    })
  };
  return materia;
};