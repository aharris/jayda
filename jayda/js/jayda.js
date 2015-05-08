var J = {};

J = {

  Jayda: {},

  init: function () {
    // Persistant vars
    this.$parent = $('.patterns-wrap');
    this.currentPattern = '';

    // Initial function calls
    this.getTree();
  },

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

  loadOverview: function () {
    var overview = J.Jayda.templatizer._overview();
    this.$parent.html(overview);
  },

  getCurrentRoute: function (res) {
    this.getPatterns(window.location.hash.split('#')[1], res);
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
    $('.side-nav-wrap').append(J.templatizer["side-nav"]({jayda : true, patterns: patterns}));

    this.bindNav(res);
  },

  bindNav: function (res) {
    var self = this;
    $('.side-nav-wrap a').click(function (e) {
      e.preventDefault();

      var file = e.target.hash.split('#')[1];

      self.updateRoute(file);
      self.getPatterns(file, res);
    });
  },

  getPatterns: function (file, res) {
    // Prevent pattern duplication
    if (this.currentPattern === file) {return false;}
    this.currentPattern = file;

    var tmpl = $.trim(J.templatizer[file].toString());

    this.createObj(tmpl, file, res);
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

  createObj: function (tmpl, file, res) {
    var self = this;
    var patternsArr = [],
      mixinArray = this.parseTemplate(tmpl);

    $.when( this.stringifyScripts(res) ).then(
      function( scripts ) {
        for (var i = 0; i < mixinArray.length; i++) {
          var patternObj = {};

          patternObj.title = self.getTitle(mixinArray[i]);
          patternObj.description = self.getDescription(mixinArray[i]);
          patternObj.mixinName = self.getMixinName(mixinArray[i], file);
          patternObj.example = self.getExample(mixinArray[i], file, patternObj.mixinName);
          patternObj.customArgs = self.getCustomArgs(mixinArray[i], file);
          patternObj.script = _.filter(scripts, function (it) {
            return it.file === file;
          })

          patternsArr.push(patternObj);
        }

        self.renderPatternsTmpl(patternsArr);
      }
    );
  },

  getTitle: function (str) {
    return str.split('-->')[0].trim() || '';
  },

  getDescription: function (str) {
    var descID = '<!-- Description: ';

    if (str.match(descID) === null) { return ''; }

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

      var title = patternsArr[i].title,
        desc = patternsArr[i].description,
        example = patternsArr[i].example,
        mixinName = patternsArr[i].mixinName,
        customArgs = patternsArr[i].customArgs,
        script;

      if (patternsArr[i].script[0]) {
        script = patternsArr[i].script[0].string;
      }

      markup += J.Jayda.templatizer["_patterns"]["pattern"](title, desc, example, mixinName, customArgs, script);

    }
    $('.patterns-wrap').html(markup);

  }

};

$().ready(function () {
  J.init();
});
