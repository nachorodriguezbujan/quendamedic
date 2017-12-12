angular.module('starter.controllers', [])

/************ DIRECTIVES ***********/

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

/******************************************** CONTROLADORES  ******************************************/

.controller('LoginCtrl', function($rootScope, $scope, $stateParams, $http, $timeout, $window, $ionicLoading, $cordovaDialogs) {

  $rootScope.hideTabs = true;
  $scope.validate_msg = false;
  $scope.login_form = true;

  //reinicio todos los inputs
  $("#Nhc").val("");
  $("#nameEP").val("");
  $("#validated").val("");
  
  $scope.loginAction = function($form) {

        var loginUserPost = $form.user.$viewValue;
        var loginPassPost = $form.pass.$viewValue;
        //alert("Los parametros son tarjeta "+ loginUserPost + " y DNI: " + loginPassPost);

        //$scope.validate_msg = true;
        
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner><br/>Cargando...'
        });

        $scope.login_form = false;

        //VALIDO LOS DATOS
        $http({
            url: 'http://proyectos.plexus.es/quendaMobileP/controller/login?cardID='+loginUserPost+'&documentID='+loginPassPost,  
            //url: 'http://localhost:8081/quendaMobileP/controller/login?cardID='+loginUserPost+'&documentID='+loginPassPost,  
            //http://localhost:8081/quendaMobile/controller/login?cardID=910812IRGO0017&documentID=45823656C
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        }).success(function (data, status, headers, config) {

              //RESPUESTA OK DEL WS
              if(status == 200){
                  if(data.exists==true){

                    $("#Nhc").val(data.nhc);
                    $("#nameEP").val(data.name);

                    //ENVIO EL FORM
                    //if ($form.$valid) {
                      //  $form.commit();
                    //}
                    //INVIERTO CAPAS
                    var levantarApp = function() {
                        $rootScope.hideTabs = false;
                        $ionicLoading.hide();  
                        $window.location.href = '#/tab/home';
                    }
                    $timeout(levantarApp, 3500);
                  }
              }else{
                $cordovaDialogs.alert('Los datos no se correspondente a ningún usuario. Inténtelo de nuevo... ', 
                  'Confirmación', 'Aceptar')
                      .then(function() {
                        // callback success
                      });
                $ionicLoading.hide();      
              }              
            
        }).error(function (data, status, headers, config) {
            if(status == 404){
                $cordovaDialogs.alert('Los datos no se corresponden a ningún usuario. Inténtelo de nuevo... ', 
                  'Confirmación', 'Aceptar')
                    .then(function() {
                       // callback success
                    }
                );
                $scope.login_form = true;
                $ionicLoading.hide();
            }else if(status == -1){
                $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                  'Confirmación', 'Aceptar')
                    .then(function() {
                       // callback success
                    }
                );
                $scope.login_form = true;
                $ionicLoading.hide();
            }else{
              alert("Fallo de login " + data + status + headers);
              $ionicLoading.hide();
            }
            
        });
    }; //CIERRO LA FUNCION DE LOGUEO
})

