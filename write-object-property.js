module.exports = function (RED) {

    "use strict";

    function WriteObjectProperty(config) {
        RED.nodes.createNode(this, config);

        const Bacnet = require('node-bacnet');
        const node = this;
        this.name = config.name;

        node.status({fill: 'green', shape: 'dot', text: 'active'});

        node.on('input', function (msg) {
            var randNum = Math.floor(Math.random() * 7100);
            msg.communicationPort = 47808 + randNum;

            if (msg.interface === "" || msg.interface === null) {
                msg.interface = "0.0.0.0";
            }

            if (msg.broadcastAddress === "" || msg.broadcastAddress === null) {
                msg.broadcastAddress = "255.255.255.255";
            }

            if (msg.apduTimeout === "" || msg.apduTimeout === null) {
                msg.apduTimeout = 7000;
            }

            if (msg.reuseAddr === "" || msg.reuseAddr === null) {
                msg.reuseAddr = true;
            }

            if (msg.address === "" || msg.address === null) {
                msg.address = "address is invalid";
                node.send(msg);
                return;
            }

            var bacnetClient = new Bacnet({
                port: msg.communicationPort,
                interface: msg.interface,
                broadcastAddress: msg.broadcastAddress,
                apduTimeout: msg.apduTimeout,
                reuseAddr: msg.reuseAddr
            });

            console.log("msg.address ----> ", msg.address);
            console.log("msg.objectId ---> ", msg.objectId);
            console.log("msg.propertyId -> ", msg.propertyId);
            console.log("msg.values -----> ", msg.values);

            try {
                bacnetClient.writeProperty(msg.address, msg.objectId, msg.propertyId, msg.values, function (err, value) {
                    if (err !== null) {
                        msg.payload = err;
                        node.send(msg);
                    } else {
                        msg.payload = value;
                        node.send(msg);
                    }
                });
            } catch (e) {
                msg.payload = e;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("write-object-property", WriteObjectProperty);
};

