const configMessages = require("../modulo/configMessage.js")

const categoriaDAO = require("../../model/DAO/categoria/categoria.js")


const validarDados = async function(categoria){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
   
       if( categoria.categoria == undefined || categoria.categoria == "" || categoria.categoria == null  || categoria.categoria.length > 30){
           customMessage.ERROR_BAD_REQUEST.field = "[CATEGORIA] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
       } else {
           return false 
       }
}





const inserirNovaCategoria =  async function(categoria, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let validacao = await validarDados(categoria)

            if(validacao){
                return validacao
            }else{

                let result = await categoriaDAO.insertCategoria(await(tratarDados(categoria)))


                if(result){ // 201

                    categoria.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = categoria

                    return customMessage.DEFAULT_MESSAGE
                } else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL_CATEGORIA
                }
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const listarCategoria = async function() {
    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
let customMessage = JSON.parse(JSON.stringify(configMessages))

try {
    // Chama a função do DAO para retornar a lista de categorias do banco de dados
    let result = await categoriaDAO.selectAllCategoria()
    //Validação para verificar se o DAO conseguiu processar o script do BD
    if(result){

        //Validação para verificar se o conteúdo do array tem dados de retorno
        // ou se esta vazio
        if(result.length > 0){

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.categoria = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL_CATEGORIA
    }

} catch (error) {
    return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
}
}

const buscarCategoria = async function(id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await categoriaDAO.selectCategoriaById(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE.response.categoria = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_CATEGORIA
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const atualizarCategoria = async function(categoria, id , contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscarCategoria = await buscarCategoria(id)
    
            if(resultBuscarCategoria.status){
    
                let validar = await validarDados(categoria)
    
                if(!validar){
    
                    categoria.id = Number(id)
    
                    let result = await categoriaDAO.updateCategoria(await tratarDados(categoria))
    
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
    
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
    
    
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
    
                        customMessage.DEFAULT_MESSAGE.response = categoria
    
                        return customMessage.DEFAULT_MESSAGE
                    }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarCategoria
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarCategoria = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        let resultBuscarCategoria = await buscarCategoria(id)

        if(resultBuscarCategoria.status){


            let result = await categoriaDAO.deleteCategoria(id)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_CATEGORIA
            }

        }else{
            return resultBuscarCategoria
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}





const tratarDados = async function (categoria) {

    categoria.categoria = categoria.categoria.replaceAll("'", "")

    return categoria
    
}

module.exports = {
    inserirNovaCategoria,
    listarCategoria,
    buscarCategoria,
    atualizarCategoria,
    deletarCategoria
}