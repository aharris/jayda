var J = {};

J = {
  init: function () {
    // Persistant elements
    this.$parent = $('.patterns-wrap');

    // Intiial function calls
    this.getTree();
    this.getPattern();
  },

  getTree: function () {
    var self = this;
    $.ajax({
      url: "../data/tree.json"
    }).done(function(res) {
      self.generateNav(res);
    });
  },

  generateNav: function (res) {
    debugger;
    console.log(res);
  },

  getPattern: function () {
    var self = this;
    $.ajax({
      url: "../patterns/atoms/colors.jade"
    }).done(function(res) {
      self.compilePattern(res);
    });
  },

  compilePattern: function (res) {
    var fn = jade.compile(res);
    var htmlOutput = fn({
      foo: 'filler text'
    });

    this.appendPattern(htmlOutput);
  },

  appendPattern: function (htmlOutput) {
    this.$parent.append(htmlOutput);
  },

  createMixin: function() {
    var $parent = $('.patterns-wrap'),
      mixin = '+right-nav()';

    $parent.append(mixin);

  }
};

$().ready(function () {
  J.init();
});
