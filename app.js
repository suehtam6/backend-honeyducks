const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const bodyParserJson = bodyParser.json()
const app = express()

const corsOptions = {
    origin: ["*"], // Configuração de origem da requisição (IP ou Dominio)
    methods: "GET, POST, PUT, DELETE, OPTIONS",  // Configuração dos verbos que serão utilizados na API
    allowedHeaders: ['Content-type', "Authorization"]
}

app.use(cors(corsOptions))


//RECEBER O TOKEN ENCAMINHADO NAS REQUISIÇÕES E SOLICITAR A VALIDAÇÃO


const userRouter = require("././routes/user.router.js")
app.use("/v1/honeyducks/doceria/usuario", cors(), userRouter)

const categoriaRouter = require("././routes/categoria.router.js")
app.use("/v1/honeyducks/doceria/categoria", cors(), categoriaRouter)

const saborRouter = require("././routes/sabor.router.js")
app.use("/v1/honeyducks/doceria/sabor", cors(), saborRouter)

const statusRouter = require("././routes/status.router.js")
app.use("/v1/honeyducks/doceria/status", cors(), statusRouter)

const doceRouter = require("././routes/doce.router.js")
app.use("/v1/honeyducks/doceria/doce", cors(), doceRouter)



app.listen(7070, function(){
    console.log("API aguardando novas requisições..............")
})



