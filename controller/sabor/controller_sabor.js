const configMessages = require("../modulo/configMessage.js")

const saborDAO = require("../../model/DAO/sabor/sabor.js")


const validarDados = async function(sabor){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
   
       if( sabor.sabor == undefined || sabor.sabor == "" || sabor.sabor == null  || sabor.sabor.length > 30){
           customMessage.ERROR_BAD_REQUEST.field = "[SABOR] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
       } else {
           return false 
       }
}





const inserirNovoSabor =  async function(sabor, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let validacao = await validarDados(sabor)

            if(validacao){
                return validacao
            }else{

                let result = await saborDAO.insertSabor(await(tratarDados(sabor)))


                if(result){ // 201

                    sabor.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = sabor

                    return customMessage.DEFAULT_MESSAGE
                } else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL_SABOR
                }
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const listarSabor = async function() {
    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
let customMessage = JSON.parse(JSON.stringify(configMessages))

try {
    // Chama a função do DAO para retornar a lista de sabores do banco de dados
    let result = await saborDAO.selectAllSabor()

    //Validação para verificar se o DAO conseguiu processar o script do BD
    if(result){

        //Validação para verificar se o conteúdo do array tem dados de retorno
        // ou se esta vazio
        if(result.length > 0){

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.sabor = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL_SABOR
    }

} catch (error) {
    return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
}
}

const buscarSabor = async function(id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await saborDAO.selectSaborById(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.sabor = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_SABOR
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const atualizarSabor = async function(sabor, id , contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscarSabor = await buscarSabor(id)
    
            if(resultBuscarSabor.status){
    
                let validar = await validarDados(sabor)
    
                if(!validar){
    
                    sabor.id = Number(id)
    
                    let result = await saborDAO.updateSabor(await tratarDados(sabor))
    
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
    
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
    
    
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
    
                        customMessage.DEFAULT_MESSAGE.response = sabor
    
                        return customMessage.DEFAULT_MESSAGE
                    }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL_SABOR
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarSabor
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarSabor = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        let resultBuscarSabor = await buscarSabor(id)

        if(resultBuscarSabor.status){


            let result = await saborDAO.deleteSabor(id)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_SABOR
            }

        }else{
            return resultBuscarSabor
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const tratarDados = async function (sabor) {

    sabor.sabor = sabor.sabor.replaceAll("'", "")

    return sabor
    
}

module.exports = {
    inserirNovoSabor,
    listarSabor,
    buscarSabor,
    atualizarSabor,
    deletarSabor
}