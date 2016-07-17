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

    function configdiscovery(config) {
        // AQUI ELE CHAMA ASSIM QUE O NODE É INICIADO OU 
        // QUANDO O NODE É COLOCADO NO DASHBOARD
        // Criando o node
        RED.nodes.createNode(this, config);

        // AQUI VC PEGA AS VARIAVES DO CONTEXTO THIS, E COPIA PARA O NODE
        // Copiando dados do config
        this.pswotlocation = config.pswotlocation.toLowerCase();
        this.versionapi = config.versionapi.toLowerCase();
        // para que a senha e password não sejam passados durante a exportação do flow
        this.username = this.credentials.username;
        this.password = this.credentials.password;
        
        console.log("CONFIG PASSWORD: " + this.password);
        console.log("CONFIG USER: " + this.username);

        console.log(config);

    }
    // Registra a função Discovery no node-red
    RED.nodes.registerType("configdiscovery", configdiscovery, {credentials: {
            username: {type: "text"},
            password: {type: "password"}
        }});
    
    
};
