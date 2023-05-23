'use strict';
module.exports = (sequelize, DataTypes) => {
    const profesor = sequelize.define('profesor', {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        edad:DataTypes.INTEGER,
        id_materia: DataTypes.INTEGER
    }, {});
    profesor.associate = function(models) {
        /* profesor pertenece a materia */
        profesor.belongsTo(models.materia,{
            as: 'materia_relacionada',
            foreignKey:'id_materia'
        })
    };
    return profesor;
};