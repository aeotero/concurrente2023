'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING
  }, {});
  
  carrera.associate = function(models){
    carrera.hasMany(models.materia,{
      as: 'materias', /*nombre para referenciar*/
      foreignKey: 'id_carrera' /* clave de asociación */ 
    })
  };
  return carrera;
};