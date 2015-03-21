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
      // console.log(res);
      self.parseTree(res);
    });
  },

  parseTree: function (res) {
    var sections = _.toArray(res.patterns),
      groups = _.keys(res.patterns),
      patterns = [],
      files = [];

    for(var i = 0; i < sections.length; i++) {
      files = _.toArray(sections[i]);
      patterns[i] = [];

      for(var j = 0; j < files.length; j++) {
        var splitExtension = files[j].split('.'),
          splitRoute = splitExtension[0].split('/'),
          name = splitRoute[splitRoute.length -1];

        var patternObj = {
          group: groups[i],
          route: files[j],
          name: name
        };

        patterns[i].push(patternObj);
      }
    }
    console.log('patterns: ', patterns);

    this.appendSideNav(groups, patterns);

  },

  appendSideNav: function (groups, patterns){
    $('.side-nav-wrap').append(J.templatizer["side-nav"]({jayda : true, groups: groups, patterns: patterns}));
  },

  // generateNav: function () {
  //   var input = 'myfile.png';
  //   var output = input.substr(0, input.lastIndexOf('.')) || input;
  // },

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
