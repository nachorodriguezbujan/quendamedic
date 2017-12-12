// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])


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

  });
})

.config(function($stateProvider, $urlRouterProvider ,$ionicConfigProvider) {

  //allow to put the navbar in the bottom and center  
  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle("center");

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
      cache: false,
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

  //TAB DATOS PERSONALES
  .state('tab.userData', {
      cache: false,
      url: '/userData',
      views: {
        'tab-userData': {
          templateUrl: 'templates/tab-userData.html',
          controller: 'UserDataCtrl'
        }
      }
    })

  //TAB HOME
  .state('tab.home', {
    cache: false,
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
      cache: false,
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
      cache: false,
      url: '/hospital',
      views: {
        'tab-hospital': {
          templateUrl: 'templates/tab-hospital.html',
          controller: 'HospitalCtrl'
        }
      }
    })

  //TAB LOCATION
  .state('tab.account', {
    cache: false,
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
