/****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento , manipulação de dados para realizar o CRUD de doces
 * Data: 17/04/2026
 * Autor: Bruno Haddad Alves
 * Versão: 1.0
 */

//Import de configurações do arquivo de mensagens do projeto
const configMessages = require("../modulo/configMessage.js")

const doceDAO = require("../../model/DAO/doce/doce.js") 

//Import das controllers
const controllerDoceSabor = require("../doce/controller_doce_sabor.js")
const controllerCategoria = require('../categoria/controller_categoria.js')
const controllerStatus = require("./../status/controller_status.js")



const { application } = require("express")
const { json } = require("body-parser")

const validarDados =  async function(doce){
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if( doce.nome == undefined || doce.nome == "" || doce.nome == null  || doce.nome.length > 60){
        customMessage.ERROR_BAD_REQUEST.field = "[NOME] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (doce.valor == undefined || doce.valor == "" || doce.valor == null || isNaN(doce.valor) ){
        customMessage.ERROR_BAD_REQUEST.field = "[VALOR] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST


    }else if (doce.imagem == undefined || doce.imagem == "" || doce.imagem == null){
        customMessage.ERROR_BAD_REQUEST.field = "[IMAGEM] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST

    }else if (doce.qtde == undefined || doce.qtde == "" || doce.qtde == null || isNaN(doce.qtde) ){
        customMessage.ERROR_BAD_REQUEST.field = "[QTDE] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (doce.descricao == undefined || doce.descricao == "" || doce.descricao == null){
        customMessage.ERROR_BAD_REQUEST.field = "[DESCRICAO] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (doce.avaliacao == undefined || doce.avaliacao == "" || doce.avaliacao == null ||  doce.avaliacao.length > 4){
        customMessage.ERROR_BAD_REQUEST.field = "[AVALIACAO] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if ( doce.id_categoria == undefined  || doce.id_categoria == null ||  doce.id_categoria == "" || isNaN(doce.id_categoria) || doce.id_categoria <= 0){
        customMessage.ERROR_BAD_REQUEST.field = "[ID_CATEGORIA] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
        // Validação para FK da classificação
    } else if ( doce.id_status == undefined  || doce.id_status == null ||  doce.id_status == "" || isNaN(doce.id_status)|| doce.id_status <= 0){
        customMessage.ERROR_BAD_REQUEST.field = "[ID_STATUS] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else {
        
        return false 
    }
}

