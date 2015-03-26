var J = {};

J = {

  init: function () {
    // Persistant vars
    this.$parent = $('.patterns-wrap');
    this.currentPattern = '';
    this.mixinCount = 0;
    this.patterns = window.patterns || {};
    this.templates = {};

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

    this.appendSideNav(patterns);
  },

  appendSideNav: function (patterns){
    $('.side-nav-wrap').append(J.templatizer["side-nav"]({jayda : true, patterns: patterns}));

    this.bindNav();
  },

  bindNav: function () {
    var self = this;
    $('.side-nav-wrap a').click(function (e) {
      e.preventDefault();

      self.getPatterns(e.target.text);
    });
  },

  getPatterns: function (file) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;

    this.parseTemplate(file);

  },

  parseTemplate: function(file) {
    var tmpl,
      mixinstring,
      mixinArray;

    tmpl = $.trim(J.templatizer[file].toString());
    tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
    mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
    mixinArray = mixinstring[0].split('<!-- Title:');
    mixinArray.splice(0,1);

    this.mixinCount = mixinArray.length;

    this.createObj(mixinArray, file);

  },

  createObj: function (mixinArray, file) {
    var patternsArr = [];

    for (var i = 0; i < mixinArray.length; i++) {
      var descID = '<!-- Description: ';
        codeArr = [];

      var patternObj = {};

      patternObj.title = '';
      patternObj.mixinName = '';
      patternObj.description = '';
      patternObj.example = '';
      patternObj.code = '';

      patternObj.title = mixinArray[i].split('-->')[0].trim();

      patternObj.description = mixinArray[i].substring(mixinArray[i].indexOf(descID) + descID.length, mixinArray[i].lastIndexOf('-->'));

      var codeArr = mixinArray[i].split('["' + file + '"]["');
      codeArr = codeArr[1].split('"]');
      patternObj.mixinName = codeArr[0];

      // Format Parameters
      var pseudoJson = codeArr[1].substring(codeArr[1].indexOf('(') + 1, codeArr[1].lastIndexOf('));'));
      patternObj.code = JSON.stringify(eval(pseudoJson), null, 2);

      patternObj.example = J.templatizer[file][patternObj.mixinName](eval(pseudoJson));


      patternsArr.push(patternObj);
    }

    this.renderPatternsTmpl(patternsArr);

  },

  renderPatternsTmpl: function (patternsArr) {
    var markup = '';
    for (var i = 0; i < patternsArr.length; i++) {
      // TODO: Make into a jade template
      var title,
        desc,
        example,
        code,
        mixinName,
        tmpl;

      title = '<h3>' + patternsArr[i].title + '</h3>';
      desc = '<p>' + patternsArr[i].description + '</p>';
      example = '<div class="example">' + patternsArr[i].example + '</div>';
      mixinName = patternsArr[i].mixinName;
      code = '<pre>' + '+' + mixinName + '(' + patternsArr[i].code + ')' + '</pre>';

      tmpl = title + desc + example + code;

      markup += tmpl;

    }
    $('.patterns-wrap').html(markup);
  }

};

$().ready(function () {
  J.init();
});