/* CONTROLADOR DE DATOS DE PACIENTE */
.controller('UserDataCtrl', function($scope, $http, $ionicSideMenuDelegate, $ionicLoading, $cordovaDialogs) {

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner><br/>Cargando...'
    });

    var nhc = $("#Nhc").val();
    if(nhc!="" && nhc!='undefined'){

        $http({
            url: 'http://proyectos.plexus.es/quendaMobileP/controller/userData?nhc='+nhc,
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

        }).success(function (data, status, headers, config) {
          
            //RESPUESTA OK DEL WS
            if(status == 200){
                //data es el objeto
                if(data.nhc!=null){

                  data.showMedicines = false;
                  data.showTreatments = false;
                  data.showAnnotations = false;

                  if(data.medicines != 'NO' && data.medicines != null && data.medicines != 'undefined' && data.medicines != ""){
                    data.showMedicines = true;
                  }

                  if(data.treatments != 'NO' && data.treatments != null && data.treatments != 'undefined' && data.treatments != ""){
                    data.showTreatments = true;
                  }

                  if(data.annotations != 'NO' && data.annotations != null && data.annotations != 'undefined' && data.annotations != ""){
                    data.showAnnotations = true;
                  }
                  
                  $scope.user = data;
                  $ionicLoading.hide();

                }else{
                  $cordovaDialogs.alert('El NHC del usuario se ha perdido. Por favor, recargue la sesión.', 
                    'Confirmación', 'Aceptar')
                      .then(function() {
                         // callback success
                      }
                  );
                  $ionicLoading.hide();
                }
            }else{
              $cordovaDialogs.alert('No se encuentran registrados los datos personales del usuario. Por favor, comuníquelo en su próxima consulta.', 
                'Confirmación', 'Aceptar')
                  .then(function() {
                     // callback success
                  }
              );
              $ionicLoading.hide();
            }          
          
        }).error(function (data, status, headers, config) {
            if(status == 404){
                $cordovaDialogs.alert('No se encuentran registrados los datos personales del usuario. Por favor, comuníquelo en su próxima consulta.', 
                  'Confirmación', 'Aceptar')
                    .then(function() {
                     // callback success
                    }
                );
                $ionicLoading.hide();
            }else if(status == -1){
                $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                  'Confirmación', 'Aceptar')
                    .then(function() {
                       // callback success
                    }
                );
                $ionicLoading.hide();
            }else{
                alert("Error al obtener los datos personales " + data + status + headers);
                $ionicLoading.hide();
            }           
        });
    }//close IF
    else{
        $cordovaDialogs.alert('El NHC del usuario se ha perdido. Por favor, recargue la sesión.', 
          'Confirmación', 'Aceptar')
            .then(function() {
               // callback success
            }
        );
        $ionicLoading.hide();
    }

    //si existe ticket previo de validacion, se comprueba
    var ticket = $('#validated').val();
    if(ticket != "" && ticket != 'undefined' && ticket != null && ticket != "false"){    

        setTimeout (function (){
            $cordovaDialogs.confirm('Es su turno. Entregue el ticket '+ ticket + ' y pase a consulta. ', 'Notificación',
               ['Confirmar','Rechazar']).then(function(buttonIndex) {
                  // no button = 0, 'OK' = 1, 'Cancel' = 2
                  var btnIndex = buttonIndex;
                  //Acreditado
                  if(btnIndex == 1){
                    $('#validated').val(false);
                    //document.getElementById('validated').value = false;           

                  }else if(btnIndex == 2){
                      $cordovaDialogs.alert('El usuario ha rechazado su turno. Deberá validarse otra vez. ', 'Confirmación', 'Aceptar')
                        .then(function() {
                                // callback success
                      });           
                      $('#validated').val(false);
                  }else{
                      $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                        .then(function() {
                                // callback success
                      });
                      /// document.getElementById('validated').value = false;
                  }
            });
        }, 5000);

        
    }

})


