
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
