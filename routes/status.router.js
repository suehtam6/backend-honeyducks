// Import do express
const express = require('express')

// Criando um objeto de rota para os Endpoints de status
const router = express.Router()

const bodyParser = require("body-parser")

//Permitindo a utilizaçãp de JSON no body da requisição
const bodyParserJson = bodyParser.json()

const controllerStatus = require("../controller/status/controller_status")


router.post("/", bodyParserJson, async function(request, response) {

    let dados = request.body
    let contentType = request.headers["content-type"]
    let result = await controllerStatus.inserirNovoStatus(dados, contentType)
    response.status(result.status_code)
    response.json(result)
    
})

router.get("/", async function (request, response) {
    let result = await controllerStatus.listarStatus()

    response.status(result.status_code)
    response.json(result)
})


router.get("/:id", async function(request, response) {
    // Recebe o id do status via parametro
    let id = request.params.id

    // Recebendo o body da requisição
    let result = await controllerStatus.buscarStatus(id)
    
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

    let result = await controllerStatus.atualizarStatus(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})


router.delete("/:id", async function(request, response) {

    let id = request.params.id
    
    let result = await controllerStatus.deletarStatus(id)

    response.status(result.status_code)
    response.json(result)
    
})



module.exports = router