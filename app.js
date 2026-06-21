const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const bodyParserJson = bodyParser.json()
const app = express()

const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ['Content-type', "Authorization"]
}

app.use(cors(corsOptions))

const userRouter = require("././routes/user.router.js")
app.use("/v1/honeyducks/doceria/usuario", userRouter)

const categoriaRouter = require("././routes/categoria.router.js")
app.use("/v1/honeyducks/doceria/categoria", categoriaRouter)

const saborRouter = require("././routes/sabor.router.js")
app.use("/v1/honeyducks/doceria/sabor", saborRouter)

const statusRouter = require("././routes/status.router.js")
app.use("/v1/honeyducks/doceria/status", statusRouter)

const doceRouter = require("././routes/doce.router.js")
app.use("/v1/honeyducks/doceria/doce", doceRouter)

app.listen(7070, function(){
    console.log("API aguardando novas requisições..............")
})