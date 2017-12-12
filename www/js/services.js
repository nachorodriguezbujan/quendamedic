angular.module('starter.services', [])

.factory('Quotes', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var quotes = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    all: function() {
      return quotes;
    },
    remove: function(chat) {
      quotes.splice(quotes.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < quotes.length; i++) {
        if (quotes[i].id === parseInt(chatId)) {
          return quotes[i];
        }
      }
      return null;
    },
     // Update DOM on a Received Event
    receivedEvent: function(id) {
        alert(id);
        console.log('Received Event: ' + id);
        var pushNot = window.plugins.pushNotification;
        pushNot.register(quotes.successHandler, quotes.errorHandler, 
        {"senderID":"723460958494","ecb":"quotes.onNotificationGSM"});
    },
      
    successHandler: function(success){
      alert("registrado con exito!!" + success);
    },
    
    errorHandler: function(error){
      alert("ERROR_!" + error);
    },

    onNotificationGSM: function(e){
      alert("llega");
      switch(e.event){
        case 'registered':
          if(e.regid.length > 0){
            console.log("RegId:" + e.regid);
          }
          break;
        
        case 'message':
          alert("Mensaje: " + e.message + " Contenido: " + e.msgcnt);
          break;      
        
        case 'error':
          console.log("ERROR DEL SERVICIO - NACHO");
          break;  
          
        default:
          console.log("ALGO EXTRAÑO - NACHO");
          break;  
      }
    }
  };

});
