module.exports = function(RED) {

    const Bacnet = require('node-bacnet')

    function DiscoverDevices(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name

        const node = this;

        node.status({ fill: 'green', shape: 'dot', text: 'active' })



        node.on('input', function(msg) {



          if(msg.communicationPort == "" || msg.communicationPort == null){

            msg.communicationPort = 47808;
  
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
            msg.transportClosedDuration = 9000;
          }



            //var bacnetClient = new Bacnet();


            var bacnetClient = new Bacnet({ 
                port: msg.communicationPort,                          // Use BAC0 as communication port
                interface: msg.interface,          // Listen on a specific interface
                broadcastAddress: msg.broadcastAddress,  // Use the subnet broadcast address
                apduTimeout: msg.apduTimeout,
                reuseAddr: msg.reuseAddr                     
               });







            const knownDevices = [];
            

            

      
            // emmitted when Bacnet server listens for incoming UDP packages
            bacnetClient.on('listening', () => {
            console.log('discovering devices for 2 seconds ...');
            // discover devices once we are listening
            bacnetClient.whoIs();
            
            setTimeout(() => {

            try{

            bacnetClient.close();
            console.log('closed transport ' + Date.now());

            }
            
            catch(e){
            console.log(e);
            }
            

            msg.payload = knownDevices;
            node.send(msg);
            }, msg.transportClosedDuration);



            


            
            });





            bacnetClient.on('iAm', (device) => {

                console.log("device0 ---> ", device);
                console.log("device0-0 ---> ", "found device with Bacnet id " + device.payload.deviceId + " on address " + device.header.sender.address);
                //msg.payload = "found device with Bacnet id " + device.payload.deviceId + " on address " + device.header.sender.address;
                //node.send(msg);


                try{

                    console.log("device ---> " + device);

            const address = device.header.sender;

            //discovered device ID
            const deviceId = device.payload.deviceId;
            //if (knownDevices.includes(deviceId)) return;

     

            knownDevices.push(
              {
                "deviceId" : deviceId,
                "Address": device.header.sender.address
              }
              );

                }

                catch(e){

                    console.log("exception -> ", e);

                }
            


            })



            console.log("test test 123");



        });







        


    }
    RED.nodes.registerType("discover-devices",DiscoverDevices);
}
