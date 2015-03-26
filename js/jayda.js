var J = {};

J = {
  patterns : {},
  templates : {},

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

      self.getPatterns(e.target.text);
    });
  },

  getPatterns: function (file) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;


    // $('.patterns-wrap').html(J.templatizer[file]({patternLibrary : true}));
    // var markup = J.templatizer[file]({patternLibrary : true});

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
    // mixinArray = mixinstring[0].split('buf.push(templatizer');
    mixinArray.splice(0,1);

    this.mixinCount = mixinArray.length;

    // this.getMixinComments(mixinstring[0]);
    // this.getMixin(mixinArray, file);

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

    console.log('patternsArr: ', patternsArr);

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
        tmpl,
        markup;

      title = '<h3>' + patternsArr[i].title + '</h3>';
      desc = '<p>' + patternsArr[i].description + '</p>';
      example = '<div class="example">' + patternsArr[i].example + '</div>';
      code = '<pre>' + patternsArr[i].code + '</pre>';

      tmpl = title + desc + example + code;

      markup += tmpl;

    }
    $('.patterns-wrap').html(markup);
  },

  getMixinComments: function(mixinstring) {
    var self = this,
      titleStrings,
      descStrings,
      title,
      titleID,
      desc,
      descID,
      examples = $('.patterns-wrap').children();

    titleStrings = mixinstring.match(/<!-- Title: (.*?)(?=-->")/g);
    descStrings = mixinstring.match(/<!-- Description: (.*?)(-->")/g);

    // TODO: make this smarter so you don't need descriptions for every mixin.
    // It would also be nice to have a fallback title in case you don't add one
    if(!titleStrings || titleStrings.length !== this.mixinCount) {
      console.log('WARNING: No title givin for mixin.');
      return false;
    } else if (!descStrings || descStrings.length !== this.mixinCount){
      console.log('WARNING: No description givin for mixin.');
      return false;
    }

    for (var i = 0; i < titleStrings.length; i++) {
      titleID = '<!-- Title: ';
      title = titleStrings[i].substring(titleStrings[i].indexOf(titleID) + titleID.length, titleStrings[i].lastIndexOf('-->'));

      descID = '<!-- Description: ';
      desc = descStrings[i].substring(descStrings[i].indexOf(descID) + descID.length, descStrings[i].lastIndexOf('-->'));

      (function (j) {
        self.generateComments(examples[j], title, desc);
      })(i);
    }
  },

  getMixin: function (mixinArray, file) {
    var self = this,
      patternArray,
      name,
      params,
      pseudoJson,
      examples = $('.patterns-wrap').children();

    for(var i = 0; i < mixinArray.length; i++) {
      patternArray = mixinArray[i].split('["' + file + '"]["');
      patternArray = patternArray[1].split('"]');
      name = patternArray[0];

      // Format Parameters
      pseudoJson = patternArray[1].substring(patternArray[1].indexOf('(') + 1, patternArray[1].lastIndexOf('));'));
      params = JSON.stringify(eval(pseudoJson), null, 2);

      (function (j) {
        self.generateUsage(examples[j], name, params);
      })(i);
    }
  },

  generateComments: function (example, title, desc) {
    var header;

    header = '<h3>' + title + '</h3>';
    desc = '<p>' + desc + '</p>';

    $(example).before(header);
    $(example).before(desc);
  },

  generateUsage: function (example, name, params) {
    var mixin;

    mixin = '<pre>+' + name + '(' + params + ')' + '</pre>';
    $(example).after(mixin);
  }

};

$().ready(function () {
  J.init();
});
