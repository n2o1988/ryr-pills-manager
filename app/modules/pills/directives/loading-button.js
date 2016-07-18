//<md-progress-circular class="md-primary" md-diameter="90"></md-progress-circular>
(function(angular) {

  angular.module('electron-app')
    .component('loadingButton', {
      template: `<md-progress-circular class="md-primary loading-button-loader" ng-show="$ctrl.loading"
                  md-diameter="{{$ctrl.diameter || 90}}"></md-progress-circular><ng-transclude ng-show="!$ctrl.loading"></ng-transclude>`,
      transclude: true,
      bindings: {
        loading: '=',
        diameter: '@'
      },
      controller($element) {
        this.$postLink = () => {
          const loader = $element[0].getElementsByClassName('loading-button-loader')[0];
          const button = $element[0].getElementsByClassName('md-button')[0];
          if (button && button.classList.contains('md-fab-bottom-right')) {
            const buttonStyle = window.getComputedStyle(button);
            loader.style.position = 'absolute';
            loader.style.top = buttonStyle.top;
            loader.style.left = buttonStyle.left;
            loader.style.bottom = buttonStyle.bottom;
            loader.style.right = buttonStyle.right;
          }
        }
      }
    });

})(global.angular);
