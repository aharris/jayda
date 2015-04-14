var APP = {};

APP = {
  init: function () {
    // Show sideNav
    // $(".button-collapse").sideNav();
    $('.button-collapse').sideNav();

    // $('.button-collapse').click(function () {
    //   $('.button-collapse').fn.sideNav('show');
    // });
  }
};

$().ready(function () {
  APP.init();
});
