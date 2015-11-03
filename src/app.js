(function() {
    'use strict';
    angular.module('app', [
        'app.core',
        'app.player',
        'app.quiz',
        'app.steps'
        //'app.ponyQuiz'
    ]);
})();

(function() {
    'use strict';
    angular.module('app.core', [
        'ngAnimate'
    ]);
})();



(function() {
    'use strict';
    angular.module('app.core', []);
})();

(function() {
    'use strict';
    angular.module('app.player', []);
})();

(function() {
    'use strict';
    angular.module('app.quiz', []);
})();

(function() {
    'use strict';
    angular.module('app.ponyQuiz', []);
})();


(function() {
    'use strict';
    angular.module('app.steps', []);
})();





(function(){
'use strict';

angular
    .module('app.quiz')
    .controller('QuizController', QuizController);

   
    QuizController.$inject = ['$scope','$timeout', '$http', '$location', '$anchorScroll', 'PlayerService'];
    
    function QuizController($scope, $timeout, $http, $location, $anchorScroll, PlayerService){
        
        var quiz = this;
        
        $scope.gotoBottom = function() {
          // set the location.hash to the id of
          // the element you wish to scroll to.
          $location.hash('bottom');

          // call $anchorScroll()
          $anchorScroll();
        };

        quiz.activeQuestion = -1;
        $scope.activeQuestion = -1;

        quiz.model = {};

        $scope.begin = function() {
            $scope.activeQuestion++;
        };

        $scope.nextStep = function() {
            $scope.activeQuestion++;
        };

        $scope.lastStep = function() {
            $scope.activeQuestion--;
        };

        
   

        var q =
        $http.get('api/quiz.json').then(function(quizData){
            quiz.questions = quizData.data;
            quiz.totalQuestions = quiz.questions.length;
        });


        $scope.questions = q;



        quiz.init = function () {
            quiz.started = false;
            quiz.over = false;
            quiz.step = 0;
            quiz.player = PlayerService.newPlayer('Ringo', 150);
            quiz.ponyName = "";
            quiz.questions = [];
            quiz.model = {};
            quiz.state = "Running quiz.init function";
            console.log("quiz Ran Init");
            $scope.activeQuestion = 0;
        };
 
        quiz.start = function () {
            console.log("game.start() was just called..");
            quiz.updateButtons(true, true, true);
            quiz.started = true;
            quiz.over = false;
            quiz.step = 0;
            quiz.question = quiz.questions[0];



        }

        quiz.begin = function() {
            console.log("game.begin() was just called...");
            return parseInt(quiz.activeQuestion) === 0;
            //tempQuestion = quiz.activeQuestion;
            //tempQuestion === 0;
            //quiz.activeQuestion = tempQuestion;


            console.log(quiz.activeQuestion);
        }

        quiz.animateQuestion = function () {

        }


        quiz.questionSteps = function() {
            quiz.started = true;
            quiz.over = false;
        }
 
        quiz.end = function () {
            quiz.started = true;
            quiz.over = true;
            
            quiz.updateButtons(true, false, true);
            
            quiz.state = "quiz is Over.  quiz.end() was called";
            console.log("quiz Over");
        };

        quiz.share = function() {
            quiz.started = true;
            quiz.over = true;
            quiz.ponyName = "Snowflake";

            quiz.updateButtons(true, false, true);

            quiz.state = "quiz is Over.  quiz.share() was called";
            console.log("Quiz Share function has just been called!");
        }
 
        quiz.reset = function () {
            quiz.player.resetScore();
            quiz.started = false;

            console.log("quiz Reset");
        };

        quiz.restart = function () {
            quiz.player.resetScore();
            quiz.started = false;
            quiz.over = false;
            quiz.init();
            console.log("Restarting...");
        };



        quiz.updateButtons = function(next, prev, restart) {
            quiz.buttonNextEnabled = next;
            quiz.buttonPrevtEnabled = prev;
            quiz.buttonRestartEnabled = restart;
        };




 
        quiz.init();
    }


})();

(function(){
    'use strict';

    angular
        .module('app.quiz')
        .directive('appQuiz', appQuiz);

    function appQuiz(){
        return {
            restrict: 'E',
            templateUrl: 'app/quiz/quiz.directive.html',
            controller: 'QuizController',
            controllerAs: 'quiz'
        }
    }
})();




(function(){
    'use strict';
 
    angular
        .module('app.player')
        .factory('PlayerService', PlayerService);
 
    function PlayerService(){
        var service = {
            newPlayer: newPlayer
        };
 
        /////////////
 
        function Player(playerName, initialScore) {
            this.score = initialScore;
            this.name = playerName;
        }
 
        Player.prototype.changeScore = function(amountToChange){
            if(!angular.isDefined(this.score)){
                this.score = 0;
            }
 
            this.score += amountToChange;
        };
 
        Player.prototype.resetScore = function () {
            this.score = 0;
        };
 
        function newPlayer(playerName, initialScore) {
            var player = new Player(playerName, initialScore);
            return player;
        }
 
        return service;
    }
})();


(function() {
    'use strict';

    angular
        .module('app.steps')
        .controller('StepsController', StepsController);

    StepsController.$inject = ['$scope', '$location'];

    /* @ngInject */
    function StepsController($scope, $location) {
        var vm = this;
        vm.title = 'StepsController';


        $http.get('api/quiz.json').then(function(quizData){
            quiz.questions = quizData.data;
            quiz.questions = quizData.data;
            quiz.totalQuestions = quiz.questions.length;
        });

        $scope.steps = quiz.questions;

         $scope.selection = $scope.steps[0];

         $scope.getCurrentStepIndex = function() {
             // Get the index of the current step given selection
             return _.indexOf($scope.steps, $scope.selection);
         };

         // Go to a defined step index
         $scope.goToStep = function(index) {
             if (!_.isUndefined($scope.steps[index])) {
                 $scope.selection = $scope.steps[index];
             }
         };

         $scope.hasNextStep = function() {
             var stepIndex = $scope.getCurrentStepIndex();
             var nextStep = stepIndex + 1;
             // Return true if there is a next step, false if not
             return !_.isUndefined($scope.steps[nextStep]);
         };

         $scope.hasPreviousStep = function() {
             var stepIndex = $scope.getCurrentStepIndex();
             var previousStep = stepIndex - 1;
             // Return true if there is a next step, false if not
             return !_.isUndefined($scope.steps[previousStep]);
         };

         $scope.incrementStep = function() {
             if ($scope.hasNextStep()) {
                 var stepIndex = $scope.getCurrentStepIndex();
                 var nextStep = stepIndex + 1;
                 $scope.selection = $scope.steps[nextStep];
             }
         };

         $scope.decrementStep = function() {
             if ($scope.hasPreviousStep()) {
                 var stepIndex = $scope.getCurrentStepIndex();
                 var previousStep = stepIndex - 1;
                 $scope.selection = $scope.steps[previousStep];
             }
         };


    }
})();
