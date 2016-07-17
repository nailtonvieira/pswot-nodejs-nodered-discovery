/**
 * Copyright 2016 Nailton Andrade.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    "use strict";
    // Trabalhar com jquery dentro do javascript
    // var jsdom = require("jsdom");
    // var window = jsdom.jsdom().defaultView;
    // var $ = require('jquery')(window);
    // AQUI IMPORTA AS BIBLIOTECAS, INCLUSO A DO SPARQL CLIENTE

    var request = require('request');
    
        function Discovery(config) {
        // AQUI ELE CHAMA ASSIM QUE O NODE É INICIADO OU 
        // QUANDO O NODE É COLOCADO NO DASHBOARD
        // Criando o node
        RED.nodes.createNode(this, config);

        // AQUI VC PEGA AS VARIAVES DO CONTEXTO THIS, E COPIA PARA O NODE
        // Copiando dados do config
        this.location = config.location.toLowerCase();
        this.typedevice = config.typedevice.toLowerCase();
        this.typediscovery = config.typediscovery.toLowerCase();
        // para que a senha e password não sejam passados durante a exportação do flow
        
        // Pegando os documentos dos arquivos de configuração
        this.server = RED.nodes.getNode(config.configdiscovery);
        this.username = this.server.credentials.username;
        this.password = this.server.credentials.password;
        
        console.log("DISCOVERY PASSWORD: " + this.server.credentials.password);
        console.log("DISCOVERY USER: " + this.server.credentials.username);

        var node = this;

        var req = node.server.pswotlocation + "/discovery/" + node.server.versionapi
                + "/" + node.typedevice
                + "/?location=" + node.location
                + "&matching=" + node.typediscovery;

        console.log(config);

        var options = {
            url: req,
            method: 'GET',
            headers: {
                'User-Agent': 'request'
            },
            'auth': {
                'user': node.username,
                'pass': node.password
            }
        };


        // AQUI QUE COMEÇA O PROGRAMA, POIS QUANDO UMA MENSAGEM CHEGA NO NODE, 
        // ESSE EVENTO É CHAMADO, E ELE RECEBE A MENSAGEM COMPLETA PASSADA PELO NO ANTERIOR
        // Executa sempre que uma mensagem chega no node 'input' é um evento, 
        // 'on' cria um evento
        // msg é a mensagem que chega no node
        this.on('input', function (msg) {

            // 1) verificar se a segurança funciona - OK
            // 2) converter a resposta em json
            request(options, function (error, response, body) {
                // Imprimindo o erro caso exista
                node.warn("Requisição gerada " + req);
                node.warn("Erro na requisicao " + error);
                node.status({fill:"blue",shape:"dot",text:"sending request"});
                //console.log(error.code);
                if (!error && response.statusCode == 200) {
                    console.log(response.statusCode);
                    node.status({fill:"green",shape:"dot",text:"connected"});
                    // Colocando a resposta no msg
                    msg.payload = body;
                    // Modificar aqui com o código de não autorizado
                }else if(error === "ECONNREFUSED"){
                    // Mostra no dashboard se o serviço tá dando pau
                    node.status({fill:"yellow",shape:"ring",text:"not authorized"});
                }else{
                    node.status({fill:"red",shape:"ring",text:"disconnected"});
                }
            });
            // Manda a mensagem para o proximo node
            node.send(msg);
        });

        // ESSA FUNÇÃO É CHAMADA QUANDO O NODE-RED É FINALIZADO
        this.on("close", function () {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        });

    }
    // Registra a função Discovery no node-red
    RED.nodes.registerType("discovery", Discovery);
    
    
};
