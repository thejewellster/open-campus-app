"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/students', {
         passwordRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      $routeProvider.when('/post', {
         passwordRequired: true,  // must authenticate before viewing this page
         templateUrl: 'partials/job-post-form.html',
         controller: 'JobCtrl'
      });

      $routeProvider.when('/jobs', {
         authRequired: true,
         templateUrl: 'partials/jobs.html',
         controller: 'JobCtrl'
      });

      $routeProvider.when('/queue', {
         templateUrl: 'partials/queue.html',
         controller: 'JobCtrl'
      });

      $routeProvider.when('/logout', {
         templateUrl: 'partials/login.html',
         controller: 'LogoutCtrl'
      });
      
      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/profileinfo.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.when('/password', {
         templateUrl: 'partials/password.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.when('/reset', {
         templateUrl: 'partials/reset.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.when('/view/:email', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      //playbook in app to showcase featured students
      $routeProvider.when('/playbook', {
         templateUrl: 'partials/playbook.html',
         controller: 'HomeCtrl'
      });





      $routeProvider.otherwise({redirectTo: '/students'});
   }]);