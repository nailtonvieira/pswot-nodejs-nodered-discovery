module.exports = function (RED) {

    var request = require('request');

    function triplestore(config) {
        RED.nodes.createNode(this, config);


        var fuseki = "http://localhost:3030/nodered/query";

        this.location = config.location;
        this.typedevice = config.typedevice;
        this.datestart = config.datestart;
        this.dateend = config.dateend;

        // Pegando os documentos dos arquivos de configuração
        this.server = RED.nodes.getNode(config.configdiscovery);
        this.username = this.server.credentials.username;
        this.password = this.server.credentials.password;


        var node = this;
        var req;
        // Formando a query

        req = node.server.pswotlocation + "/discovery/" + node.server.versionapi
                + "/" + node.typedevice + "/query"
                + "/?location=" + node.location
                + "&datestart=" + node.datestart
                + "&dateend=" + node.dateend;


        console.log(req);

        var options = {
            url: fuseki,
            method: 'POST',
            headers: {
                'Accept': 'application/sparql-results+json'
            },
            'auth': {
                'user': node.username,
                'pass': node.password
            },
            // Propósito de teste, para verificar recebimento e tratamento do JSON
            form:{
                query:'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 25'
            }
        };

        this.on('input', function (msg) {

            request(options, function (error, response, body) {
                // Imprimindo o erro caso exista
                node.status({fill: "blue", shape: "dot", text: "sending request"});
                console.log(error);
                if (!error && response.statusCode == 200) {
                    console.log(response.statusCode);
                    node.status({fill: "green", shape: "dot", text: "connected"});
                    // Colocando a resposta no msg
                    console.log(body);
                    msg.payload = body;
                    node.send(msg);
                    // Modificar aqui com o código de não autorizado
                } else if (error === "ECONNREFUSED") {
                    // Mostra no dashboard se o serviço tá dando pau
                    node.warn("Erro na requisicao " + error);
                    node.status({fill: "yellow", shape: "ring", text: "not authorized"});
                } else {
                    node.warn("Erro na requisicao " + error);
                    node.status({fill: "red", shape: "ring", text: "disconnected"});
                }
            });
        });
    }
    RED.nodes.registerType("tdb simple out", triplestore);
};
