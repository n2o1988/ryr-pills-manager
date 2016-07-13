(function(angular) {

  angular.module('electron-app')
  .directive('scrollToElement', function scrollToElement() {
    return {
      restrict: 'A',
      link(scope, element, attrs) {
        const entryOffsets = 184;

        attrs.$observe('scrollToElement', (val) => {
          if (val) {
            const entry = document.getElementById(val);
            if (entry) {
              // check if visible

              // bottom
              const entryBoundingRect = entry.getBoundingClientRect();
              const containerScrollTop = element[0].scrollTop;
              const entryTop = entryBoundingRect.top + containerScrollTop - entryOffsets;
              const entryBottom = entryBoundingRect.bottom + containerScrollTop - entryOffsets;

              const containerTop = parseInt(element.css('max-height')) + containerScrollTop;
              let isVisible = entryBottom <= containerTop && entryTop >= containerScrollTop;


              if (!isVisible) {
                // auto scroll to fit it
                element[0].scrollTop = entryTop;
              }
            }
          }
        });
      }
    }
  });

})(global.angular);
