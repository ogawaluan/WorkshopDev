
// Usei express para criar e configurar meu servidor
const express = require("express")
const server = express()
const db = require("./db")

//const ideas = [
//    {
//        img: "https://image.flaticon.com/icons/png/512/2729/2729007.png",
//        title: "Cursos de Programação",
//        category: "Estudo",
//        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//        url: "https://rocketseat.com.br"
//    },
//    {
//        img: "https://image.flaticon.com/icons/png/512/2729/2729005.png",
//        title: "Exercício",
//        category: "Saúde",
//        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//        url: "https://rocketseat.com.br"
//    },
//    {
//        img: "https://image.flaticon.com/icons/png/512/2729/2729027.png",
//        title: "Meditação",
//        category: "Mentalidade",
//        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//        url: "https://rocketseat.com.br"
//    },
//    {
//        img: "https://image.flaticon.com/icons/png/512/2729/2729032.png",
//        title: "Karaokê",
//        category: "Música",
//        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//        url: "https://rocketseat.com.br"
//    },
//]

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))


//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

// criei uma rota / e capturei o pedido do cliente para responder
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send("ERRO NO BANCO DE DADOS!")
        }
        
        const reversedIdeas = [...rows].reverse()
        let lastIdeas = []
        for (let idea of reversedIdeas){
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

    

        return res.render("index.html", { ideas: lastIdeas })
    })


    
})

server.get("/ideias", function(req, res) {
    
    db.all(`SELECT * FROM ideas`, function(err, rows){
        
        if (err) {
            console.log(err)
            return res.send("ERRO NO BANCO DE DADOS!")
        }
        
        const reversedIdeas = [...rows].reverse()
    
        return res.render("ideias.html", { ideas: reversedIdeas})

    })
    
})

server.post("/", function(req, res){
    //Inserir Dados na Tabela
    const query = `
        INSERT INTO ideas (
            image,
            title,
            category,
            description,
            link
        ) VALUES(?,?,?,?,?);
    `
    
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]


    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("ERRO NO BANCO DE DADOS!")
        }

        return res.redirect("/ideias")
    })
})
// Liguei meu servidor
server.listen(3000)