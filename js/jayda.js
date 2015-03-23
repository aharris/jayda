var J = {};

J = {
  init: function () {
    // Persistant vars
    this.$parent = $('.patterns-wrap');
    this.currentPattern = '';

    // Intiial function calls
    this.getTree();
  },

  getTree: function () {
    var self = this;
    $.ajax({
      url: "../data/tree.json"
    }).done(function(res) {
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
    // console.log('patterns: ', patterns);

    this.appendSideNav(groups, patterns);

  },

  appendSideNav: function (groups, patterns){
    $('.side-nav-wrap').append(J.templatizer["side-nav"]({jayda : true, groups: groups, patterns: patterns}));

    this.bindNav();
  },

  bindNav: function () {
    var self = this;
    $('.side-nav-wrap a').click(function (e) {
      e.preventDefault();

      self.appendPatterns(e.target.text);
    });
  },

  appendPatterns: function (file) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;

    $('.patterns-wrap').html(J.templatizer[file]({patternLibrary : true}));

    this.parseTemplate(file);

  },

  parseTemplate: function(file) {
    var tmpl,
      mixinstring,
      mixinArray;

    tmpl = $.trim(J.templatizer[file].toString());
    tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
    mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
    mixinArray = mixinstring[0].split('buf.push(templatizer');
    mixinArray.splice(0,1);

    this.getMixinNames(mixinArray, file);

  },

  getMixinNames : function (mixinArray, file) {
    var self = this,
      patternArray,
      name,
      params,
      examples = $('.patterns-wrap').children();

    for(var i = 0; i < mixinArray.length; i++) {
      patternArray = mixinArray[i].split('["' + file + '"]["');
      patternArray = patternArray[1].split('"]');
      name = patternArray[0];
      params = patternArray[1];

      (function (j) {
        self.generateUsage(examples[j], name, params);
      })(i);
    }
  },

  generateUsage: function (example, name, params) {
    var mixin;

    mixin = '+' + name + params;
    $(example).after(mixin);
  }

};

$().ready(function () {
  J.init();
});
