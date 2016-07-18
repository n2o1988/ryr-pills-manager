(function(angular) {

  angular.module('electron-app')
  .directive('scrollToElement', function scrollToElement() {
    return {
      restrict: 'A',
      link(scope, element, attrs) {
        const tolerance = attrs.scrollTolerance ? parseInt(attrs.scrollTolerance) || 0 : 0;

        attrs.$observe('scrollToElement', (val) => {
          if (val) {
            const entry = document.getElementById(val);
            if (entry) {
              // check if visible

              const entryBoundingRect = entry.getBoundingClientRect();
              const containerBoundingRect = element[0].getBoundingClientRect();
              const isTooHigh = entryBoundingRect.top + tolerance <= containerBoundingRect.top;
              const isTooLow = entryBoundingRect.bottom - tolerance >= containerBoundingRect.bottom;

              let isVisible = !(isTooHigh || isTooLow);

              if (!isVisible) {
                if (isTooLow) {
                  element[0].scrollTop += entryBoundingRect.bottom - containerBoundingRect.bottom;
                } else {
                  element[0].scrollTop += entryBoundingRect.top - containerBoundingRect.top;
                }
              }
            }
          }
        });
      }
    }
  });

})(global.angular);
