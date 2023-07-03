var express = require("express");
var router = express.Router();
var models = require("../models");
var jwt = require("jsonwebtoken");

// Autorización
function verificar(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        /* si es distinto a undefined guardo solamente el token sin el Bearer <token>*/
        const tokenVerificado = bearerHeader.split(" ")[1];
        req.token = tokenVerificado;
        next();
    }else{
        res.sendStatus(403);
    }
}

router.get("/", (req, res) => {
console.log("Esto es un mensaje para ver en consola");
models.profesor
    .findAll({
        attributes: ["id","nombre","apellido","edad","id_materia"],
        include:[
            {as:'materia_relacionada',model:models.materia,attributes:["id","nombre","id_carrera"]}
        ]
    })
    .then(profesores => res.send(profesores))
    .catch(() => res.sendStatus(500));
});

router.post("/",verificar, (req, res) => {
    jwt.verify(req.token,'clave',(error,authData) =>{
        if(error){
            res.sendStatus(403);
        }else{
            models.profesor
            .create({ nombre: req.body.nombre,apellido: req.body.apellido,edad: req.body.edad,id_materia: req.body.id_materia})
            .then(profesor => res.status(201).send({ id: profesor.id, authData }))
            .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otro profesor con el mismo nombre')
                }
                else {
                    console.log(`Error al intentar insertar en la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            });
        }
    })
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
models.profesor
    .findOne({
        attributes: ["id","nombre","apellido","edad","id_materia"],
        include:[
            {as:'materia_relacionada',model:models.materia,attributes:["id","nombre","id_carrera"]}
        ],
        where: { id }
    })
    .then(profesor => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
findProfesor(req.params.id, {
    onSuccess: profesor => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
});
});

router.put("/:id", (req, res) => { 
    const onSuccess = profesor =>
    profesor
    .update({ nombre: req.body.nombre,apellido: req.body.apellido,edad: req.body.edad,id_materia: req.body.id_materia }, { fields: ["nombre","apellido","edad","id_materia"] })
    .then(() => res.sendStatus(200))
    .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otro profesor con el mismo nombre')
        }
        else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
        }
    });
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
});
});

router.delete("/:id", (req, res) => {
const onSuccess = profesor => 
    profesor
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    });
});

module.exports = router;