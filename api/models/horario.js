'use strict';
module.exports = (sequelize, DataTypes) => {
    const horario = sequelize.define('horario', {
    dia: DataTypes.STRING,
    inicio: DataTypes.TIME,
    fin: DataTypes.TIME
}, {});
    return horario;
};