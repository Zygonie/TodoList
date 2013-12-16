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
	   .when('/todoList/details/:listId', {
		   controller: 'todoListCtrl',
		   templateUrl: '/todoList/details',
		   reloadOnSearch: false
	   })
	   .otherwise({redirectTo: '/todoList'});
	$locationProvider.html5Mode(true);
}]);

/*
 * Services
 */
todoListApp.factory('todoLists',['$resource', function($resource) {
	return $resource('/api/todoList/:Id',
			{ Id: '@Id' },
			{
				query:{
					method: 'GET', 
					isArray: true
					},
				create: {
				    	method: 'POST'
				    },
				update: {
				    	method: 'POST'
				    },    
				remove: {
				    	method: 'DELETE'
				    }
			});
}]);

/*
 * Services
 */
todoListApp.factory('tasks',['$resource', function($resource) {
	return $resource('/api/task/:Id',
			{ Id: '@Id' },
			{
				query:{
					method: 'GET', 
					isArray: true
					},
				create: {
				    	method: 'POST'
				    },
				update: {
				    	method: 'POST'
				    },    
				remove: {
				    	method: 'DELETE'
				    }
			});
}]);

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