/* CONTROLADOR DE LAS CITAS */
.controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $ionicPlatform, $http, $ionicSideMenuDelegate, 
  $cordovaDialogs) {
    
    //boton izq
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicPlatform.ready(function() {

        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner><br/>Cargando...'
        });

        var nhc = $("#Nhc").val();
        if(nhc!="" && nhc!='undefined'){
          
            var nameEP = $("#nameEP").val();
            if(nameEP!="" && nameEP!='undefined'){
               $("#nameUser").append(nameEP);
            }

            $http({
                url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotes?nhc='+nhc,
                //url: 'http://localhost:8081/quendaMobile/controller/quotes?nhc='+nhc,
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

            }).success(function (data, status, headers, config) {

                //RESPUESTA OK DEL WS
                if(status == 200){
                  if(data.quotesList!=null){
                      $scope.docs = data.quotesList;
                  }
                  $ionicLoading.hide();

                }else{
                    $cordovaDialogs.alert('No se han encontrado citas registradas en el sistema para este usuario. ', 
                      'Confirmación', 'Aceptar')
                        .then(function() {
                           // callback success
                        }
                    );
                    $ionicLoading.hide();
                }                
                
            }).error(function (data, status, headers, config) {
                if(status == 404){
                    $cordovaDialogs.alert('No se han encontrado citas registradas en el sistema para este usuario. ', 
                      'Confirmación', 'Aceptar')
                        .then(function() {
                           // callback success
                        }
                    );
                    $ionicLoading.hide();
                }else if(status == -1){
                    $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                      'Confirmación', 'Aceptar')
                        .then(function() {
                           // callback success
                        }
                    );
                    $ionicLoading.hide();
                } else{
                    alert("Error en la ventana de home " + data + status + headers);
                    $ionicLoading.hide();
                }
            });
        } // cierra IF
        else{
            $cordovaDialogs.alert('El NHC del usuario se ha perdido. Por favor, recargue la sesión.', 
              'Confirmación', 'Aceptar')
                .then(function() {
                   // callback success
                }
            );
            $ionicLoading.hide();
        }


        //si existe ticket de validacion, se comprueba
        var ticket = $('#validated').val();
        if(ticket != "" && ticket != 'undefined' && ticket != null && ticket != "false"){        
            //Quotes.receivedEvent(ticket);

            setTimeout (function (){
                $cordovaDialogs.confirm('Es su turno. Entregue el ticket '+ ticket + ' y pase a consulta. ', 'Notificación',
                   ['Confirmar','Rechazar']).then(function(buttonIndex) {
                      // no button = 0, 'OK' = 1, 'Cancel' = 2
                      var btnIndex = buttonIndex;
                      //Acreditado
                      if(btnIndex == 1){
                        $('#validated').val(false);
                        //document.getElementById('validated').value = false;           

                      }else if(btnIndex == 2){
                          $cordovaDialogs.alert('El usuario ha rechazado su turno. Deberá validarse otra vez. ', 'Confirmación', 'Aceptar')
                            .then(function() {
                                    // callback success
                          });           
                          $('#validated').val(false);
                      }else{
                          $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                            .then(function() {
                                    // callback success
                          });
                          /// document.getElementById('validated').value = false;
                      }
                });
            }, 5000);
        }
          
    }, function(err) {
        $ionicLoading.hide();
        console.log(err);
    });//ionic ready

})


/* CONTROLADOR DETALLES DE CITA */
.controller('HomeQuoteDetailCtrl', function($scope, $stateParams, $http, $ionicSideMenuDelegate, $ionicLoading, $cordovaDialogs) {
  //$scope.quote = Quotes.get($stateParams.quoteId);

    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner><br/>Cargando...'
    });

    var nameEP = $("#nameEP").val();
    if(nameEP!="" && nameEP!='undefined'){
      $("#nameUserDetail").append(nameEP);
    }

    $http({
        url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotesInfo?quoteId='+$stateParams.quoteId,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

    }).success(function (data, status, headers, config) {
      
        //RESPUESTA OK DEL WS
        if(status == 200){
            if(data.idQuote!=null){
              
              if(data.ingress == true){
                data.ingress = "Se debe efectuar un ingreso para esta cita";
                $scope.quote = data;
              }else{
                data.ingress = "";
                $scope.quote = data;
              }
            }

            $ionicLoading.hide();

        }else{
            $cordovaDialogs.alert('No se ha encontrado la información para esta cita. ', 
              'Confirmación', 'Aceptar')
                .then(function() {
                   // callback success
                }
            );
            $ionicLoading.hide();
        } 
      
    }).error(function (data, status, headers, config) {
          if(status == 404){
              $cordovaDialogs.alert('No se ha encontrado la información para esta cita. ', 
                'Confirmación', 'Aceptar')
                  .then(function() {
                     // callback success
                  }
              );
              $ionicLoading.hide();
          }else if(status == 400){
              $cordovaDialogs.alert('No se ha seleccionado el ID del ninguna cita. ', 
                'Confirmación', 'Aceptar')
                  .then(function() {
                     // callback success
                  }
              );
              $ionicLoading.hide();
          }else if(status == -1){
              $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                'Confirmación', 'Aceptar')
                  .then(function() {
                     // callback success
                  }
              );
              $ionicLoading.hide();
          }else{
              alert("Error en la información de la cita " + data + status + headers);
              $ionicLoading.hide();
          }
    });

    var ticket = $('#validated').val();
    if(ticket != "" && ticket != 'undefined' && ticket != null && ticket != "false"){        

        setTimeout (function (){
            $cordovaDialogs.confirm('Es su turno. Entregue el ticket '+ ticket + ' y pase a consulta. ', 'Notificación',
               ['Confirmar','Rechazar']).then(function(buttonIndex) {
                  // no button = 0, 'OK' = 1, 'Cancel' = 2
                  var btnIndex = buttonIndex;
                  //Acreditado
                  if(btnIndex == 1){
                    $('#validated').val(false);
                    //document.getElementById('validated').value = false;           

                  }else if(btnIndex == 2){
                      $cordovaDialogs.alert('El usuario ha rechazado su turno. Deberá validarse otra vez. ', 'Confirmación', 'Aceptar')
                        .then(function() {
                                // callback success
                      });           
                      $('#validated').val(false);
                  }else{
                      $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                        .then(function() {
                                // callback success
                      });
                      /// document.getElementById('validated').value = false;
                  }
            });
        }, 5000);

    }

})



