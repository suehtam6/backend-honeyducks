const knex = require("knex")

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require("../../database_config/knexConfig.js")


const knexConection = knex(knexDatabaseConfig.development)


const insertUser = async function(user) {

    try {
        let sql = `INSERT INTO tbl_usuario (
        nome,
        email,
        senha
) VALUES (
    '${user.nome}',
    '${user.email}',
    '${user.senha}'
);`
    let result = await knexConection.raw(sql)
    if(result)
        return result[0].insertId
    else
        return false

    } catch (error) {
        return false    
    }
    
}


const selectAllUser = async function () {
    try {
        // Script SQL para listar todos os usuários cadastrados
        let sql = "select * from tbl_usuario order by id desc"

        //Executa no banco de dados o script e guarda o retorno do banco

        //Pode ser um erro (false) ou um array com os dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o retorno do BD é um Array ou boolean (false)
        if(Array.isArray(result)){
            return result[0] // retorna somente o indice com a lista de usuários
        } else{
            // Return false do banco de dados
            return false
        }
    } catch (error) {
        // return false do JavaScritp
       return false 
    }
}


const selectUserById = async function(id) {
    try {
        
        let sql = `SELECT * FROM tbl_usuario
        WHERE id = ${id};`
        

        let result = await knexConection.raw(sql)


        if(Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

        return false

    }
}


const updateUser = async function (user) {
    try {
        let sql = `update tbl_usuario set 
    nome = '${user.nome}',
    email = '${user.email}',
    senha = '${user.senha}'
    where id = ${user.id};`

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else 
        return false

    } catch (error) {
       
        return false
    }
    
}

const deleteUser = async function(id){
    try {
        let sql = `DELETE FROM tbl_usuario WHERE id=${id};`

        let result = await knexConection.raw(sql)
        if(result)
            return true
        else 
            return false
    } catch (error) {
            return false
    }
}


const selectAuthByPassword = async function(dados) {

    try {

        let sql = `
            SELECT *
            FROM tbl_usuario
            WHERE email = '${dados.email}'
            AND senha = '${dados.senha}'
        `

        let result = await knexConection.raw(sql)
        console.log(result)

        if(Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

        return false

    }
}




module.exports = {
    insertUser,
    selectAllUser,
    selectUserById,
    selectAuthByPassword,
    updateUser,
    deleteUser,
}