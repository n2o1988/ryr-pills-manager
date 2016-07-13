(function(angular) {

  angular.module('electron-app')
  .directive('fullHeight', function fullHeight($window, $timeout) {
    return {
      restrict: 'A',
      link(scope, element) {
         //main-toolbar
        let timer;
        const debouncedOnResize = () => {
          $timeout.cancel(timer);
          timer = $timeout(onResize, 200, false);
        };

        const onResize = () => {
          const top = element[0].getBoundingClientRect().top;
          const height = window.innerHeight - top - 50;
          element.css('max-height', `${height}px`);
        };

        onResize();

        $window.addEventListener('resize', debouncedOnResize, false);

        scope.$on('$destroy', () => {
          $window.removeEventListener('resize', debouncedOnResize, false);
        });
      }
    }
  });

})(global.angular);
