module.exports = function(RED) {



  

  function ReadSinglePoint(config) {
      RED.nodes.createNode(this,config);


      const Bacnet = require('node-bacnet')





      this.name = config.name

      const node = this;

      node.status({ fill: 'green', shape: 'dot', text: 'active' })





      node.on('input', function(msg) {



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




       // console.log("test 000");


          var bacnetClient = new Bacnet({ 
            port: msg.communicationPort,                          // Use BAC3 as communication port
            interface: msg.interface,          // Listen on a specific interface
            broadcastAddress: msg.broadcastAddress,  // Use the subnet broadcast address
            apduTimeout: msg.apduTimeout,
            reuseAddr: msg.reuseAddr                     
           });


           setTimeout(() => {
            console.log('closed transport after 9s ---Garbage Collection' + Date.now());
            try{
              bacnetClient.close();
            } 
            catch(e){
             console.log("exception -> ", e);
            }
            }, msg.transportClosedDuration);


         // console.log("bacnetClient 222-> ", bacnetClient)





         if (msg.inputType == undefined) {


          try{
            bacnetClient.close();
            console.log('closed transport ' + Date.now());
          } 
          catch(e){
            console.log("exception -> ", e);
          }

          msg.payload = "inputType is invalid 0";
          node.send(msg);
          return;
      
          }
      
          if (msg.inputType == null) {

            try{
              bacnetClient.close();
              console.log('closed transport ' + Date.now());
            } 
            catch(e){
              console.log("exception -> ", e);
            }
      
          msg.payload = "inputType is invalid 1";
          node.send(msg);
          return;
      
          }
      
          if (typeof msg.inputType != 'number') {

            try{
              bacnetClient.close();
              console.log('closed transport ' + Date.now());
            } 
            catch(e){
              console.log("exception -> ", e);
            }           
      
          msg.payload = "inputType is invalid 2";
          node.send(msg);
          return;
      
          }





          if(msg.bacnetId == "" || msg.bacnetId == null || typeof msg.bacnetId != 'number'){

            try{
              bacnetClient.close();
              console.log('closed transport ' + Date.now());
            } 
            catch(e){
              console.log("exception -> ", e);
            }

            

            msg.payload = "bacnetId is invalid";
            node.send(msg);
            return;
          }

          if(msg.address == "" || msg.address == null || typeof msg.address == 'number'){


            try{
              bacnetClient.close();
              console.log('closed transport ' + Date.now());
            } 
            catch(e){
              console.log("exception -> ", e);
            }

            msg.payload = "address is invalid and should be a string";
            node.send(msg);
            return;
          }



         // console.log("test 111");


          let inputType = msg.inputType;
          let bacnetId = msg.bacnetId;
          let address = msg.address;


          const requestArray = [
            {objectId: {type: inputType, instance: bacnetId}, properties: [{id: 8}]},
          ];
        
          bacnetClient.readPropertyMultiple(address, requestArray, (err, value) => {
              console.log(' value: ', value);
              console.log(' err: ', err);

              // msg.payload = value;
              // node.send(msg);

              try{

                var arr = DataTransformation(value.values[0]);

                console.log(arr);
              
                msg.payload = arr;
                node.send(msg);

              
                bacnetClient.close();
                console.log('closed transport ' + Date.now());
              } 
              catch(e){
                console.log("exception -> ", e);
              }


            });










         // console.log("test 222");









      });







      function DataTransformation(object){

        var myArray = {};

        //console.log("object.values -> ", object.values);


        for(var j = 0; j < object.values.length; j++){
    
    
    
          var k1 = object.values[j].id.toString();
          
          // console.log("k1 --> ", k1)

          var v1 = null;

          if (object.values[j].value[0]?.value != undefined && object.values[j].value[0]?.value != null){

             v1 = object.values[j].value[0].value;

             }

          // console.log("v1 --> ", v1)
          
          var k1str = ConvertPropertyIdWithString(k1);
          
          myArray[k1str] = v1;
    


      }

      return myArray;

    }






      function ConvertPropertyIdWithString(id){

        
        var convertedValue = " PPPP ";

        var arrayOfKeys = Object.keys(Bacnet.enum.PropertyIdentifier);
        var arrayOfValues = Object.values(Bacnet.enum.PropertyIdentifier);
    
        // console.log("arrayOfValues --> ", arrayOfValues);
    
        // console.log("id -->", id);
    
        var indexOfS = arrayOfValues.indexOf(parseInt(id, 10));
    
        // console.log("indexOfS -->", indexOfS);
    
        //console.log("key -> ", arrayOfKeys[indexOfS]);
    
        convertedValue = arrayOfKeys[indexOfS];
    
        
        
        return convertedValue;
        
        
    }

























      


  }
  RED.nodes.registerType("read-single-point",ReadSinglePoint);











    



}

