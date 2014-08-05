'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ui.bootstrap'])
   .controller('HomeCtrl', ['$scope', 'syncData', '$modal', '$routeParams', function($scope, syncData, $modal, $routeParams) {
      syncData('profiles').$bind($scope, 'profiles').then(function () {
         $scope.profsT = $.map($scope.profiles, function(value, index) {
             return value;
         });

         $scope.profs = $scope.profsT.filter(function (prof) {
            return (typeof prof) == 'object';
         })
         if ($routeParams.email) {
            var e = $routeParams.email.split('|dot|').join('.');

            $scope.mustBe = $routeParams.email;
         }
      });
   }])

  .controller('JobCtrl', ['$scope', 'syncData', '$location', function($scope, syncData, $location) {

      $scope.syncAccount = function() {
         $scope.user = {};
         syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user').then(function(unBind) {
            $scope.unBindAccount = unBind;
            syncData('profiles').$bind($scope, 'profiles').then(function () {
               $scope.profile = $scope.profiles[$scope.user.email.split('.').join('|dot|')];
            });
         });
      };
      $scope.syncAccount();

      $scope.logout = function() {
         loginService.logout();
      };


      // constrain number of messages by limit into syncData
      // add the array into $scope.messages
      syncData('jobs').$bind($scope, 'jobs').then(function (data) {
         $scope.jobsT = $.map($scope.jobs, function(value, index) {
             return value;
         });

         $scope.jobsArr = $scope.jobsT.filter(function (job) {
            return (typeof job) === 'object' && job != undefined;
         })
      });

      // add new messages to the list
      $scope.addJob = function() {

         var handler = StripeCheckout.configure({
            key: 'pk_live_Cj0NfYaa5rcPgOKTvKswUND9',
            image: '/square-image.png',
            token: function(token) {
               $scope.jobs = ($scope.jobs && $scope.jobs != '')? $scope.jobs : {};

               console.log($scope.jobs)

               $scope.job.status = 0;
               $scope.job.paymentId = token.id;
               $scope.job.belongsTo = $scope.auth.user.uid;

               $scope.user.hasPost = true;

               console.log($scope.jobs);

               $.post('http://104.131.203.38:3000/', {
                token: token.id,
                job: $scope.job
               }, function (receipt) {
                console.log(receipt);
                 if (receipt.error) {
                   return alert;
                 }
                window.location = ('http://opencampusjobs.com/partials/post-confirm.html');
               });
            }
         });

       handler.open({
         name: 'Open Campus',
         description: 'Job Posting',
         amount: 2500
       });

      };
   }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', 'syncData', function($scope, loginService, $location, syncData) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         loginService.fb({
           rememberMe: true,
           scope: 'email'
         }, function (user) {
            console.log(user)
            loginService.createProfile(user.uid, user.email, user.name);
         });
      };

      $scope.loginPass = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
              loginService.createProfile(user.uid, user.email, $scope.name || user.name);
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if (user == undefined) {
                  $scope.err = "That email is already taken."
               }
               loginService.createProfile(user.uid, user.email, $scope.name);
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email, $scope.name);
                     $location.path('/account');
                  });
                  $location.path('/account');
               }
            });
         }
      };

      $scope.sendReminder = function () {
        console.log($scope.email)
        loginService.sendReset($scope.email);
      }

      $scope.opts = {};

      $scope.resetPassword = function() {
        $scope.opts.callback = function(err) {
          console.log(err)
          if (!err) {
            window.location = '/app.html'
          } else {
            $scope.err = err;
          }
        }
        loginService.changePassword($scope.opts)
      }

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }


   }])

   .controller('LogoutCtrl', ['$scope', 'loginService', 'changeEmailService', 'firebaseRef', 'syncData', '$location', 'FBURL', function($scope, loginService, changeEmailService, firebaseRef, syncData, $location, FBURL) {
      console.log('logging out');
      loginService.logout();
      window.location = '/'
   }])
   .controller('AccountCtrl', ['$scope', 'loginService', 'changeEmailService', 'firebaseRef', 'syncData', '$location', 'FBURL', function($scope, loginService, changeEmailService, firebaseRef, syncData, $location, FBURL) {

      $scope.syncAccount = function() {
         $scope.user = {};
         syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user').then(function(unBind) {
            $scope.unBindAccount = unBind;
            syncData('profiles').$bind($scope, 'profiles').then(function () {
               $scope.profile = $scope.profiles[$scope.user.email.split('.').join('|dot|')];
               $scope.profile.id = $scope.auth.user.id;
            });
         });
      };
      $scope.syncAccount();
      

      $scope.sub = function() {
         var d = $scope.profile;
         if (true) {
            $scope.badin = false;
            d.email = $scope.user.email;

            $scope.profiles[$scope.user.email.split('.').join('|dot|')] = d;
         } else {
            $scope.badin = true;
         }
      };


      $scope.addJob = function() {
         var p = $scope.profile;
         var j = $scope.job;

         if (j.skill && j.org && j.date && j.description) {
            if (j.editing) {
              j.editing = false
            } else {
              p.skills = p.skills || {};
              var skill = p.skills[j.skill] || {jobs: []};
              skill.jobs.push(j);
              p.skills[j.skill] = skill;
            }
            $scope.job = {};
         } else {
            // Error
            $scope.badinjob = true;
         }
      }


      $scope.logout = function() {
         loginService.logout();
      };
   }]);