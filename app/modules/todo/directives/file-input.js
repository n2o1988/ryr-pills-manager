/**
 * Created by ficheral on 26/05/2016.
 */
(function(angular) {
  'use strict';

  module.exports = {
    bindings: {
      model: '=',
      btnClass: '@',
      extensions: '@',
      onFileChange: '&'
    },
    transclude: true,
    templateUrl: './modules/todo/directives/file-input.html',
    controller($scope, $element) {
      $element[0].addEventListener('change', (evt) => {
        this.model = evt.target.files[0];
        this.fileName = this.model.name;
        this.onFileChange({ file: this.model });
        $scope.$apply();
      });
    }
  };
})(global.angular);
