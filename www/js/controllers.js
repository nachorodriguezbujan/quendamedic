angular.module('starter.controllers', [])

/************ DIRECTIVES ***********/

.directive("ngFormCommit", [function(){
    return {
        require:"form",
        link: function($scope, $el, $attr, $form) {
            $form.commit = function() {
                $el[0].submit();
            };
        }
    };
}])

.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$watch(attributes.hideTabs, function(value){
                $rootScope.hideTabs = value;
            });

            scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
})

/*
.run(function($cordovaPush, $rootScope) {

  var androidConfig = {
    "senderID": "723460958494",
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
      alert("kokahj");
    }, function(err) {
      // Error
    })

    /*$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });


      // WARNING: dangerous to unregister (results in loss of tokenID)
      $cordovaPush.unregister(options).then(function(result) {
        // Success!
      }, function(err) {
        // Error
      })

    }, false);

  });*/

/*********** CONTROLADORES  *************/

.controller('LoginCtrl', function($rootScope, $scope, $stateParams, $http, $timeout, $window) {

  $rootScope.hideTabs = true;

  $scope.loginAction = function($form) {

        //FUERZO UN USUARIO ANTES DE MANDARLO
        //$("input[name='user']").val("45872726P");
        //$("input[name='pass']").val("dsalud1");
        var loginUserPost = $form.user.$viewValue;
        var loginPassPost = $form.pass.$viewValue;
        //alert("Los parametros son "+ loginUserPost + " y cont: " + loginPassPost);

        //$scope.login_form = false;
        //$scope.validate_msg = true;

        //VALIDO LOS DATOS
        $http({
            url: 'http://proyectos.plexus.es/quendaMobileP/controller/login?cardID='+loginUserPost+'&documentID='+loginPassPost,  
            //url: 'http://localhost:8081/quendaMobile/controller/login?cardID=910812IRGO0017&documentID=45823656C',
            //'+loginUserPost+'&documentID='+loginPassPost,  
            //http://localhost:8081/quendaMobile/controller/login?cardID=910812IRGO0017&documentID=45823656C
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        }).success(function (data, status, headers, config) {

            if(data.exists==true){

                //$rootScope.numAlerts = data.numAlerts;
                //$rootScope.numContents = data.numContents;
                //$rootScope.province = data.provinceId;
                //$rootScope.userSaved = loginUserPost;
                //$rootScope.passSaved = loginPassPost;
                $scope.title = "Cargando...";
                document.getElementById("Nhc").value = data.nhc;

                var nameEP = "";
                if(document.getElementById("Nhc").value == '6631491'){
                  nameEP = "Cristina Iglesias Rodriguez";
                }else if(document.getElementById("Nhc").value == '52123614'){
                  nameEP = "Marcos Gil Amaya";
                }else if(document.getElementById("Nhc").value == '1524321'){
                  nameEP = "Beatriz Perez Santiso";
                }
                document.getElementById("nameEP").value = nameEP;

                //ENVIO EL FORM
                //if ($form.$valid) {
                  //  $form.commit();
                //}
                //INVIERTO CAPAS
                var levantarApp = function() {
                    //$scope.sideMenu_cofares = true;
                    $rootScope.hideTabs = false;
                    $window.location.href = '#/tab/home';
                }
                $timeout(levantarApp, 3500);

            }else{
                alert("Los datos no son correctos...");
                $scope.validate_msg = false;
                $scope.login_form = true;
            }
        }).error(function (data, status, headers, config) {
                alert("Fallo de login " + data + status + headers);
        });
    }; //CIERRO LA FUNCION DE LOGUEO
  // $scope.chat = Chats.get($stateParams.chatId);
})


.controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $ionicPlatform, $http) {
    $ionicPlatform.ready(function() {

      var nhc = document.getElementById("Nhc").value;
      if(nhc!="" && nhc!='undefined'){
        var nameEP = document.getElementById("nameEP").value;
        if(nameEP!="" && nameEP!='undefined'){
           $("#nameUser").append(nameEP);
        }

        $http({
            url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotes?nhc='+nhc,
            //url: 'http://localhost:8081/quendaMobile/controller/quotes?nhc='+nhc,
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

        }).success(function (data, status, headers, config) {

            if(data.quotesList!=null){
              $scope.docs = data.quotesList;
            }
            
            //alert("success y : " + data);
            /*if(data.size() == 10){
                $scope.title = "Cargando...";             

            }else{
                alert("Los datos no son correctos...");
                $scope.validate_msg = false;
                $scope.login_form = true;
            }*/
        }).error(function (data, status, headers, config) {
                alert("Fallo de login " + data + status + headers);
        });
      } // cierra IF
          
      }, function(err) {
          $ionicLoading.hide();
          console.log(err);
      });//ionic ready

})




