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


router.get("/:id", async function(request, response) {
    // Recebe o id do usuario via parametro
    let id = request.params.id

    // Recebendo o body da requisição
    let result = await controllerUser.buscarUsuario(id)
    
    response.status(result.status_code)
    response.json(result)


})


router.put('/:id', bodyParserJson, async function (request, response) {

    // Recebe o content-type da requisição para validar se é JSON
    let contentType = request.headers['content-type']
    // Recebe o ID do registro a ser atualizado
    let id = request.params.id
    // Recebe os dados do body que serão modificados no BD
    let dados  = request.body

    //Chama a função para atualizar o usuário , devemos encaminhar as 3 variaveis na mesma sequencia
    // que a função foi criada na controller

    let result = await controllerUser.atualizarUsuario(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})


router.delete("/:id", async function(request, response) {

    let id = request.params.id
    
    let result = await controllerUser.deletarUsuario(id)

    response.status(result.status_code)
    response.json(result)
    
})



module.exports = router