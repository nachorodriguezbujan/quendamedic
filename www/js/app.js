// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])
// var nameApp = angular.module('starter', ['ionic', 'uiGmapgoogle-maps'])


/*angular.module('myApp', ['pushNotify']).*/
  /*.run(function (pushNotification) {
    //register device on load
    pushNotification.registerPush();
  })*/


.run(function($ionicPlatform, $cordovaPush, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //pushNotification.registerPush();

    /*var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
    });*/

    /*var androidConfig = {
      "senderID": "723460958494"
    };

    //document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
      alert("kokahj");
    }, function(err) {
      // Error
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
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
      });

//    }, false);*/


  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  //TAB LOGIN
  .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

  //TAB HOME
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller:  'HomeCtrl'
      }
    }
  })


  //TAB HOME QUOTE DETAIL
  .state('tab.homeQuote', {
      url: '/home/:quoteId',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home-quote.html',
          controller: 'HomeQuoteDetailCtrl'
        }
      }
    })

  //TAB HOSPITAL
  .state('tab.hospital', {
      url: '/hospital',
      views: {
        'tab-hospital': {
          templateUrl: 'templates/tab-hospital.html',
          controller: 'HospitalCtrl'
        }
      }
    })

  //TAB HOSPITAL QUOTE DETAIL
  .state('tab.HospitalQuote', {
      url: '/hospital/:quoteId',
      views: {
        'tab-hospital': {
          templateUrl: 'templates/tab-hospital-quote.html',
          controller: 'HospitalQuoteDetailCtrl'
        }
      }
    })

  //TAB LOCATION
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
