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

  .controller('ChatCtrl', ['$scope', 'syncData', function($scope, syncData) {
      $scope.newMessage = null;

      // constrain number of messages by limit into syncData
      // add the array into $scope.messages
      $scope.messages = syncData('messages', 10);

      // add new messages to the list
      $scope.addMessage = function() {
         if( $scope.newMessage ) {
            $scope.messages.$add({text: $scope.newMessage});
            $scope.newMessage = null;
         }
      };
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
            key: 'pk_test_4Qzxdeqktxov3gdhQjsmJ6hH',
            image: '/square-image.png',
            token: function(token) {
               $scope.jobs = ($scope.jobs && $scope.jobs != '')? $scope.jobs : {};

               console.log($scope.jobs)

               $scope.job.status = 0;
               $scope.job.paymentId = token.id;
               $scope.job.belongsTo = $scope.auth.user.uid;

               $scope.user.hasPost = true;

               console.log($scope.jobs);


               wsh.exec({
                 code: function() {
                   return fs.Segfaultx64.test.charge(args);
                 },
                 args: {
                   token: token.id,
                   job: $scope.job
                 },
                 success: function(receipt) {
                  console.log(receipt);
                   if (receipt.error) {
                     return alert;
                   }
                  window.location = ('http://opencampusjobs.com/partials/post-confirm.html');
                 }, 
                 failure: function(a) {
                  console.log(a)
                 }
               });
            }
         });

       handler.open({
         name: 'Open Campus',
         description: 'Job Posting',
         amount: 1000
       });

      };
   }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', 'syncData', function($scope, loginService, $location, syncData) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         // $scope.err = null;
         // if( !$scope.email ) {
         //    $scope.err = 'Please enter an email address';
         // }
         // else if( !$scope.pass ) {
         //    $scope.err = 'Please enter a password';
         // }
         // else {
         loginService.fb({
           rememberMe: true,
           scope: 'email'
         }, function (user) {
            console.log(user)
            loginService.createProfile(user.uid, user.email, user.name);
         });
         // }
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
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, $scope.name, function(err, user) {
               if (user == undefined) {
                  $scope.err = "That email is already taken."
               }
               loginService.createProfile(user.uid, user.email);
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
                  $location.path('/account');
               }
            });
         }
      };

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

               // Stick sidebar stuff.
               // $('#preview').waypoint('sticky');

               // $('#preview').waypoint(function (direction) {
               //    if (direction === 'down') {
               //       $('.stuck').css({'margin-left': $('.container').position().left + 760});
               //    } else {
               //       $('#preview').css({'margin-left': 0});
               //    }
               // })
            });
         });
      };
      // set initial binding
      $scope.syncAccount();
      

      $scope.sub = function() {
         var d = $scope.profile;
         if (d.name && d.lname && d.college && d.major && d.location) {
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
            p.skills = p.skills || {};
            var skill = p.skills[j.skill] || {jobs: []};
            skill.jobs.push(j);
            p.skills[j.skill] = skill;
            // $scope.job = {};
         } else {
            // Error
            $scope.badinjob = true;
         }
      }


      $scope.logout = function() {
         loginService.logout();
      };

      // $scope.oldpass = null;
      // $scope.newpass = null;
      // $scope.confirm = null;

      // $scope.reset = function() {
      //    $scope.err = null;
      //    $scope.msg = null;
      //    $scope.emailerr = null;
      //    $scope.emailmsg = null;
      // };

      // $scope.updatePassword = function() {
      //    $scope.reset();
      //    loginService.changePassword(buildPwdParms());
      // };

      // $scope.updateEmail = function() {
      //   $scope.reset();
      //   // disable bind to prevent junk data being left in firebase
      //   $scope.unBindAccount();
      //   changeEmailService(buildEmailParms());
      // };

      // function buildPwdParms() {
      //    return {
      //       email: $scope.auth.user.email,
      //       oldpass: $scope.oldpass,
      //       newpass: $scope.newpass,
      //       confirm: $scope.confirm,
      //       callback: function(err) {
      //          if( err ) {
      //             $scope.err = err;
      //          }
      //          else {
      //             $scope.oldpass = null;
      //             $scope.newpass = null;
      //             $scope.confirm = null;
      //             $scope.msg = 'Password updated!';
      //          }
      //       }
      //    };
      // }
      // function buildEmailParms() {
      //    return {
      //       newEmail: $scope.newemail,
      //       pass: $scope.pass,
      //       callback: function(err) {
      //          if( err ) {
      //             $scope.emailerr = err;
      //             // reinstate binding
      //             $scope.syncAccount();
      //          }
      //          else {
      //             // reinstate binding
      //             $scope.syncAccount();
      //             $scope.newemail = null;
      //             $scope.pass = null;
      //             $scope.emailmsg = 'Email updated!';
      //          }
      //       }
      //    };
      // }

   }]);