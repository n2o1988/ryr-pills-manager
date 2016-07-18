(function(angular) {
//TODO: remove if unused
  angular.module('electron-app')
  .directive('fullHeight', function fullHeight($window, $timeout) {
    return {
      restrict: 'A',
      link(scope, element, attrs) {
         //main-toolbar
        let timer;
        const debouncedOnResize = () => {
          $timeout.cancel(timer);
          timer = $timeout(onResize, 200, false);
        };
        const offset = attrs.fullHeightOffset ? parseInt(attrs.fullHeightOffset) || 0 : 0;

        const onResize = () => {
          const top = element[0].getBoundingClientRect().top;
          const height = window.innerHeight - top - offset;
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
