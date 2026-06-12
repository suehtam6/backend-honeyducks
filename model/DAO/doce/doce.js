/**
 * Objetivo: Arquivo responsável pelo CRUD de dados do doce no banco de dados
 *      MYSQL
 * Data: 15/04/2026
 * Autor: Bruno Haddad Alves
 * Versão: 1.0
 * 
 */


// Faz o import da biblioteca para manipular dados no banco de dados MySQL
const knex = require("knex")

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require("../../database_config/knexConfig.js")

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir um novo doce no banco de dados 
const insertDoce = async function(doce){

    try {
        
     
    let sql = `insert into tbl_doce (
	nome,
    valor,
    imagem,
    qtde,
    descricao,
    avaliacao,
    id_categoria,
    id_status
) values (
	"${doce.nome}",
    "${doce.valor}",
    "${doce.imagem}",
    ${doce.qtde},
    "${doce.descricao}",
    if('${doce.avaliacao}' = " ", null, '${doce.avaliacao}'),
    ${doce.id_categoria},
    ${doce.id_status}

);`
// Encaminha para o banco de dados o scriptSQL
let result = await knexConection.raw(sql)

if(result)    
    return result[0].insertId
else    
    return false    

}


catch (error) {
    console.log(error)
    return false    
    }
}




//Funcão para atualizar um doce existente no banco de dados
const updateDoce = async function (doce) {
    try {
        let sql = `update tbl_doce set 
	nome = '${doce.nome}',
    valor = '${doce.valor}',
    descricao = '${doce.descricao}',
    avaliacao = if('${doce.avaliacao}' = " ", null, '${doce.avaliacao}'),
    id_categoria = ${doce.id_categoria},
    id_status = ${doce.id_status}
    where id = ${doce.id};`

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else 
        return false

    } catch (error) {
        return false
    }

}

//Função para retornar todos os dados de doces do banco de dados
const selectAllDoce = async function () {
    try {
        // Script SQL para listar todos os doces cadastrados
        let sql = "select * from tbl_doce order by id desc"

        //Executa no banco de dados o script e guarda o retorno do banco
        //Pode ser um erro (false) ou um array com os dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o retorno do BD é um Array ou boolean (false)
        if(Array.isArray(result)){
            return result[0] // retorna somente o indice com a lista de doces
        } else{
            // Return false do banco de dados
            return false
        }

    } catch (error) {
        // return false do JavaScritp
       return false 
    }
}

const selectDoceByIdCategoria = async function (id) {
    try {
        // Script SQL para listar todos os doces cadastrados
        let sql = `select * from tbl_doce
	inner join tbl_categoria
		on tbl_categoria.id = tbl_doce.id_categoria
	where tbl_categoria.id = ${id} order by tbl_doce.id desc;`

        //Executa no banco de dados o script e guarda o retorno do banco
        //Pode ser um erro (false) ou um array com os dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o retorno do BD é um Array ou boolean (false)
        if(Array.isArray(result)){
            return result[0] // retorna somente o indice com a lista de doces
        } else{
            // Return false do banco de dados
            return false
        }

    } catch (error) {
        // return false do JavaScritp
       return false 
    }
}

const selectDoceByName = async function (name) {
    try {
        // Script SQL para listar todos os doces cadastrados
        let sql = `select * from tbl_doce where tbl_doce.nome like  '%${name}%' order by tbl_doce.id desc;
`

        //Executa no banco de dados o script e guarda o retorno do banco
        //Pode ser um erro (false) ou um array com os dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o retorno do BD é um Array ou boolean (false)
        if(Array.isArray(result)){
            return result[0] // retorna somente o indice com a lista de doces
        } else{
            // Return false do banco de dados
            return false
        }

    } catch (error) {
        // return false do JavaScritp
       return false 
    }
}

const selectDoceFormatted = async function () {
    try {

        let sql = `select	upper(tbl_doce.nome) as NOME_MAISCULO, lower(tbl_doce.nome) as nome_minusculo, tbl_doce.nome as nome_normal,
		concat(substr(tbl_doce.descricao, 1, 20), '...') as Descricao_Formatada,
        concat(upper(substr(tbl_doce.descricao, 1, 70)), '...') as Descricao_Formatada_Maiuscula,
        concat(lower(substr(tbl_doce.descricao, 1, 70)), '...') as Descricao_Formatada_minuscula,
        upper(tbl_doce.descricao) as Descricao_Maisculo,
        lower(tbl_doce.descricao) as descricao_minusculo, tbl_doce.descricao as Descricao_Normal,
		tbl_doce.imagem, concat('R$ ', tbl_doce.valor) as Valor_Formatado, tbl_doce.valor as Valor_normal, tbl_doce.avaliacao as Avaliacao, tbl_doce.qtde,
		tbl_categoria.categoria as Categoria, tbl_sabor.sabor as Sabor,
        tbl_status.status as status
			from tbl_doce
				inner join tbl_categoria
					on tbl_doce.id_categoria = tbl_categoria.id
				inner join tbl_doce_sabor
					on tbl_doce_sabor.id_doce = tbl_doce.id
				inner join tbl_sabor
					on tbl_sabor.id = tbl_doce_sabor.id_sabor
				inner join tbl_status
					on tbl_status.id = tbl_doce.id_status
			order by tbl_doce.id desc
			;
`

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


//Função para retornar um doce filtrando pelo id 
const selectByIdDoce = async function (id) {
    try {

        let sql = `select * from tbl_doce where id=${id}`

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

//Fnção para excluir um doce filtrando pelo id  
const deleteDoce = async function (id) {
    try {
        let sql = `DELETE FROM tbl_doce WHERE id=${id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
            return false
    }
}

module.exports = {
    insertDoce,
    updateDoce,
    selectAllDoce,
    selectByIdDoce,
    deleteDoce,
    selectDoceByIdCategoria,
    selectDoceByName,
    selectDoceFormatted
}