.controller('HomeQuoteDetailCtrl', function($scope, $stateParams, $http) {
  //$scope.quote = Quotes.get($stateParams.quoteId);


  $http({
      url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotesInfo?quoteId='+$stateParams.quoteId,
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

  }).success(function (data, status, headers, config) {

      //data es el objeto
      if(data.idQuote!=null){
        
        if(data.ingress == true){
          data.ingress = "Se debe efectuar un ingreso para esta cita";
          $scope.quote = data;
        }else{
          data.ingress = "";
          $scope.quote = data;
        }
        

        /*
        $scope.quote.hospital = data.hospital;
        $scope.quote.service = data.service;
        $scope.quote.date = data.date;
        $scope.quote.time = data.time;*/

      }
      
  }).error(function (data, status, headers, config) {
          alert("Fallo de login " + data + status + headers);
  });


})

/*.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
*/

.controller('HospitalCtrl', function($scope, $cordovaGeolocation, $cordovaBackgroundGeolocation, $ionicLoading, $ionicPlatform, $http, $timeout, $window, $cordovaDialogs) {

  var isInHospital = false;
  var haveQuotes = false;


    $scope.agg = function($form) {
      alert("lala");
    }
  $ionicPlatform.ready(function() {

      var nhc = document.getElementById("Nhc").value;
      var hospitalListStorage = window.localStorage.getItem('hospitalStorage');
      var hospitals = JSON.parse(hospitalListStorage);
      if(nhc!="" && nhc!='undefined'){
        var nameEP = document.getElementById("nameEP").value;
        if(nameEP!="" && nameEP!='undefined'){
         $("#nameUser").append(nameEP);
        }

        var today = new Date();

        $http({
          url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotes?nhc='+nhc+"&date="+today,
          method: "GET",
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        }).success(function (data, status, headers, config) {

          if(data.quotesList!=null){
            haveQuotes = true;
            $scope.docs = data.quotesList;
          }
                        
        }).error(function (data, status, headers, config) {
              alert("Fallo de login " + data + status + headers);
        });
      }


      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Comprobando ubicación..'
      });
      
      var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;

          var myLatlng = new google.maps.LatLng(lat, long);
          console.log("Mi ubicacion ---> Latitud: " + lat + " y Longitud: " + long);

          //comprueba los hospitales de la zona
          if(hospitals == null || hospitals == 'undefined' || hospitals.length == 0){
            
            $http({
              url: 'http://proyectos.plexus.es/quendaMobileP/controller/hospitals?lat='+lat+'&long='+long,
              method: "GET",
              headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

            }).success(function (data, status, headers, config) {

              if(data.hospitalList!=null){
                console.log(data.hospitalList);

                window.localStorage.setItem('hospitalStorage', JSON.stringify(data.hospitalList));
                hospitals = data.hospitalsList;
              }
            
            }).error(function (data, status, headers, config) {
                alert("Fallo en la comprobacion de los hospitales " + data + status + headers);
            });
          }         
          
          if(lat > 42){
            isInHospital = true;
          }

          /*if(hospitals != null){
            for(var i=0; i<hospitals.length;i++){
              if(hospitals[i].latitude == lat && hospitals[i].longitude == long){
                isInHospital = true;
              }
            }
          }*/

          $scope.map = null;
          $ionicLoading.hide();

          if(isInHospital == true && haveQuotes == true){
            // si se acredita, enviamos aviso de presencia a quenda, sino mostramos citas y pto
            $cordovaDialogs.confirm('¿Desea acreditarse?', 'Aviso', ['Si','No'])
              .then(function(buttonIndex) {
              // no button = 0, 'OK' = 1, 'Cancel' = 2
              var btnIndex = buttonIndex;
              //Acreditado
              if(btnIndex == 1){

                $http({
                  url: 'http://proyectos.plexus.es/quendaMobileP/controller/validation?nhc='+nhc,
                  method: "GET",
                  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                }).success(function (data, status, headers, config) {

                  console.log("devuelve numero de ticket:  " + data.numTicket);

                  if(data.numTicket!=null){
                    //$scope.docs = data.quotesList;
                    $cordovaDialogs.alert('El usuario se ha acreditado correctamente. ' +
                      'Su número de ticket es: ' + data.numTicket, 'Confirmación', 'Aceptar')
                        .then(function() {
                          // callback success
                        });

                    document.getElementById('validated').value = true;
                  }                  
                                
                }).error(function (data, status, headers, config) {
                      alert("Fallo de validation " + data + status + headers);
                });

              }else if(btnIndex == 2){
                $cordovaDialogs.alert('El usuario no se ha acreditado. ', 'Confirmación', 'Aceptar')
                  .then(function() {
                          // callback success
                  });
                document.getElementById('validated').value = false;
              }else{

              }

            });
          }
            
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });//cordova position
      
  });//ionic ready

})