/* CONTROLADOR HOSPITAL */
.controller('HospitalCtrl', function($scope, $cordovaGeolocation, $ionicLoading, 
  $ionicPlatform, $http, $timeout, $window, $cordovaDialogs, $ionicSideMenuDelegate) {

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner><br/>Cargando...'
    });

    var isInHospital = false;
    var haveQuotes = false;
    var isValidated = false;

    var nhc = $("#Nhc").val();

    $ionicPlatform.ready(function() {

      if(nhc!="" && nhc!='undefined'){
        var nameEP = $("#nameEP").val();
        if(nameEP!="" && nameEP!='undefined'){
         $("#nameUserHospital").append(nameEP);
        }

        var today = new Date(2017, 02, 23);

        $http({
          url: 'http://proyectos.plexus.es/quendaMobileP/controller/quotes?nhc='+nhc+"&date="+today,
          method: "GET",
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        }).success(function (data, status, headers, config) {

            if(status == 200){
                if(data.quotesList!=null){
                    haveQuotes = true;
                    $scope.docs = data.quotesList;
                }  
                $ionicLoading.hide();
            }else{
                
                $cordovaDialogs.alert('El usuario no tiene ninguna cita para hoy. ', 'Confirmación', 'Aceptar')
                    .then(function() {
                    // callback success
                      });
                $ionicLoading.hide();
            }           
                        
        }).error(function (data, status, headers, config) {
            $ionicLoading.hide();
            if(status == 404){
                $cordovaDialogs.alert('El usuario no tiene ninguna cita para hoy. ', 'Confirmación', 'Aceptar')
                      .then(function() {
                        // callback success
                      });
                $ionicLoading.hide();
            }else if(status == -1){
                $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                  'Confirmación', 'Aceptar')
                    .then(function() {
                       // callback success
                    }
                );
                $ionicLoading.hide();
            }else{
              alert("Error en la ventana de hospital " + data + status + headers);
              $ionicLoading.hide();
            }
        });
      
      }else{
          $cordovaDialogs.alert('El NHC del usuario se ha perdido. Por favor, recargue la sesión.', 
            'Confirmación', 'Aceptar')
              .then(function() {
                 // callback success
              }
          );
          $ionicLoading.hide();
      }


      var ticket = $('#validated').val();
      if(ticket != "" && ticket != 'undefined' && ticket != null && ticket != "false"){        

          setTimeout (function (){
              $cordovaDialogs.confirm('Es su turno. Entregue el ticket '+ ticket + ' y pase a consulta. ', 'Notificación',
                 ['Confirmar','Rechazar']).then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    var btnIndex = buttonIndex;
                    //Acreditado
                    if(btnIndex == 1){
                      $('#validated').val(false);
                      //document.getElementById('validated').value = false;           

                    }else if(btnIndex == 2){
                        $cordovaDialogs.alert('El usuario ha rechazado su turno. Deberá validarse otra vez. ', 'Confirmación', 'Aceptar')
                          .then(function() {
                                  // callback success
                        });           
                        $('#validated').val(false);
                    }else{
                        $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                          .then(function() {
                                  // callback success
                        });
                        /// document.getElementById('validated').value = false;
                    }
              });
          }, 5000);

      }

    });//ionic ready
  

    //notificar llegada
    $scope.notifyArrival = function(idQuote) {
      console.log("Notify arrival number " + idQuote);

      var ticket = $("#validated").val();
      if(ticket!="" && ticket!='undefined' && ticket!=null && ticket!= "false"){
          isValidated = true;
      }

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
              url: 'http://proyectos.plexus.es/quendaMobileP/controller/hospitals?lat='+lat+'&long='+long,
              method: "GET",
              headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}

            }).success(function (data, status, headers, config) {
                //respuesta OK del WS
                if(status == 200){
                    if(data.hospitalList!=null){
                      console.log(data.hospitalList);

                      window.localStorage.setItem('hospitalStorage', JSON.stringify(data.hospitalList));
                      hospitals = data.hospitalsList;
                    }
                }else{
                    $cordovaDialogs.alert('No se han encontrado hospitales cerca de tu zona. ', 'Confirmación', 'Aceptar')
                      .then(function() {
                      // callback success
                        });
                }              
            
            }).error(function (data, status, headers, config) {
                if(status == 404){
                    $cordovaDialogs.alert('No se han encontrado hospitales cerca de tu zona. ', 'Confirmación', 'Aceptar')
                      .then(function() {
                      // callback success
                        });
                }else if(status == -1){
                    $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                      'Confirmación', 'Aceptar')
                        .then(function() {
                           // callback success
                        }
                    );
                    $ionicLoading.hide();
                }else{
                    alert("Fallo en la comprobacion de los hospitales " + data + status + headers);
                }
            });

        }//cierra comprobacion hospitales         
        
        if(lat > 42.6 && lat < 43 && long > -8.8 && long < -8.4){
          isInHospital = true;
        }

        if(isValidated == true && isInHospital == true){
            $cordovaDialogs.alert('El paciente está ya validado. Espere su turno. ', 'Confirmación', 'Aceptar')
              .then(function() {
              // callback success
                });
        }else if(isInHospital == false){
          $cordovaDialogs.alert('El usuario no se encuentra en ningún hospital. Acércese al mismo. ', 'Confirmación', 'Aceptar')
              .then(function() {
              // callback success
                });
        }

        $scope.map = null;
        $ionicLoading.hide();

        if(isInHospital == true && haveQuotes == true && isValidated == false){
          // si se acredita, enviamos aviso de presencia a quenda, sino mostramos citas y pto
          $cordovaDialogs.confirm('¿Desea acreditarse?', 'Aviso', ['Si','No'])
            .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = buttonIndex;
            //Acreditado
            if(btnIndex == 1){

              $http({
                url: 'http://proyectos.plexus.es/quendaMobileP/controller/validation?nhc='+nhc+'&quoteId='+idQuote,
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
              }).success(function (data, status, headers, config) {

                console.log("devuelve numero de ticket:  " + data.numTicket);
                //respuesta OK del WS
                if(status == 200){
                    if(data.numTicket!=null){
                      
                        $cordovaDialogs.alert('El usuario se ha acreditado correctamente. ' +
                            'Su número de ticket es: ' + data.numTicket, 'Confirmación', 'Aceptar')
                            .then(function() {
                            // callback success
                        });

                        $('#validated').val(data.numTicket);
                    }
                }else{
                    $cordovaDialogs.alert('No se podido asignar un ticket de turno al paciente. Inténtelo de nuevo más tarde... ', 'Confirmación', 'Aceptar')
                      .then(function() {
                      // callback success
                        });
                }               
                              
              }).error(function (data, status, headers, config) {
                    if(status == 404){
                        $cordovaDialogs.alert('No se podido asignar un ticket de turno al paciente. Inténtelo de nuevo más tarde... ', 'Confirmación', 'Aceptar')
                          .then(function() {
                          // callback success
                        });
                    }else if(status == -1){
                        $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                          'Confirmación', 'Aceptar')
                            .then(function() {
                               // callback success
                            }
                        );
                        $ionicLoading.hide();
                    }else{
                        alert("Fallo de validacion " + data + status + headers);
                    }                    
              });

            }else if(btnIndex == 2){
                $cordovaDialogs.alert('El usuario no se ha acreditado. ', 'Confirmación', 'Aceptar')
                  .then(function() {
                          // callback success
                  });
                $('#validated').val(false);
            }else{
                $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                  .then(function() {
                          // callback success
                  });
                $('#validated').val(false);
            }

          });
        }
          
      }, function(err) {
          $ionicLoading.hide();
          console.log(err);
      });//cordova position

  }//close function notify
    

})


