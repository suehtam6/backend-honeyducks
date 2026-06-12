const knex = require("knex")

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require("../../database_config/knexConfig.js")


const knexConection = knex(knexDatabaseConfig.development)


const insertSabor = async function(sabor) {

    try {
        let sql = `INSERT INTO tbl_sabor (
        sabor
) VALUES (
    '${sabor.sabor}'
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


const selectAllSabor = async function () {
    try {
        // Script SQL para listar todos os sabores cadastradas
        let sql = "select * from tbl_sabor order by id desc"

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


const selectSaborById = async function(id) {
    try {
        
        let sql = `SELECT * FROM tbl_sabor
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


const updateSabor = async function (sabor) {
    try {
        let sql = `update tbl_sabor set 
    sabor = '${sabor.sabor}'
    where id = ${sabor.id};`

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else 
        return false

    } catch (error) {
       
        return false
    }
    
}

const deleteSabor = async function(id){
    try {
        let sql = `DELETE FROM tbl_sabor WHERE id=${id};`

        let result = await knexConection.raw(sql)
        if(result)
            return true
        else 
            return false
    } catch (error) {
            return false
    }
}



module.exports = {
    insertSabor,
    selectAllSabor,
    selectSaborById,
    updateSabor,
    deleteSabor
}