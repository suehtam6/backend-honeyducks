const knex = require("knex")

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require("../../database_config/knexConfig.js")

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

const insertDoceSabor = async function(doceSabor){
    try {
        let sql = `insert into tbl_doce_sabor (
        id_doce,
        id_sabor
    ) values (
        ${doceSabor.id_doce},
        ${doceSabor.id_sabor}
    );`
    let result = await knexConection.raw(sql)

    if(result)
        return result[0].insertId
    else
        return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateDoceSabor = async function(doceSabor){
    try {

        let sql = `update tbl_doce_sabor set    
        id_doce = ${doceSabor.id_doce},
        id_sabor = ${doceSabor.id_sabor}
        where id = ${doceSabor.id};`
        
        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false

        
    } catch (error) {
            return false
    }
}

const selectAllDoceSabor = async function(doceSabor){
   try {
        let sql = "select * from tbl_doce_sabor order by id desc"

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        } 
   } catch (error) {
        return false
   }
}

const selectByIdDoceSabor = async function(id) {
    try {
        
        let sql = `SELECT * FROM tbl_doce_sabor
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

const selectSaborByIdDoce = async function(idDoce) {
    try {
        
        let sql = `select tbl_sabor.*

        FROM tbl_doce 

            inner join tbl_doce_sabor
                on tbl_doce.id = tbl_doce_sabor.id_doce

            inner join tbl_sabor
                on tbl_sabor.id = tbl_doce_sabor.id_sabor

        WHERE tbl_doce.id = ${idDoce};`
        

        let result = await knexConection.raw(sql)

        if(Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false

    }
}



const selectDoceByIdSabor = async function(idSabor) {
    try {
        
        let sql = `select tbl_doce.*

        FROM tbl_doce
            inner join tbl_doce_sabor
                on tbl_doce.id = tbl_doce_sabor.id_doce

            inner join tbl_sabor
                on tbl_sabor.id = tbl_doce_sabor.id_sabor
                
        WHERE tbl_sabor.id = ${idSabor};`
        

        let result = await knexConection.raw(sql)

        if(Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

        return false

    }
}

const deleteDoceSabor = async function(id){
    try {
        let sql = `DELETE FROM tbl_doce_sabor WHERE id=${id};`

        let result = await knexConection.raw(sql)
        console.log(result)

        if(result)
            return true
        else 
            return false
    } catch (error) {
            return false
    }
}

const deleteSaborByIdDoce = async function(id){
    try {
        let sql = `DELETE FROM tbl_doce_sabor WHERE id_sabor=${id};`

        let result = await knexConection.raw(sql)
        console.log(result)

        if(result)
            return true
        else 
            return false
    } catch (error) {
            return false
    }
}

module.exports = {
   insertDoceSabor,
   updateDoceSabor,
   selectAllDoceSabor,
   selectByIdDoceSabor,
   selectSaborByIdDoce,
   selectDoceByIdSabor,
   deleteDoceSabor,
   deleteSaborByIdDoce
}