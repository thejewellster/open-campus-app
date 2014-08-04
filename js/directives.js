'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('profile', [function () {
    return {
      controller: ['$scope', '$modal', 'syncData', '$rootScope', function ($scope, $modal, syncData, $rootScope) {
        $scope.shown = '';

      $scope.syncAccount = function() {
         $scope.user = {};
         syncData(['users', $rootScope.auth.user.uid]).$bind($scope, 'user').then(function(unBind) {
            $scope.unBindAccount = unBind;
         });
      };

      $scope.syncAccount();

        $scope.remove = function (job, skill) {
          $scope.profile.skills[skill].jobs.splice(job, 1);

          if ($scope.profile.skills[skill].jobs.length === 0) {
            delete $scope.profile.skills[skill];
          }
        }

        $scope.edit = function (job, skill) {
          $scope.editing = $scope.profile.skills[skill].jobs[job];
          $scope.editing.editing = true;
        }

        $scope.show = function (toShow) {
          $scope.shown = toShow;
        }

         $scope.tap = function (profile) {
         if (!$scope.d) {
         var modalInstance = $modal.open({
            templateUrl: $scope.user.hasPost? 'partials/tapmodal.html' : 'partials/taperror.html',
            controller: ModalInstanceCtrl,
            resolve: {
              profile: function () {
                return $scope.profile;
              },
              job: function () {
                return {}
              }
            }
          }); 
         }
        }
      }],
      restrict: 'E',
      templateUrl: 'partials/profile.html',
      replace: true,
      scope: {
        profile: '=',
        d: '=',
        editing: "=",
        uid: '='
      }
    };
  }])
  .directive('job', [function () {
    return {
      controller: ['$scope', '$modal', function ($scope, $modal) {
        $scope.approve = function () {
          $scope.data.status = 1;
        }
        $scope.reject = function () {
          $scope.data.status = -1;
        }

        $scope.apply = function () {
          var modalInstance = $modal.open({
            templateUrl: 'partials/applymodal.html',
            controller: ModalInstanceCtrl,
            resolve: {
              profile: function () {
                return $scope.profile;
              },
              job: function () {
                return $scope.data;
              }
            }
          }); 
        }
      }],
      restrict: 'E',
      templateUrl: 'partials/job-post.html',
      replace: true,
      scope: {
        data: '=',
        admin: '=',
        profile: '='
      }
    };
  }]);


var ModalInstanceCtrl = function ($scope, $modalInstance, profile, job) {

  $scope.profile = profile;

  $scope.email = {};

  $scope.send = function() {
     var e = $scope.email;
     if (e.name && e.title && e.website && e.job && e.message && e.contact) {
        var body = "<h2>[name] at [company] has tapped you for this job: [job].</h2><br>They left you a message: “[message]”<br> Check out their job and send them a message back if you are interested in applying to their job. Below is their contact information:<br> [contact] <br> Make sure to read over our #thewaywework for tips of working as a Student Professional"

        body = body.replace('[name]', e.name);
        body = body.replace('[company]', e.website);
        body = body.replace('[job]', e.job);
        body = body.replace('[message]', e.message);
        body = body.replace('[contact]', e.contact);


        $.ajax({
          type: "POST",
          url: "https://mandrillapp.com/api/1.0/messages/send.json",
          data: {
            // If you need to swap the API Key replace this
            'key': 'JW-lzYTrFJZ78CnQHBm5Ww',
            'message': {
              'from_email': "noreply@opencampusjobs.com",
              "from_name": "Open Campus TAP",
              'to': [
                  {
                    'email': profile.email,
                    'type': 'to'
                  }
                ],
              'autotext': 'true',
              'subject': 'You have been tapped for an Open Campus job',
              'html': body
            }
          }
         }).done(function(response) {
           console.log(response); // if you're into that sorta thing
         });
         $scope.$parent.sent = true;
         $modalInstance.close();
     } else {
     }
  };

  $scope.apply = function() {
     var e = $scope.email;
     if (e.message) {
        var body = "<h2>New Application for your job posting!</h2><br>[name] applied for your job.<br>“[message]”<br>You can reach them at [contact].<br><a href='http://opencampusjobs.com/app.html#/view/[from]'><img src='[headshot]'></a>"
        
        body = body.replace('[message]', e.message);
        body = body.replace('[name]', e.name);
        body = body.replace('[contact]', e.contact);
        body = body.replace('[from]', $scope.profile.email.split('.').join('|dot|'));
        body = body.replace('[headshot]', 'http://graph.facebook.com/[id]/picture?type=large'.replace('[id]', $scope.profile.id));


        $.ajax({
          type: "POST",
          url: "https://mandrillapp.com/api/1.0/messages/send.json",
          data: {
            // If you need to swap the API Key replace this
            'key': 'JW-lzYTrFJZ78CnQHBm5Ww',
            'message': {
              'from_email': "noreply@opencampusjobs.com",
              "from_name": "Open Campus Job Application",
              'to': [
                  {
                    'email': job.email,
                    'type': 'to'
                  }
                ],
              'autotext': 'true',
              'subject': 'You have received an application for an Open Campus job',
              'html': body
            }
          }
         }).done(function(response) {
           console.log(response); // if you're into that sorta thing
         });
         $scope.$parent.sent = true;
         $modalInstance.close();
     } else {
     }
  };

  $scope.close = function () {
    $modalInstance.close();
  }
};