var J = {};

J = {

  init: function () {
    // Persistant vars
    this.$parent = $('.patterns-wrap');
    this.currentPattern = '';
    this.patterns = window.patterns || {};
    this.templates = {};

    // Intiial function calls
    this.getTree();
  },

  getTree: function () {
    var self = this;
    $.ajax({
      url: "data/tree.json"
    }).done(function(res) {
      self.appendSideNav(res);
      if (window.location.hash) {
        self.getCurrentRoute();
      }
    });
  },

  getCurrentRoute: function () {
    this.getPatterns(window.location.hash.split('#')[1]);
  },

  updateRoute: function (route) {
    window.location.hash = route;
  },

  capitalizeFirstLetter: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  toTitleCase: function (str) {
    var words = str.split("-"),
      wordsArr = [];

    for (var i = 0; i < words.length; i++) {
      var word = this.capitalizeFirstLetter(words[i]);

      wordsArr.push(word);
    }

    var title = wordsArr.join(" ");

    return title;
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
          file = splitRoute[splitRoute.length -1],
          name = splitRoute[splitRoute.length -1];

        name = this.toTitleCase(name);

        var patternObj = {
          group: groups[i],
          route: files[j],
          name: name,
          file: file
        };

        patterns[i].push(patternObj);
      }
    }

    return patterns;
  },

  appendSideNav: function (res){
    var patterns = this.parseTree(res);
    $('.side-nav-wrap').append(J.templatizer["side-nav"]({jayda : true, patterns: patterns}));

    this.bindNav();
  },

  bindNav: function () {
    var self = this;
    $('.side-nav-wrap a').click(function (e) {
      e.preventDefault();

      var file = e.target.hash.split('#')[1];

      self.updateRoute(file);
      self.getPatterns(file);
    });
  },

  getPatterns: function (file) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;

    var tmpl = $.trim(J.templatizer[file].toString());

    this.createObj(tmpl, file);
  },

  toSingleLine: function (string) {
    return string.replace(/\s+/g, ' ');
  },

  parseTemplate: function(tmpl) {
    var mixinstring,
      mixinArray;

    tmpl = this.toSingleLine(tmpl);

    tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
    mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
    mixinArray = mixinstring[0].split('<!-- Title:');
    mixinArray.splice(0,1);

    return mixinArray;
  },

  createObj: function (tmpl, file) {
    var patternsArr = [],
      mixinArray = this.parseTemplate(tmpl);

    for (var i = 0; i < mixinArray.length; i++) {
      var patternObj = {};

      patternObj.title = this.getTitle(mixinArray[i]);
      patternObj.description = this.getDescription(mixinArray[i]);
      patternObj.mixinName = this.getMixinName(mixinArray[i], file);
      patternObj.example = this.getExample(mixinArray[i], file, patternObj.mixinName);
      patternObj.customArgs = this.getCustomArgs(mixinArray[i], file);

      patternsArr.push(patternObj);
    }

    this.renderPatternsTmpl(patternsArr);
  },

  getTitle: function (str) {
    return str.split('-->')[0].trim() || '';
  },

  getDescription: function (str) {
    var descID = '<!-- Description: ';
    return str.substring(str.indexOf(descID) + descID.length, str.lastIndexOf('-->')) || '';
  },

  getMixinName: function (str, file) {
      var codeArr = str.split('["' + file + '"]["');
      codeArr = codeArr[1].split('"]');
      return codeArr[0] || '';
  },

  getExample: function(str, file, mixinName) {
    var codeArr,
      pseudoJson;

    codeArr = str.split('["' + file + '"]["');
    codeArr = codeArr[1].split('"]');

    pseudoJson = codeArr[1].substring(codeArr[1].indexOf('(') + 1, codeArr[1].lastIndexOf('));'));

    return J.templatizer[file][mixinName].apply(this, this.getValidJSON(pseudoJson));
  },

  getValidJSON: function (str) {
    var string;

    string = str.replace((/([\w]+)(:)/g), "\"$1\"$2");

    string = '[' + string + ']';
    string = JSON.parse(string) || string;

    return string;
  },

  getCustomArgs: function(str, file) {
    var codeArr,
      pseudoJson,
      snippet;

    codeArr = str.split('["' + file + '"]["');
    codeArr = codeArr[1].split('"]');

    pseudoJson = codeArr[1].substring(codeArr[1].indexOf('(') + 1, codeArr[1].lastIndexOf('));'));

    snippet = JSON.stringify(this.getValidJSON(pseudoJson), null, 2);

    snippet = snippet.substring(snippet.indexOf('[') + 1, snippet.lastIndexOf(']'));

    return snippet;
  },

  renderPatternsTmpl: function (patternsArr) {
    var markup = '';

    for (var i = 0; i < patternsArr.length; i++) {
      // TODO: Make into a jade template
      var title,
        desc,
        mixinName,
        example,
        code,
        tmpl;

      title = '<h3>' + patternsArr[i].title + '</h3>';
      desc = '<p>' + patternsArr[i].description + '</p>';
      example = '<div class="example">' + patternsArr[i].example + '</div>';
      mixinName = patternsArr[i].mixinName;
      code = '<pre>' + '+' + mixinName + '(' + patternsArr[i].customArgs + ')' + '</pre>';

      tmpl = title + desc + example + code;

      markup += tmpl;

    }
    $('.patterns-wrap').html(markup);
  }

};

$().ready(function () {
  J.init();
});