.controller('HospitalQuoteDetailCtrl', function($scope, $stateParams, $http) {
  //$scope.chat = Chats.get($stateParams.quoteId);
  //la

  $http({
      url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotesInfo?quoteId='+$stateParams.quoteId,
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

  }).success(function (data, status, headers, config) {

      //data es el objeto
      if(data.idQuote!=null){
        
        if(data.ingress == true){
          data.ingress = "Se debe efectuar un ingreso para esta cita";
          $scope.quote = data;
        }else{
          data.ingress = "";
          $scope.quote = data;
        }

      }
      
  }).error(function (data, status, headers, config) {
          alert("Fallo de login " + data + status + headers);
  });
})



.controller('AccountCtrl', function($scope, $cordovaGeolocation, $cordovaBackgroundGeolocation, $ionicLoading, $ionicPlatform, $http) {

  $ionicPlatform.ready(function() {

      var hospitalListStorage = window.localStorage.getItem('hospitalStorage');
      var hospitals = JSON.parse(hospitalListStorage);

      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Comprobando ubicación..'
      });
      
      var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;

          var myLatlng = new google.maps.LatLng(lat, long);
          console.log("Mi ubicacion ---> Latitud: " + lat + " y Longitud: " + long);


           //comprueba los hospitales de la zona
          if(hospitals == null || hospitals == 'undefined' || hospitals.length == 0){
            
            $http({
              url: 'http://proyectos.plexus.es/quendaMobile/controller/hospitals?lat='+lat+'&long='+long,
              method: "GET",
              headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

            }).success(function (data, status, headers, config) {

              if(data.hospitalList!=null){
                console.log(data.hospitalList);

                window.localStorage.setItem('hospitalStorage', JSON.stringify(data.hospitalList));
                hospitals = data.hospitalsList;
              }
            
            }).error(function (data, status, headers, config) {
                alert("Fallo en la comprobacion de los hospitales " + data + status + headers);
            });
          }   

          //define mi propia ubicacion
          var mapOptions = {
              center: myLatlng,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };      
          
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);      

          var image = 'img/nac2.png';
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image,
            title: 'Estoy aqui..'
          });

          if(hospitals != null){
            for(var i=0; i<hospitals.length;i++){
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(hospitals[i].latitude, hospitals[i].longitude),
                map: map,
                title: hospitals[i].name
              });
            }
          }
          

          //coords of my hospitals to mark in the map
          /*var hospital1 = new google.maps.LatLng(42.876991, -8.5625566); //CLINICO
          var hospital2 = new google.maps.LatLng(43.3440865, -8.3904343); //CHUAC

         /* var marker = new google.maps.Marker({
            position: hospital1,
            map: map,
            title: 'Hospital - 1'
          });*/

          /*var marker = new google.maps.Marker({
            position: hospital2,
            map: map,
            title: 'Hospital - 2'
          });*/


          $scope.map = map; 
          $ionicLoading.hide();  
          /*$cordovaBackgroundGeolocation.configure({
                url: 'http://www.as.com',
                params: {
                    //deviceId: deviceId,
                    "location": {
                        "latitude": lat + 2.5,
                        "longitude": long + 0.25
                    }
                },
                desiredAccuracy: 10,
                stationaryRadius: 10,
                distanceFilter: 10,
                activityType: 'OtherNavigation',
                debug: true, 
                stopOnTerminate: false
            })
            .then(null);

            $cordovaBackgroundGeolocation.init();*/
          
      }, function(err) {
          $ionicLoading.hide();
          console.log(err);
      });


      // BackgroundGeoLocation is highly configurable.
      /*$cordovaBackgroundGeolocation.configure({
          //console.log("pr  " + bgGeo);
            url: 'http://www.my_api_url_here/',
            params: {
                deviceId: "testApp",
                "location": {
                    "latitude": "38.896339999999995",
                    "longitude": "-77.08521460000001"
                }
            },
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            notificationTitle: 'TestTitle', // <-- android only, customize the title of the notification
            notificationText: 'TestText', // <-- android only, customize the text of the notification
            activityType: 'OtherNavigation',
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
        });

        //bgGeo.start();


      /*  var watch = $cordovaGeolocation.watchPosition(posOptions);
        watch.then(
          null,
          function(err) {
            // error
          },
          function(position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
        });

        var watch = $cordovaGeolocation.watchPosition(posOptions);
        watch.then(
          null,
          function(err) {
            // error
          },
          function(position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
            console.log("LALA" + lat);
        });


        watch.clearWatch();
        // OR
        /*$cordovaGeolocation.clearWatch(watch)
          .then(function(result) {
            // success
            }, function (error) {
            // error
          });*/
  });     
});


  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

