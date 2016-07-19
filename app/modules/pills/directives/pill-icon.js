(function(angular) {

  angular.module('electron-app')
    .directive('pillIcon', function pillIcon(PillsDataService) {
      return {
        restrict: 'A',
        template: '<md-icon>{{icon}}</md-icon><ng-transclude></ng-transclude>',
        link(scope, element) {
          scope.icon = PillsDataService.iconValueToObject(element.attr('pill-icon')).materialVal;
        },
        transclude: true,
        scope: true
      }
    });

})(global.angular);
