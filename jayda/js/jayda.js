var J = {};

J = {

  Jayda: {},

  init: function () {
    // Persistant vars
    this.$parent = $('.jayda-patterns-wrap');
    this.currentPattern = '';

    // Initial function calls
    this.getTree();
  },

  // --------------------------------
  // Routing ------------------------
  // --------------------------------

  getCurrentRoute: function (res) {
    this.getPatterns(window.location.hash.split('#')[1], res);
  },

  // --------------------------------
  // JAYDA CORE ---------------------
  // --------------------------------

  bindCoreNav: function () {
    var self = this;
    $('.jayda-side-nav-core a').click(function (e) {
      var file = e.target.hash.split('#')[1];

      self.renderCoreTemplate(file);
    });
  },

  loadOverview: function () {
    var overview = J.Jayda.templatizer._overview();
    this.$parent.html(overview);
  },

  renderCoreTemplate: function (file) {
    var tmpl = J.Jayda.templatizer.core["_" + file]();
    this.$parent.html(tmpl);

    Prism.highlightAll();
  },

  // --------------------------------
  // MAIN APP -----------------------
  // --------------------------------
  getTree: function () {
    var self = this;
    $.ajax({
      url: "data/tree.json"
    }).done(function(res) {
      self.appendSideNav(res);
      if (window.location.hash) {
        self.getCurrentRoute(res);
      } else {
        self.loadOverview();
      }
    });
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

  parseJade: function (res) {
    var sections = _.toArray(res.components),
      groups = _.keys(res.components),
      patterns = [],
      files = [];

    for(var i = 0; i < sections.length; i++) {
      files = _.toArray( _.filter(sections[i], function (it) {
        return it.indexOf(".jade") >= 0;
      }));
      patterns[i] = [];

      for(var j = 0; j < files.length; j++) {
        var splitExtension = files[j].split('.'),
          splitRoute = splitExtension[0].split('/'),
          file = splitRoute[splitRoute.length -1],
          name = this.toTitleCase(file);

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

  parseScripts: function (res) {
    var sections = _.toArray(res.components),
      groups = _.keys(res.components),
      scripts = [],
      files = [];

    for(var i = 0; i < sections.length; i++) {
      files = _.toArray( _.filter(sections[i], function (it) {
        return it.indexOf(".js") >= 0;
      }));
      scripts[i] = [];

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

        scripts[i].push(patternObj);
      }
    }
    return scripts;
  },

  stringifyScripts:  function (res) {
    var dfd = jQuery.Deferred();

    var scripts = this.parseScripts(res);
    var scriptsArr = [];

    function getStrings() {
      var requests = [];

      for (var i = 0; i < scripts.length; i++) {

        var scriptRoute = '';
        var promise;
        var file = '';

        if (scripts[i][0]) {
          scriptRoute = scripts[i][0].route
          file = scripts[i][0].file;

          promise = $.ajax({
            url: '../' + scriptRoute,
            async: false
          }).done(function(res) {
            var scriptObj = {};
            scriptObj.string = res;
            scriptObj.file = file;
            // console.log("file:", scriptObj.file);
            scriptsArr.push(scriptObj);
            return res;
          });
        } else {
          var scriptObj = {};
          scriptObj.string = '';
          scriptObj.file = '';

          scriptsArr.push(scriptObj);
          promise = '';
        }

        requests.push(promise);
      }

      return $.when.apply($, requests);
    }

    getStrings().done(function (requests) {
      // console.log( "scriptsArr: ", scriptsArr );
      dfd.resolve( scriptsArr );
      return requests;
    });

    return dfd.promise();

  },

  appendSideNav: function (res){
    var patterns = this.parseJade(res);
    $('.jayda-side-nav-wrap').append(J.Jayda.templatizer["side-nav"]["side-nav"]({jayda : true, patterns: patterns}));

    this.bindNav(res);
    this.bindCoreNav();
    this.bindNavButton();
    this.bindOverlay();
  },

  bindNav: function (res) {
    var self = this;
    $('.jayda-side-nav-components a').click(function (e) {
      var file = e.target.hash.split('#')[1];

      self.getPatterns(file, res);
    });
  },

  bindNavButton: function () {
    $('.jayda-nav-button').click(function(){
      $('.jayda-nav-button').toggleClass( 'jayda-expanded' );
      $( '.jayda-side-nav-wrap' ).toggleClass( 'jayda-expanded' );
      $( '.jayda-overlay' ).fadeToggle();
    });
  },

  bindOverlay: function () {
    $( '.jayda-overlay' ).click(function () {
      $('.jayda-nav-button' ).toggleClass( 'jayda-expanded' );
      $( '.jayda-side-nav-wrap' ).toggleClass( 'jayda-expanded' );
      $( '.jayda-overlay' ).fadeToggle();
    });
  },

  getPatterns: function (file, res) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}

    if (!J.templatizer[file]) {
      return this.renderCoreTemplate(file);
    }

    this.currentPattern = file;

    var tmpl = $.trim(J.templatizer[file].toString());

    this.createObj(tmpl, file, res);
  },

  toSingleLine: function (string) {
    return string.replace(/\s+/g, ' ');
  },

  getMixins: function(tmpl) {
    var mixinstring,
      mixinArray,
      caption;

    tmpl = this.toSingleLine(tmpl);
    tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
    mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
    mixinArray = mixinstring[0].split('<!-- Title:');
    mixinArray.splice(0,1);

    return mixinArray;
  },

  createObj: function (tmpl, file, res) {
    var self = this;
    var patternsArr = [],
      mixinArray = this.getMixins(tmpl),
      caption = this.getCaption(tmpl);

    $.when( this.stringifyScripts(res) ).then(
      function( scripts ) {
        for (var i = 0; i < mixinArray.length; i++) {
          var patternObj = {};

          patternObj.title = self.getTitle(mixinArray[i]);
          patternObj.description = self.parseComments(mixinArray[i], '<!-- Description:');
          patternObj.mixinName = self.getMixinName(mixinArray[i], file);
          patternObj.example = self.getExample(mixinArray[i], file, patternObj.mixinName);
          patternObj.customArgs = self.getCustomArgs(mixinArray[i], file);
          patternObj.script = _.filter(scripts, function (it) {
            return it.file === file;
          })
          patternObj.hideScript = self.hideScript(mixinArray[i]);

          patternsArr.push(patternObj);
        }

        self.renderPatternsTmpl(patternsArr, caption, file);
      }
    );
  },

  parseComments: function (str, match) {
    if (!str.split(match)[1] || !str.split(match)[1].split('-->')[0]) {
      return '';
    }

    return str.split(match)[1].split('-->')[0].trim();
  },

  getTitle: function (str) {
    return str.split('-->')[0].trim() || '';
  },

  hideScript: function (val) {
    if (val.split('<!-- hideScript:')[1] && val.split('<!-- hideScript:')[1].split('-->')[0]) {
      return !!val.split('<!-- hideScript:')[1].split('-->')[0].trim();
    }
    return false;
  },

  getCaption: function (tmpl) {
    if (tmpl.split('<!-- Caption:')[1] && tmpl.split('<!-- Caption:')[1].split('-->')[0]) {
      return tmpl.split('<!-- Caption:')[1].split('-->')[0].trim();
    }
    return '';
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

    string = str.replace((/(\w+)(:)\s*(?='|"|[0-9+\-.]+|true|false|\[|{)/gi), "\"$1\"$2");

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

  renderPatternsTmpl: function (patternsArr, caption, file) {
    var markup = '',
      sectionTitle = this.toTitleCase(file);

    for (var i = 0; i < patternsArr.length; i++) {

      var title = patternsArr[i].title,
        desc = patternsArr[i].description,
        example = patternsArr[i].example,
        mixinName = patternsArr[i].mixinName,
        customArgs = patternsArr[i].customArgs,
        script = null;

      if (patternsArr[i].script[0] && !patternsArr[i].hideScript) {
        script = patternsArr[i].script[0].string.trim();
      }

      markup += J.Jayda.templatizer["_patterns"]["pattern"](title, desc, example, mixinName, customArgs, script);

    }

    captionTmpl = J.Jayda.templatizer["_pattern_header"]({title: sectionTitle, caption: caption});

    this.$parent.html(captionTmpl);
    this.$parent.append(markup);

    Prism.highlightAll();

  }

};

$().ready(function () {
  J.init();
});
