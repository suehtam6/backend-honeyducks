const configMessages = require("../modulo/configMessage.js")

const userDAO = require("../../model/DAO/usuario/usuario.js")


const validarDados = async function(user){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
   
       if( user.nome == undefined || user.nome == "" || user.nome == null  || user.nome.length > 80){
           customMessage.ERROR_BAD_REQUEST.field = "[USUARIO] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
       } else if (user.email == undefined || user.email == "" || user.email == null || user.email > 255 ){
           customMessage.ERROR_BAD_REQUEST.field = "[E-MAIL] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
   
       } else if (user.senha == undefined || user.senha == "" || user.senha == null || user.senha.length > 512){
           customMessage.ERROR_BAD_REQUEST.field = "[SENHA] INVÁLIDO"
           return customMessage.ERROR_BAD_REQUEST
   
       } else {
           
           return false 
       }
}


const autenticarUsuario = async function (dados, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

    if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

        const result = await userDAO.selectAuthByPassword(dados)

        if(result){


            //Import da biblioteca que gera e valida a autenticidade do JWT
            const jwt = require("../../middleware/jwt.js")

            let usuario = {}

            let tokenUser = await jwt.creatJWT(result.id)
            
            usuario.id = result.id
            usuario.email = result.email

            //Adiciona chave no JSON com token do usuário
            usuario.token = tokenUser

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.user = usuario

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_TOKEN_CREATION
        }
    }
    else{
        return customMessage.ERROR_CONTENT_TYPE
    }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}





const inserirNovoUsuario =  async function(user, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let validacao = await validarDados(user)

            if(validacao){
                return validacao
            }else{

                let result = await userDAO.insertUser(await(tratarDados(user)))
                console.log(result)


                if(result){ // 201

                    user.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = user

                    return customMessage.DEFAULT_MESSAGE
                } else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL_USER
                }
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const listarUsuario = async function() {
    // Cria uma cópia dos JSON do arquivo de configuração de mensagens 
let customMessage = JSON.parse(JSON.stringify(configMessages))

try {
    // Chama a função do DAO para retornar a lista de usuarios do banco de dados
    let result = await userDAO.selectAllUser()
    //Validação para verificar se o DAO conseguiu processar o script do BD
    if(result){

        //Validação para verificar se o conteúdo do array tem dados de retorno
        // ou se esta vazio
        if(result.length > 0){

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.count = result.length
            customMessage.DEFAULT_MESSAGE.response.user = result

            return customMessage.DEFAULT_MESSAGE
        }else{
            return customMessage.ERROR_NOT_FOUND
        }
    }else{
        return customMessage.ERROR_INTERNAL_SERVER_MODEL_USER
    }

} catch (error) {
    return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
}
}

const buscarUsuario = async function(id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(id == undefined || id == "" || id == null || isNaN(id) || id < 1 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST
        } else {

            let result = await userDAO.selectUserById(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE. response.usuario = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_USER
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const atualizarUsuario = async function(user, id , contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscarUser = await buscarUsuario(id)
    
            if(resultBuscarUser.status){
    
                let validar = await validarDados(user)
    
                if(!validar){
    
                    user.id = Number(id)
    
                    let result = await userDAO.updateUser(await tratarDados(user))
    
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
    
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
    
    
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
    
                        customMessage.DEFAULT_MESSAGE.response = user
    
                        return customMessage.DEFAULT_MESSAGE
                    }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarUser
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarUsuario = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        let resultBuscarUser = await buscarUsuario(id)

        if(resultBuscarUser.status){


            let result = await userDAO.deleteUser(id)
            console.log(result)


            if(result){
                return customMessage.SUCCESS_DELETED_ITEM
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL_USER
            }

        }else{
            return resultBuscarUser
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}





const tratarDados = async function (user) {

    user.nome = user.nome.replaceAll("'", "")
    user.email = user.email.replaceAll("'", "")
    user.senha = user.senha.replaceAll("'", "")

    return user
    
}

module.exports = {
    inserirNovoUsuario,
    listarUsuario,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario,
    autenticarUsuario


}
