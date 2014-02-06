'use strict';
/*
 * Définition du module d'application
 */

var todoListApp = angular.module('appTodoList', ['ngRoute', 'ngResource','ui.bootstrap','ngSanitize']);

/*
 * Config
 */
todoListApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
	$routeProvider
       .when('/todoList', {
		   controller: 'todoListCtrl',
		   templateUrl: '/todoList/home'
	   }) 
       .when('/todoList/home', {
		   controller: 'todoListCtrl',
		   templateUrl: '/todoList/home',
		   reloadOnSearch: false
	   })
       .when('/todoList/details', {
		   controller: 'todoListCtrl',
		   templateUrl: '/todoList/details',
		   reloadOnSearch: false
	   })
	   .otherwise({redirectTo: '/todoList'});
	$locationProvider.html5Mode(true);
}]);

/*
 * Service TodoList
 */
todoListApp.factory('ListService',['$resource', function($resource) {
	return $resource('/api/todoList/:Id', { Id: '@Id'}, {});
}]);

/*
 * Service Task
 */
todoListApp.factory('TaskService',['$resource', function($resource) {
	return $resource('/api/task/:Id', { Id: '@Id' }, {});
}]);

/*
 * Shared Service
 */
todoListApp.factory('sharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.data = {};

    return sharedService;
});

/*
 * Directive Datepicker
 */
todoListApp.directive('datepicker', function () {
    return {
        restrict: 'C',
        require: 'ngModel',
        link: function (scope, el, attr, ngModelCtrl) {
            $(function () {
                el.datepicker({
                    dateFormat: 'dd MM yy',
                    inline: true,
                    onSelect: function (dateText, inst) {
                        ngModelCtrl.$setViewValue(dateText);
                        scope.$apply();
                    }
                });
            });
        }
    };
});


/*
 * Directive ngBlur
 */
todoListApp.directive('ngBlur', function () {
    return function(scope, elem, attrs) {
        elem.bind('blur', function(){
            scope.$apply(attrs.ngBlur);
            })
        }
});

/*
 * Directive ngFocus
 */
todoListApp.directive('ngFocus', function ngFocus($timeout) {
        return function (scope, elem, attrs) {
                scope.$watch(attrs.ngFocus, function (newVal) {
                        if (newVal) {
                                $timeout(function () {
                                        elem[0].focus();
                                }, 0, false);
                        }
                });
        };
});

/*
 * Directive ngEscape
 */
todoListApp.directive('ngEscape', function () {
        var ESCAPE_KEY = 27;
        return function (scope, elem, attrs) {
                elem.bind('keydown', function (event) {
                        if (event.keyCode === ESCAPE_KEY) {
                                scope.$apply(attrs.ngEscape);
                        }
                });
        };
});