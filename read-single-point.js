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




        console.log("test 000");


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


          console.log("bacnetClient 222-> ", bacnetClient)




          if(msg.inputType == "" || msg.inputType == null || typeof msg.inputType != 'number'){

            try{
              bacnetClient.close();
              console.log('closed transport ' + Date.now());
            } 
            catch(e){
              console.log("exception -> ", e);
            }

            

            msg.payload = "inputType is invalid";
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



          console.log("test 111");


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










          console.log("test 222");









      });







      function DataTransformation(object){

        var myArray = {};

        console.log("object.values -> ", object.values);


        for(var j = 0; j < object.values.length; j++){
    
    
    
          var k1 = object.values[j].id.toString();
          
          var v1 = object.values[j].value[0].value;
          
          var k1str = ConvertPropertyIdWithString(k1);
          
          myArray[k1str] = v1;
    


      }

      return myArray;

    }






      function ConvertPropertyIdWithString(id){
    
        var convertedValue = " PPPP ";
        
        if(id == 0){
            convertedValue = "ACKED_TRANSITIONS";
        }
        
        else if(id == 4){
            convertedValue = "ACTIVE_TEXT";
        }
        
        else if(id == 6){
            convertedValue = "ALARM_VALUE";
        }
        
        else if(id == 15){
            convertedValue = "CHANGE_OF_STATE_COUNT";
        }
        
        else if(id == 16){
            convertedValue = "CHANGE_OF _STATE_TIME";
        }
        
        else if(id == 17){
            convertedValue = "NOTIFICATION_CLASS";
        }
        
        else if(id == 22){
            convertedValue = "COV_INCREMENT";
        }
    
        else if(id == 25){
            convertedValue = "DEADBAND";
        }
    
        else if(id == 28){
            convertedValue = "DESCRIPTION";
        }
        
        else if(id == 31){
            convertedValue = "DEVICE_TYPE";
        }
        
        else if(id == 33){
            convertedValue = "ELAPSED_ACTIVE_TIME";
        }
        
        else if(id == 35){
            convertedValue = "EVENT_ENABLE";
        }
        
        else if(id == 36){
            convertedValue = "EVENT_STATE";
        }
    
        else if(id == 45){
            convertedValue = "HIGH_LIMIT";
        }
        
        else if(id == 46){
            convertedValue = "INACTIVE_TEXT";
        }
    
        else if(id == 52){
            convertedValue = "LIMIT_ENABLE";
        }
    
        else if(id == 59){
            convertedValue = "LOW_LIMIT";
        }
    
        else if(id == 65){
            convertedValue = "MAX_PRES_VALUE";
        }
    
        else if(id == 69){
            convertedValue = "MIN_PRES_VALUE";
        }
        
        else if(id == 72){
            convertedValue = "NOTIFY_TYPE";
        }
        
        else if(id == 75){
            convertedValue = "OBJECT_IDENTIFIER";
        }
        
        else if(id == 77){
            convertedValue = "OBJECT_NAME";
        }
        
        else if(id == 79){
            convertedValue = "OBJECT_TYPE";
        }
        
        else if(id == 81){
            convertedValue = "OUT_OF_SERVICE";
        }
        
        else if(id == 84){
            convertedValue = "POLARITY";
        }
        
        else if(id == 85){
            convertedValue = "PRESENT_VALUE";
        }
        
        else if(id == 103){
            convertedValue = "RELIABILITY";
        }
    
        else if(id == 106){
            convertedValue = "RESOLUTION";
        }
        
        else if(id == 111){
            convertedValue = "STATUS_FLAGS";
        }
        
        else if(id == 113){
            convertedValue = "TIME_DELAY";
        }
        
        else if(id == 114){
            convertedValue = "TIME_OF_ACTIVE_TIME_RESET";
        }
        
        else if(id == 115){
            convertedValue = "TIME_OF_STATE_COUNT_RESET";
        }
    
        else if(id == 117){
            convertedValue = "UNITS";
        }
    
        else if(id == 118){
            convertedValue = "UPDATE_INTERVAL";
        }
        
        else if(id == 130){
            convertedValue = "EVENT_TIME_STAMPS";
        }
        
        else if(id == 351){
            convertedValue = "EVENT_MESSAGE_TEXTS";
        }
        
        else if(id == 352){
            convertedValue = "EVENT_MESSAGE_TEXTS_CONFIGS";
        }
        
        else if(id == 353){
            convertedValue = "EVENT_DETECTION_ENABLE";
        }
        
        else if(id == 354){
            convertedValue = "EVENT_ALGORITHM_INHIBIT";
        }
        
        else if(id == 355){
            convertedValue = "EVENT_ALGORITHM_INHIBIT_REF";
        }
        
        else if(id == 356){
            convertedValue = "TIME_DELAY_NORMAL";
        }
        
        return convertedValue;
        
        
    }

























      


  }
  RED.nodes.registerType("read-single-point",ReadSinglePoint);











    



}

