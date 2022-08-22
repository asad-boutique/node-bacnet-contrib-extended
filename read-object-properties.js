module.exports = function(RED) {

    const Bacnet = require('node-bacnet')

    function ReadObjectProperties(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name

        const node = this;

        node.status({ fill: 'green', shape: 'dot', text: 'active' })



        node.on('input', function(msg) {



          console.log("deviceId ---> uuuu ");

          console.log("deviceId ---> ", msg.deviceId);


          //console.log("msg.communicationPort 0 ---> ", msg.communicationPort);

          var randNum = Math.floor(Math.random() * 7100);
          msg.communicationPort = 47808 + randNum;



          // if(msg.communicationPort == "" || msg.communicationPort == null){

          //   var randNum = Math.floor(Math.random() * 7100);
          //   msg.communicationPort = 47808 + randNum;

          //   console.log("msg.communicationPort ---> ", msg.communicationPort);

          // }
  
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

          if(msg.requestArray == "" || msg.apduTimeout == null){
  
            node.send("requestArray is invalid");
            return;
          }


          if(msg.address == "" || msg.address == null){
            
            msg.address = "address is invalid";
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

           console.log("msg.address -> ", msg.address);
           console.log("msg.requestArray -> ", msg.requestArray);


           console.log("requestArray[0].objectID -> ", msg.requestArray[0].objectId)
           console.log("requestArray[0].properties -> ", msg.requestArray[0].properties)




           try{

            bacnetClient.readPropertyMultiple(msg.address, msg.requestArray, (err, value) => {
        
        
        
                if (err !== null) {
                    //bacnetClient.close();
                    msg.payload = err
                    node.send(msg);
                }
        
                else {
                    //bacnetClient.close();
                    msg.payload = value
                    node.send(msg);
                }
        
        
            });
        
        }
        catch(e){
        
            msg.payload = e;
            node.send(msg);
        
        }









            console.log("test test 123");



        });







        


    }
    RED.nodes.registerType("read-object-properties", ReadObjectProperties);
}
