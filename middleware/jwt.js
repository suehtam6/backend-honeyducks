/****************************************************************************************************************
 * Objetivo: Implementação do JWT no projeto de doces
 * Data: 16/06/2026
 * Autor: Bruno Haddad Alves
 * Versão: 1.0
 */

//Import de configurações do arquivo de mensagens do projeto

//Import da biblioteca JWT
const jwt = require('jsonwebtoken')
const SECRET = "bruno130508"
const  EXPIRES= 60

//Criação do JWT (Retorna um token)
const creatJWT = async function (payLoad) {

    //Gera o token
        // payload - A identificação do usuário autenticado
        // SECRET - a chave secreta criada
        //expiresIn - Tempo de expiração do token
    const token = jwt.sign({userID: payLoad}, SECRET , {expiresIn: EXPIRES})

    return token;
}


//Validação de autenticidade do JWT (Recebe token para fazer validação)

// Valida a autenticidade do token
const validateJWT = async function (token) {
    let status = false

    jwt.verify(token, SECRET, async function (err, decode) {
        if(!err)
            status = true

        return status
    })

}


module.exports = {
    creatJWT,
    validateJWT
}
