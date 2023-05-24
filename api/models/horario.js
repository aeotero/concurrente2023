'use strict';
module.exports = (sequelize, DataTypes) => {
    const horario = sequelize.define('horario', {
    dia: DataTypes.STRING,
    inicio: DataTypes.TIME,
    fin: DataTypes.TIME,
    id_materia: DataTypes.INTEGER
}, {});
    
    horario.associate = function(models) {
        /* horario pertenece a materia */
        horario.belongsTo(models.materia,{
            as: 'materia_relacionada',
            foreignKey:'id_materia'
        })
    };
    return horario;
};