'use strict';
/*
 * Définition du module d'application
 */

var mariageApp = angular.module('appListMariage', ['ngResource','ui.bootstrap','ngSanitize']);

mariageApp.factory('mariageEntries',['$resource', function($resource) {
	return $resource('/api/listeMariage/:Id',
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
mariageApp.directive('datepicker', function () {
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