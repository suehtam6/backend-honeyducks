/**
 * Objetivo: Arquivo responsável pela padronização das mensagens e status code do projeto Honeyducks
 * Data: 17/04/2026
 * Autor: Bruno Haddad Alves 
 * Versão: 1.0
 */


//Padronização dos retornos da API (Cabeçalho)

const DEFAULT_MESSAGE = {
    api_description: "API para controlar o projeto de doceria Honeyducks",
    development : "Bruno Haddad Alves",
    version: "1.0.4.26",
    status: Boolean ,
    status_code: Number,
    response: {}
}





//Mensagens de ERRO do projeto de filmes

const ERROR_BAD_REQUEST = {
    status: false,
    status_code: 400,
    message: "Não foi possível processar a requisição devido a erros nos dados enviados."
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]"
}

const ERROR_INTERNAL_SERVER_MODEL_USER = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL_USER]"
}

const ERROR_INTERNAL_SERVER_MODEL_CATEGORIA = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL_CATEGORIA]"
}

const ERROR_INTERNAL_SERVER_MODEL_STATUS = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL_CATEGORIA]"
}

const ERROR_INTERNAL_SERVER_MODEL_SABOR = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL_CATEGORIA]"
}


const ERROR_CONTENT_TYPE = {

    status: false,
    status_code: 415,
    message: "Não foi possível processar a requisição devido ao formato de dados encaminhado não ser suportado pelo servidor, apenas deve ser utilizado JSON"

}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]"
}

const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: "Não foram encontrados dados para retorno da requisição"
}

const SUCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'Item atualizado com sucesso!'
}


 // Mensagens de SUCESSO do projeto de filmes 
const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: "Item inserido com sucesso"
}

const SUCCESS_CREATED_ITEM_WARNING = {
    status: true,
    status_code: 201,
    message: "Item inserido com sucesso porem alguns dados tiveram conflitos no cadastro [DADOS DE RELACIONAMENTO]"
}


const SUCCESS_DELETED_ITEM = {
    status: true,
    status_code: 200,
    message: 'Item excluido com sucesso!'
}

const SUCCESS_RESPONSE = {
    status: true,
    status_code: 200,
}



module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_NOT_FOUND,
    SUCCESS_RESPONSE,
    SUCCESS_CREATED_ITEM_WARNING,
    SUCESS_UPDATE_ITEM,
    SUCCESS_DELETED_ITEM,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_MODEL_USER,
    ERROR_INTERNAL_SERVER_MODEL_CATEGORIA,
    ERROR_INTERNAL_SERVER_MODEL_SABOR,
    ERROR_INTERNAL_SERVER_MODEL_STATUS
}