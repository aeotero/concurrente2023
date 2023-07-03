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
models.materia
    .findAll({
        attributes: ["id", "nombre","id_carrera"],
        include:[
            {as:'carrera_relacionada',model:models.carrera,attributes:["id","nombre"]},
            {as:'profesor_relacionada',model:models.profesor,attributes:["id","nombre","apellido","edad"]},
            {as:'horario_relacionada',model:models.horario,attributes:["id","dia","inicio","fin"]}
        ]
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
});

router.post("/",verificar, (req, res) => {
    jwt.verify(req.token,'clave',(error,authData) =>{
        if(error){
            res.sendStatus(403);
        }else{
            models.materia
            .create({ nombre: req.body.nombre,id_carrera: req.body.id_carrera})
            .then(materia => res.status(201).send({ id: materia.id, authData }))
            .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: error al intentar crear una materia')
                }
                else{
                    console.log(`Error al intentar insertar en la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            });
        }
    })
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
models.materia
    .findOne({
        attributes: ["id", "nombre","id_carrera"],
        include:[
            {as:'carrera_relacionada',model:models.carrera,attributes:["id","nombre"]},
            {as:'profesor_relacionada',model:models.profesor,attributes:["id","nombre","apellido","edad"]},
            {as:'horario_relacionada',model:models.horario,attributes:["id","dia","inicio","fin"]}
        ],
        where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
});
});

router.put("/:id", (req, res) => { 
    const onSuccess = materia =>
    materia
    .update({ nombre: req.body.nombre,id_carrera: req.body.id_carrera }, { fields: ["nombre","id_carrera"] })
    .then(() => res.sendStatus(200))
    .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: error al intentar actualizar materia')
        }
        else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
        }
    });
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
});
});

router.delete("/:id", (req, res) => {
const onSuccess = materia => 
    materia
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    });
});

module.exports = router;