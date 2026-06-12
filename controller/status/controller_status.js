const configMessages = require("../modulo/configMessage.js")

const statusDAO = require("../../model/DAO/status/status.js")


const validarDados = async function(status){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
   
       if( status.status == undefined || status.status == "" || status.status == null  || status.status.length > 15){
           customMessage.ERROR_BAD_REQUEST.field = "[STATUS] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
       } else {
           return false 
       }
}





const inserirNovoStatus =  async function(status, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let validacao = await validarDados(status)

            if(validacao){
                return validacao
            }else{

                let result = await statusDAO.insertStatus(await(tratarDados(status)))


                if(result){ // 201

                    status.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = status

                    return customMessage.DEFAULT_MESSAGE
                } else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL_STATUS
                }
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const listarStatus = async function() {
    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
let customMessage = JSON.parse(JSON.stringify(configMessages))

try {
    // Chama a função do DAO para retornar a lista de status do banco de dados
    let result = await statusDAO.selectAllStatus()
    //Validação para verificar se o DAO conseguiu processar o script do BD
    if(result){

        //Validação para verificar se o conteúdo do array tem dados de retorno
        // ou se esta vazio
        if(result.length > 0){

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.status = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL_STATUS
    }

} catch (error) {
    return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
}
}

const buscarStatus = async function(id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await statusDAO.selectStatusById(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.status = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_STATUS
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const atualizarStatus = async function(status, id , contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscarStatus = await buscarStatus(id)
    
            if(resultBuscarStatus.status){
    
                let validar = await validarDados(status)
    
                if(!validar){
    
                    status.id = Number(id)
    
                    let result = await statusDAO.updateStatus(await tratarDados(status))
    
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
    
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
    
    
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
    
                        customMessage.DEFAULT_MESSAGE.response = status
    
                        return customMessage.DEFAULT_MESSAGE
                    }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL_STATUS
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarStatus
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarStatus = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        let resultBuscarStatus = await buscarStatus(id)

        if(resultBuscarStatus.status){


            let result = await statusDAO.deleteStatus(id)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_STATUS
            }

        }else{
            return resultBuscarStatus
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const tratarDados = async function (status) {

    status.status = status.status.replaceAll("'", "")

    return status
    
}

module.exports = {
    inserirNovoStatus,
    listarStatus,
    buscarStatus,
    atualizarStatus,
    deletarStatus
}