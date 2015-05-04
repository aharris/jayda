var APP = window.APP || {};

APP = {
  init: function () {
    console.log('foo');
  }

};

$().ready(function () {
  APP.init();
});
