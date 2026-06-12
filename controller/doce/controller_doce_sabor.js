/****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento , manipulação de dados para realizar o CRUD de doces
 * Data: 17/04/2026
 * Autor: Bruno Haddad Alves
 * Versão: 1.0
 */

//Import de configurações do arquivo de mensagens do projeto

const configMessages = require("../modulo/configMessage.js")
const doceSaborDAO = require("../../model/DAO/sabor_doce/sabor_doce.js")

const validarDados = async function(doceSabor){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    if(doceSabor.id_doce == undefined || doceSabor.id_doce == null || doceSabor.id_doce.length > 45 || isNaN(doceSabor.id_doce) || doceSabor.id_doce <= 0){
        customMessage.ERROR_BAD_REQUEST.field = "[ID_DOCE] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    }else if(doceSabor.id_sabor == undefined || doceSabor.id_sabor == null || doceSabor.id_sabor.length > 45 || isNaN(doceSabor.id_sabor) || doceSabor.id_sabor <= 0){
        customMessage.ERROR_BAD_REQUEST.field = "[ID_SABOR] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const inserirDoceSabor =  async function(doceSabor){

    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
            let validacao = await validarDados(doceSabor)

            if(validacao){
                return validacao
            }else{
                let result = await doceSaborDAO.insertDoceSabor(doceSabor)
                


                if(result){ // 201

                    doceSabor.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = doceSabor

                    return customMessage.DEFAULT_MESSAGE
                } else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const listarDoceSabor = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await doceSaborDAO.selectAllDoceSabor()

    if(result){
        if(result.length > 0){
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.doce_sabor = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL
    }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarDoceSabor = async function(doceSabor, id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {
            let resultBuscarSabor = await buscarDoceSabor(id)
    
            if(resultBuscarSabor.status){
    
                let validar = await validarDados(doceSabor)
    
                if(!validar){
    
                    doceSabor.id = Number(id)
    
                    let result = await doceSaborDAO.updateDoceSabor(doceSabor)
    
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
    
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
    
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
    
                        customMessage.DEFAULT_MESSAGE.response = doceSabor
    
                        return customMessage.DEFAULT_MESSAGE
                    }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarSabor
            }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Função para buscar os generos filtrando pelo ID do filme
const buscarSaborIdDoce = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_DOCE] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await doceSaborDAO.selectSaborByIdDoce(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.doce_sabor = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDoceIdSabor = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_SABOR] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await doceSaborDAO.selectDoceByIdSabor(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.doce_sabor= result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const buscarDoceSabor = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await doceSaborDAO.selectByIdDoceSabor(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.filme_genero = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const deletarSaborIdDoce = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {


        


            let result = await doceSaborDAO.deleteSaborByIdDoce(id)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }


        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const deletarDoceSabor = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        let resultBuscarDoceSabor = await buscarDoceSabor(id)

        if(resultBuscarDoceSabor.status){


            let result = await doceSaborDAO.deleteDoceSabor(id)
            console.log(result)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{
            return resultBuscarDoceSabor
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


module.exports = {
    inserirDoceSabor,
    listarDoceSabor,
    buscarDoceSabor,
    atualizarDoceSabor,
    deletarDoceSabor,
    buscarDoceIdSabor,
    buscarSaborIdDoce,
    deletarSaborIdDoce

}