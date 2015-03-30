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
      url: "../data/tree.json"
    }).done(function(res) {
      self.appendSideNav(res);
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

      self.getPatterns(e.target.text);
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
    var patternsArr = [];

    var mixinArray = this.parseTemplate(tmpl);

    for (var i = 0; i < mixinArray.length; i++) {
      var descID = '<!-- Description: ';
        codeArr = [];

      var patternObj = {};

      // patternObj.title = '';
      // patternObj.mixinName = '';
      // patternObj.description = '';
      // patternObj.example = '';
      // patternObj.params = [];
      // patternObj.customArgs = '';

      patternObj.title = this.getTitle(mixinArray[i]);

      patternObj.description = this.getDescription(mixinArray[i]);

      patternObj.mixinName = this.getMixinName(mixinArray[i], file);

      var codeArr = mixinArray[i].split('["' + file + '"]["');
      codeArr = codeArr[1].split('"]');
      // patternObj.mixinName = codeArr[0];


      // Format Parameters
      var pseudoJson = codeArr[1].substring(codeArr[1].indexOf('(') + 1, codeArr[1].lastIndexOf('));'));

      // TODO: Make this more flexible
      // Needs to take multiple parameters that could be arrays or objects
      if(pseudoJson[0] === "[") {
        // This works with arrays
        patternObj.example = J.templatizer[file][patternObj.mixinName](eval(pseudoJson));
        patternObj.customArgs = JSON.stringify(eval(pseudoJson), null, 2);
      } else {
        // This works with multiple params
        patternObj.params = $.splitAttrString(pseudoJson);
        patternObj.example = J.templatizer[file][patternObj.mixinName].apply(this, patternObj.params);
        patternObj.customArgs = pseudoJson;
      }

      patternsArr.push(patternObj);
    }

    this.renderPatternsTmpl(patternsArr);
  },

  getTitle: function (str) {
    return str.split('-->')[0].trim() || '';
  },

  getDescription: function (str) {
    var descID = '<!-- Description: ';
    return str.substring(str.indexOf(descID) + descID.length, str.lastIndexOf('-->'));
  },

  getMixinName: function (str, file) {
      var codeArr = str.split('["' + file + '"]["');
      codeArr = codeArr[1].split('"]');
      return codeArr[0];
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
