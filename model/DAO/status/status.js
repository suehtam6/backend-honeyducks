const knex = require("knex")

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require("../../database_config/knexConfig.js")


const knexConection = knex(knexDatabaseConfig.development)


const insertStatus = async function(status) {

    try {
        let sql = `INSERT INTO tbl_status (
        status
) VALUES (
    '${status.status}'
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


const selectAllStatus = async function () {
    try {
        // Script SQL para listar todos os status cadastradas
        let sql = "select * from tbl_status order by id desc"

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


const selectStatusById = async function(id) {
    try {
        
        let sql = `SELECT * FROM tbl_status
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


const updateStatus = async function (status) {
    try {
        let sql = `update tbl_status set 
    status = '${status.status}'
    where id = ${status.id};`

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else 
        return false

    } catch (error) {
       
        return false
    }
    
}

const deleteStatus = async function(id){
    try {
        let sql = `DELETE FROM tbl_status WHERE id=${id};`

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
    insertStatus,
    selectAllStatus,
    selectStatusById,
    updateStatus,
    deleteStatus
}