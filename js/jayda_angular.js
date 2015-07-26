J.bootstrapAngularApp =function () {
  if (!J.config.angularModuleName) {
    console.error('You have defined that you are running an angular application but you have not defined a module name. Please add your module name to your package.json config.angularModuleName.');
    return;
  }
  angular.element('html').ready(function() {
    angular.bootstrap(document, [J.config.angularModuleName]);
  });
};