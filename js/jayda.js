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

      self.appendPattern(e.target.text);
      self.parseTemplate(e.target.text);
    });
  },

  appendPattern: function (file) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;

    $('.patterns-wrap').html(J.templatizer[file]({patternLibrary : true}));
  },

  parseTemplate: function(file) {
    var tmpl,
      mixinstring,
      mixinArray;

    tmpl = $.trim(J.templatizer[file].toString());
    mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
    mixinArray = mixinstring[0].split('buf.push(templatizer');
    mixinArray.splice(0,1);

    this.getMixinNames(mixinArray, file);

  },

  getMixinNames : function (mixinArray, file) {
    var name;

    for(var i = 0; i < mixinArray.length; i++) {
      name = mixinArray[i].split('["' + file + '"]["');
      name = name[1].split('"]');
      name = name[0];
      console.log(name);
    }
  },

  generateUsage: function () {

  }

};

$().ready(function () {
  J.init();
});
