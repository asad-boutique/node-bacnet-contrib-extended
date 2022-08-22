module.exports = function(RED) {



  

  function WriteAValue(config) {
      RED.nodes.createNode(this,config);


      const Bacnet = require('node-bacnet')





      this.name = config.name

      const node = this;

      node.status({ fill: 'green', shape: 'dot', text: 'active' })





      node.on('input', function(msg) {




        console.log("test 000 - write a value");


          var bacnetClient = new Bacnet({ 
            port: 47813,                          // Use BAC5 as communication port
            interface: '0.0.0.0',          // Listen on a specific interface
            broadcastAddress: '255.255.255.255',  // Use the subnet broadcast address
            apduTimeout: 4000,
            reuseAddr: true                     
           });


           setTimeout(() => {
            console.log('closed transport after 0s ---Garbage Collection' + Date.now());
            try{
              bacnetClient.close();
            } 
            catch(e){
             console.log("exception -> ", e);
            }
            }, 90000);


          //console.log("bacnetClient 222-> ", bacnetClient)



        //   bacnetClient.on('covNotifyUnconfirmed', (data) => {
        //     console.log('111 Received COV: ' + JSON.stringify(data));
        //   });

        //   var address = "192.168.20.242";
        //   var inputType = 0;
        //   var bacnetId = 1;

        //   bacnetClient.subscribeCov(address, {type: inputType, instance: bacnetId}, 85, false, false, 0, (err) => {
        //     console.log('222 subscribeCOV' + err);
        //   });






        const values = [
            {objectId: {type: 8, instance: 9000}, values: [
              {property: {id: 28, index: 12}, value: [{type: Bacnet.enum.ApplicationTag.BOOLEAN, value: true}], priority: 8}
            ]}
          ];
          bacnetClient.writePropertyMultiple('192.168.20.242', values, (err, value) => {
            console.log('value: ', value);
            console.log('err: ', err);
          });



        // const values = [
        //     {objectId: {type: 8, instance: 9000}, values: [
        //       {property: {id: 28, index: 12}, value: [{type: bacnet.enum.ApplicationTag.BOOLEAN, value: true}], priority: 8}
        //     ]}
        //   ];
        //   bacnetClient.writePropertyMultiple('192.168.20.242', values, (err, value) => {
        //     console.log('value: ', value);
        //   });



        // bacnetClient.writeProperty('192.168.20.242', {type: 3, instance: 8}, 85, [
        //     {type: 85, value: 1}
        //   ], (err, value) => {
        //     console.log('value: ', value);
        //   });


          






        // bacnetClient.writeProperty('192.168.20.242', {type: 3, instance: 8}, 85, [
        //     {type: Bacnet.enum.PropertyIdentifier.PRESENT_VALUE, value: 1}
        //   ], (err, value) => {
        //     console.log('value: ', value);
        //   });





          console.log("test 222");









      });































      


  }
  RED.nodes.registerType("write-a-value",WriteAValue);











    



}