/* CONTROLADOR DE LA UBICACION */
.controller('AccountCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $http,
   $ionicSideMenuDelegate, $cordovaDialogs) {

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }; 
    

    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Comprobando ubicación..'
    });

    $ionicPlatform.ready(function() {

      var hospitalListStorage = window.localStorage.getItem('hospitalStorage');
      var hospitals = JSON.parse(hospitalListStorage);
      
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

                //respuesta OK del WS
                if(status == 200){
                    if(data.hospitalList!=null){
                      console.log(data.hospitalList);

                      window.localStorage.setItem('hospitalStorage', JSON.stringify(data.hospitalList));
                      hospitals = data.hospitalsList;
                    }
                }else{
                    $cordovaDialogs.alert('No se han encontrado hospitales cerca de tu zona. ', 'Confirmación', 'Aceptar')
                      .then(function() {
                      // callback success
                        });
                    $ionicLoading.hide(); 
                }
            
            }).error(function (data, status, headers, config) {
                if(status == -1){
                    $cordovaDialogs.alert('Servidor no encontrado. Comprueba la conexión de red de su dispositivo.', 
                      'Confirmación', 'Aceptar')
                        .then(function() {
                           // callback success
                        }
                    );
                    $ionicLoading.hide();
                }else{
                  alert("Fallo en la comprobacion de los hospitales " + data + status + headers);
                  $ionicLoading.hide();
                }                
            });

          }//cierra comprobacion hospitales    

          //define mi propia ubicacion
          var mapOptions = {
              center: myLatlng,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };      
          
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);      

          var image = 'img/flag1.png';
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

          $scope.map = map; 
          $ionicLoading.hide();  
          
      }, function(err) {
          $ionicLoading.hide();
          console.log(err);
      });

      //elimina registro de monitoreo
      //watch.clearWatch();


      var ticket = $('#validated').val();
      if(ticket != "" && ticket != 'undefined' && ticket != null && ticket != "false"){        

          setTimeout (function (){
              $cordovaDialogs.confirm('Es su turno. Entregue el ticket '+ ticket + ' y pase a consulta. ', 'Notificación',
                 ['Confirmar','Rechazar']).then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    var btnIndex = buttonIndex;
                    //Acreditado
                    if(btnIndex == 1){
                      $('#validated').val(false);
                      //document.getElementById('validated').value = false;           

                    }else if(btnIndex == 2){
                        $cordovaDialogs.alert('El usuario ha rechazado su turno. Deberá validarse otra vez. ', 'Confirmación', 'Aceptar')
                          .then(function() {
                                  // callback success
                        });           
                        $('#validated').val(false);
                    }else{
                        $cordovaDialogs.alert('La opción seleccionada no es válida. ', 'Confirmación', 'Aceptar')
                          .then(function() {
                                  // callback success
                        });
                        /// document.getElementById('validated').value = false;
                    }
              });
          }, 5000);

      }
     
  });     
});

