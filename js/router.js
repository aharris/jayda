J.router = function () {
  var routes = {
    'overview': this.loadOverview,
    ':route': this.getPatterns
  };

  var router = Router(routes);

  router.init();
};
