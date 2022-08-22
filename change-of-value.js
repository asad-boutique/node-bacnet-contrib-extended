module.exports = function(RED) {



  

  function ChangeOfValue(config) {
      RED.nodes.createNode(this,config);


      const Bacnet = require('node-bacnet')





      this.name = config.name;

      this.address = config.address;

      this.inputType = config.inputType;

      this.bacnetId = config.bacnetId;
      
      this.COVtimeout = config.COVtimeout;



      const node = this;

      node.status({ fill: 'green', shape: 'dot', text: 'active' })


      





      node.on('input', function(msg) {


/*

        console.log("test 000 - change of value");


          var bacnetClient = new Bacnet({ 
            port: 47812,                          // Use BAC4 as communication port
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



          bacnetClient.on('covNotifyUnconfirmed', (data) => {
            console.log('111 Received COV: ' + JSON.stringify(data));
          });

          var address = "192.168.20.242";
          var inputType = 0;
          var bacnetId = 1;

          bacnetClient.subscribeCov(address, {type: inputType, instance: bacnetId}, 85, false, false, 0, (err) => {
            console.log('222 subscribeCOV' + err);
          });





          console.log("test 222");

*/







      });




      var randNum = Math.floor(Math.random() * 7100);
      var communicationPort = 47808 + randNum;

      var interface = "0.0.0.0";
      var broadcastAddress = "255.255.255.255";
      var apduTimeout = 7000;
      var reuseAddr = true;
      //var transportClosedDuration = 90000;



      var bacnetClient = new Bacnet({ 
        port: communicationPort,                         
        interface: interface,          // Listen on a specific interface
        broadcastAddress: broadcastAddress,  // Use the subnet broadcast address
        apduTimeout: apduTimeout,
        reuseAddr: reuseAddr                     
       });


    //    setTimeout(() => {
    //     console.log('closed transport after 0s ---Garbage Collection' + Date.now());
    //     try{
    //       bacnetClient.close();
    //     } 
    //     catch(e){
    //      console.log("exception -> ", e);
    //     }
    //     }, 90000);


      //console.log("bacnetClient 222-> ", bacnetClient)



      
      

      

      // var address = this.document.getElementById('input-address');
      // var inputType = this.document.getElementById('input-inputType');
      // var bacnetId = this.document.getElementById('input-bacnetId');

      



      // var address = "192.168.20.242";
      // var inputType = 3;
      // var bacnetId = 8;

      var address = node.address;
      var inputType = Number(node.inputType);
      var bacnetId = Number(node.bacnetId);
      var COVtimeout = Number(node.COVtimeout);


      console.log("address ---> " + address);
      console.log("inputType ---> " + inputType);
      console.log("bacnetId ---> " + bacnetId);




      bacnetClient.on('covNotifyUnconfirmed', (data) => {

        console.log('000 Received COV: ' + data);

        var str = JSON.stringify(data)
        console.log('111 Received COV: ' + str);

        var str2 = data.payload.values;
        console.log('333 Received COV: ' + str2);


        // if(Number(str.monitoredObjectId['type']) == inputType && Number(str.monitoredObjectId['instance']) == bacnetId){

        //   node.send(data);

        // }


        
        node.send(data);

      });
    


      SubcribeCOV(address, inputType, bacnetId, COVtimeout);
      



      function SubcribeCOV(address, inputType, bacnetId, COVtimeout){

        bacnetClient.subscribeCov(address, {type: inputType, instance: bacnetId}, 85, false, false, 0, (err) => {
          
  
          if(err){
            console.log('subscribeCOV error -> ', err);
          }
  
          else{
  
            setTimeout(() => {
              SubcribeCOV(address, inputType, bacnetId, COVtimeout);
              }, COVtimeout);
  
          }
  
        });

      }
      



   

















      


  }
  RED.nodes.registerType("change-of-value", ChangeOfValue);











    



}

