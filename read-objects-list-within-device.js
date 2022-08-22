module.exports = function(RED) {

    const Bacnet = require('node-bacnet')

    function ReadObjectsListWithinDevice(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name

        const node = this;

        node.status({ fill: 'green', shape: 'dot', text: 'active' })



        node.on('input', function(msg) {



          console.log("deviceId ---> uuuu ");

          console.log("deviceId ---> ", msg.deviceId);



          if(msg.communicationPort == "" || msg.communicationPort == null){

            var randNum = Math.floor(Math.random() * 7100);
            msg.communicationPort = 47808 + randNum;

          }
  
          if(msg.interface == "" || msg.interface == null){
  
            msg.interface = "0.0.0.0";
          }
  
          if(msg.broadcastAddress == "" || msg.broadcastAddress == null){
  
            msg.broadcastAddress = "255.255.255.255";
          }
  
          if(msg.apduTimeout == "" || msg.apduTimeout == null){
  
            msg.apduTimeout = 7000;
          }
  
          if(msg.reuseAddr == "" || msg.reuseAddr == null){
            msg.reuseAddr = true;
          }
  
          


          if(msg.transportClosedDuration == "" || msg.transportClosedDuration == null){

            msg.transportClosedDuration = 90000;
          }

          if(msg.deviceId == "" || msg.deviceId == null){

            msg.payload = "deviceId is invalid";
            node.send(msg);
            return;
          }

          if(msg.address == "" || msg.address == null){

            msg.payload = "address is invalid";
            node.send(msg);
            return;
          }




          var bacnetClient = new Bacnet({ 
            port: msg.communicationPort,                          // Use BAC0 as communication port
            interface: msg.interface,          // Listen on a specific interface
            broadcastAddress: msg.broadcastAddress,  // Use the subnet broadcast address
            apduTimeout: msg.apduTimeout,
            reuseAddr: msg.reuseAddr                     
           });

           console.log("deviceId ---> ", msg.deviceId);




           const requestArray = [
            { objectId: { type: 8, instance: msg.deviceId }, properties: [{ id: 76 }] },
            ];



            try{

              bacnetClient.readPropertyMultiple(msg.address, requestArray, (err, value) => {

    

                if (err !== null) {
                    bacnetClient.close();
                    msg.payload = err
                    node.send(msg);
                }
            
                else{
                    bacnetClient.close();
                    msg.payload = value.values[0].values[0].value;
                    node.send(msg);
                }
            
            
            });

            }

            catch(e){

              console.log(e);

            }










            console.log("test test 123");



        });







        


    }
    RED.nodes.registerType("read-objects-list-within-device", ReadObjectsListWithinDevice);
}