// Função para inserir um novo doce
const inserirNovoDoce = async function (doce, contentType) {

    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
        
    

    if(String(contentType).toUpperCase() == "APPLICATION/JSON"){
    
    

    // chama a funçao para validar a entrada dos dados do doce
    let validar = await validarDados(doce)


    //Retorna um JSON de erro caso algum atributo seja inválido, senão retorna um false n teve erro
    if(validar){
        return validar
    }
    else{

        let result = await doceDAO.insertDoce(await(tratarDados(doce)))

       if(result){ //201

            doce.id = result


            for(itemSabor of doce.sabor){

                let doceSabor = {
                    "id_doce": doce.id,
                    "id_sabor": itemSabor.id
                }
    
                let resulDoceSabor = await controllerDoceSabor.inserirDoceSabor(doceSabor)
                console.log(resulDoceSabor)
    
                //Validação para verificar se odos os itens de relacionamento foram inseridos
                if(!resulDoceSabor.status){
                    return customMessage.SUCCESS_CREATED_ITEM_WARNING // 201 com alerta de cadastro
                }
            }   

            //Percorre o array de generos e chegará na requisição pelo objeto
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
            customMessage.DEFAULT_MESSAGE.response = doce

            return customMessage.DEFAULT_MESSAGE

       } else { //
           return customMessage.ERROR_INTERNAL_SERVER_MODEL
       }

    }
  } else {
     return customMessage.ERROR_CONTENT_TYPE
  } 
    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const listarDoce = async function(doce) {
        // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        // Chama a função do DAO para retornar a lista de filmes do banco de dados
        let result = await doceDAO.selectAllDoce() 
        //Validação para verificar se o DAO conseguiu processar o script do BD
        if(result){
            console.log(result)

            //Validação para verificar se o conteúdo do array tem dados de retorno
            // ou se esta vazio
            if(result.length > 0){

                //Manipulação dos dados da classificação
                //Percorre o array de doces
                for(let doce of result){

                    //Busca na controller da categoria e status o id referente a fk da classificação
                    let resultCategoria = await controllerCategoria.buscarCategoria(doce.id_categoria)
                    let resultStatus = await controllerStatus.buscarStatus(doce.id_status)

                    

                    let resultSaborDoce = await controllerDoceSabor.buscarSaborIdDoce(doce.id)
                    console.log(resultSaborDoce)
                    

                    if(resultSaborDoce.status){
                        doce.sabor = resultSaborDoce.response
                        delete doce.id_doce
                    }
                    
                    

                     // Se encontrar o id
                    if(resultCategoria.status && resultStatus.status){

                        doce.categoria = resultCategoria.response.categoria
                        doce.status = resultStatus.response.status

                        delete doce.id_categoria
                        delete doce.id_status
                    }
                  
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.count = result.length
                customMessage.DEFAULT_MESSAGE.response.doce = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const listarDoceCompleto = async function(doce) {
    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
let customMessage = JSON.parse(JSON.stringify(configMessages))

try {
    let result = await doceDAO.selectDoceFormatted()
    //Validação para verificar se o DAO conseguiu processar o script do BD
    if(result){

        //Validação para verificar se o conteúdo do array tem dados de retorno
        // ou se esta vazio
        if(result.length > 0){


            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.doce = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL
    }

} catch (error) {
    console.log(error)
    return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
}
}

// Função para atualizar um Doce existente
const atualizarDoce = async function(doce, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {



        //Validaçao para verificar se o conteudo do body é um json 
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){
            // Chama a função para buscar o doce e validar se o id esta correto , se o id existe no banco de dados e se o doce existe
           let resultBuscarDoce = await buscarDoce(id)
           
           if(resultBuscarDoce.status){
                let validar = await validarDados(doce)


                if(!validar){
                    //Adiciona um atributo id no JSON de doce para enviar ao DAO um único objeto
                    doce.id = Number(id) 
                    let result = await doceDAO.updateDoce(await tratarDados(doce))

                    if(result){


                        let resultDeleteSabores = await controllerDoceSabor.deletarSaborIdDoce(doce.id)

                        console.log(resultDeleteSabores)

                        if(resultDeleteSabores.status){
                            for(itemSabor of doce.sabor){

                                let doceSabor = {
                                    "id_doce": doce.id,
                                    "id_sabor": itemSabor.id
                                }
                            
                    
                                let resulDoceSabor = await controllerDoceSabor.inserirDoceSabor(doceSabor)

                                if(!resulDoceSabor.status){
                                    return customMessage.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }
                        }

                         customMessage.DEFAULT_MESSAGE.status       = customMessage.SUCESS_UPDATE_ITEM.status
                         customMessage.DEFAULT_MESSAGE.status_code  = customMessage.SUCESS_UPDATE_ITEM.status_code
                         customMessage.DEFAULT_MESSAGE.message      = customMessage.SUCESS_UPDATE_ITEM.message
                         customMessage.DEFAULT_MESSAGE.response     = doce

                         return customMessage.DEFAULT_MESSAGE
                    }else{
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }

                }else{
                    return validar
                }
           }else{
            return resultBuscarDoce // 400 (id Invalido) (404 não encontrado) ou 500
           }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const buscarNomeDoce = async function (nome) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o id seja um numero válido
        if( nome == undefined || nome == "" || nome == null || !isNaN(nome)){
            customMessage.ERROR_BAD_REQUEST.field = "[NOME] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST //400

        }else{

            //Chama a função do DAO para pesquisar o doce pelo ID
            let result = await doceDAO.selectDoceByName(nome)
            //Validação para verificar se o DAO retornou dados ou um FALSE(Eerro)

            if(result){


                for(let doce of result){

                    //Busca na controller da categoria e status o id referente a fk da classificação
                    let resultCategoria = await controllerCategoria.buscarCategoria(doce.id_categoria)
                    let resultStatus = await controllerStatus.buscarStatus(doce.id_status)

                    let resultSaborDoce = await controllerDoceSabor.buscarSaborIdDoce(doce.id)

                    if(resultSaborDoce.status){
                        doce.sabor = resultSaborDoce.response.doce_sabor
                    }


                    
                    
                    

                     // Se encontrar o id
                    if(resultCategoria.status && resultStatus.status){

                        doce.categoria = resultCategoria.response.categoria
                        doce.status = resultStatus.response.status

                        delete doce.id_categoria
                        delete doce.id_status
                    }
                  
                }
                            //Validação para verificar se o DAO tem algum dado no array

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.doce = result

                    return customMessage.DEFAULT_MESSAGE //200

                }else{

                    return customMessage.ERROR_NOT_FOUND//404

                }
            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500(model)

            }
        }
    } catch (error) {

        console.log(error)

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}

// Função para retornar um doce filtrando pelo id 
const buscarDoce = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o id seja um numero válido
        if( id == undefined || id == "" || id == null || isNaN(id) || id < 1){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST //400

        }else{

            //Chama a função do DAO para pesquisar o doce pelo ID
            let result = await doceDAO.selectByIdDoce(id)
            //Validação para verificar se o DAO retornou dados ou um FALSE(Eerro)

            if(result){


                for(let doce of result){

                    //Busca na controller da categoria e status o id referente a fk da classificação
                    let resultCategoria = await controllerCategoria.buscarCategoria(doce.id_categoria)
                    let resultStatus = await controllerStatus.buscarStatus(doce.id_status)

                    let resultSaborDoce = await controllerDoceSabor.buscarSaborIdDoce(doce.id)

                    if(resultSaborDoce.status){
                        doce.sabor = resultSaborDoce.response.doce_sabor
                    }


                    
                    
                    

                     // Se encontrar o id
                    if(resultCategoria.status && resultStatus.status){

                        doce.categoria = resultCategoria.response.categoria
                        doce.status = resultStatus.response.status

                        delete doce.id_categoria
                        delete doce.id_status
                    }
                  
                }
                            //Validação para verificar se o DAO tem algum dado no array

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.doce = result

                    return customMessage.DEFAULT_MESSAGE //200

                }else{

                    return customMessage.ERROR_NOT_FOUND//404

                }
            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500(model)

            }
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}

const buscarDocePorIdCategoria = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o id seja um numero válido
        if( id == undefined || id == "" || id == null || isNaN(id) || id < 1){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST //400

        }else{

            //Chama a função do DAO para pesquisar o doce pelo ID
            let result = await doceDAO.selectDoceByIdCategoria(id)
            //Validação para verificar se o DAO retornou dados ou um FALSE(Eerro)

            if(result){


                for(let doce of result){

                    //Busca na controller da categoria e status o id referente a fk da classificação
                    let resultCategoria = await controllerCategoria.buscarCategoria(doce.id_categoria)
                    let resultStatus = await controllerStatus.buscarStatus(doce.id_status)

                    let resultSaborDoce = await controllerDoceSabor.buscarSaborIdDoce(doce.id)

                    if(resultSaborDoce.status){
                        doce.sabor = resultSaborDoce.response.doce_sabor
                    }


                    
                    
                    

                     // Se encontrar o id
                    if(resultCategoria.status && resultStatus.status){

                        doce.categoria = resultCategoria.response.categoria
                        doce.status = resultStatus.response.status

                        delete doce.id_categoria
                        delete doce.id_status
                    }
                  
                }
                            //Validação para verificar se o DAO tem algum dado no array

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.doce = result

                    return customMessage.DEFAULT_MESSAGE //200

                }else{

                    return customMessage.ERROR_NOT_FOUND//404

                }
            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500(model)

            }
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}

// Função para excluir um doce
const excluirDoce = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarDoce = await buscarDoce(id)
        
        if(resultBuscarDoce.status){

            let result = await doceDAO.deleteDoce(id)

            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }
            else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return resultBuscarDoce //400 e 404
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}



//Função para tratar os dados a serem inseridos
const tratarDados = async function (doce) {
    doce.nome = String(doce.nome).replaceAll("'", "")
    doce.valor = String(doce.valor).replaceAll("'", "")
    doce.descricao = String(doce.descricao).replaceAll("'", "")
    doce.avaliacao = String(doce.avaliacao).replaceAll("'", "")
    return doce
    
}


module.exports = {
    inserirNovoDoce,
    atualizarDoce,
    listarDoce,
    buscarDoce,
    listarDoceCompleto,
    buscarNomeDoce,
    buscarDocePorIdCategoria,
    excluirDoce
}