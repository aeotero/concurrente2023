var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
    console.log("Obteniendo horarios");
    models.horario
    .findAll({
        attributes: ["id", "dia", "inicio", "fin"]
    })
    .then(horarios => res.send(horarios))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
    models.horario
    .create({ dia: req.body.dia, inicio: req.body.inicio, fin: req.body.fin })
    .then(horario => res.status(201).send({ id: horario.id }))
    .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: error al crear horario')
        }
        else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`)
            res.sendStatus(500)
        }
    });
});

const findHorario = (id, { onSuccess, onNotFound, onError }) => {
    models.horario
    .findOne({
        attributes: ["id", "dia", "inicio", "fin"],
        where: { id }
    })
    .then(horario => (horario ? onSuccess(horario) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    findHorario(req.params.id, {
        onSuccess: horario => res.send(horario),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
});

router.put("/:id", (req, res) => {
    const onSuccess = horario =>
    horario
        .update({ dia: req.body.dia, inicio: req.body.inicio,fin: req.body.fin }, { fields: ["dia","inicio","fin"] })
        .then(() => res.sendStatus(200))
        .catch(error => {
            if (error == "SequelizeUniqueConstraintError: Validation error") {
                res.status(400).send('Bad request: error al actualizar horario')
            }
            else {
                console.log(`Error al intentar actualizar la base de datos: ${error}`)
                res.sendStatus(500)
            }
        });
    findHorario(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
});
});

router.delete("/:id", (req, res) => {
const onSuccess = horario =>
    horario
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findHorario(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    });
});

module.exports = router;
