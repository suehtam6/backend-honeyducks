// Import do express
const express = require('express')

// Criando um objeto de rota para os Endpoints de usuário
const router = express.Router()

const bodyParser = require("body-parser")

//Permitindo a utilizaçãp de JSON no body da requisição
const bodyParserJson = bodyParser.json()

const controllerUser = require("../controller/user/controller_user.js")


const verifyJWT = async function(request, response, next){

    //Receb o token encaminhado no header da requisição
    let token = request.headers['x-access-token']

    //Biblioteca para validação do token
    const jwt = require("../middleware/jwt.js")

    const autentic = await jwt.validateJWT(token)

    //Verifica se a requisição podera continuar ou se será encerrada
    if(autentic)
        next()
    else
        return response.status(401).end()
}


router.post("/", bodyParserJson, async function(request, response) {

    let dados = request.body
    let contentType = request.headers["content-type"]
    let result = await controllerUser.inserirNovoUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
    
})

router.get("/", verifyJWT , async function (request, response) {
    let result = await controllerUser.listarUsuario()

    response.status(result.status_code)
    response.json(result)
})

router.post("/login", bodyParserJson, async function(request, response) {

    let dados = request.body
    let contentType = request.headers["content-type"]

    let result = await controllerUser.autenticarUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
    
})


router.get("/:id", verifyJWT, async function(request, response) {
    let id = request.params.id
    let result = await controllerUser.buscarUsuario(id)
    
    response.status(result.status_code)
    response.json(result)
})


router.put('/:id', verifyJWT, bodyParserJson, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados  = request.body

    let result = await controllerUser.atualizarUsuario(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})


router.delete("/:id", verifyJWT, async function(request, response) {
    let id = request.params.id
    
    let result = await controllerUser.deletarUsuario(id)

    response.status(result.status_code)
    response.json(result)
})



module.exports = router