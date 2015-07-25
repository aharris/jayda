window.J = {

  Jayda: {},

  init: function () {
    // Persistant vars
    this.$parent = $('.jayda-patterns-wrap');
    this.currentPattern = '';

    var p = require('./../package.json');

    this.config = p.config;

    // Initial function calls
    this.getData();
  },

  fireAppJs: function () {
    // Reload app JS after Pattern loads
    _.each($('script'), function(it) {
      if (it.attributes.src && it.attributes.src.value === '../js/app.js') {
        it.remove();
        $('head').append(it);
      }
    });
  },

  // --------------------------------
  // JAYDA CORE ---------------------
  // --------------------------------

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
  getData: function () {
    $.when(
      $.ajax("data/core.json"),
      $.ajax("data/tree.json")
      )
      .done(function(core, components){
        J.model = components[0];
        J.appendSideNav(core[0], components[0] );
        J.router();
        J.initSearch(core[0], components[0]);

        if (!window.location.hash) {
          J.loadOverview();
        }
      })
      .fail(function(err){
        console.log('getData error', err);
      });
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
          scriptRoute = scripts[i][0].route;
          file = scripts[i][0].file;

          promise = $.ajax({
            url: '../' + scriptRoute,
            async: false
          }).done(function(res) {
            var scriptObj = {};
            scriptObj.string = res;
            scriptObj.file = file;
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
      dfd.resolve( scriptsArr );
      return requests;
    });

    return dfd.promise();

  },

  parseTree: function (res) {
    var sections = _.toArray(res.components),
      groups = _.keys(res.components),
      patterns = [],
      files = [];

    for(var i = 0; i < sections.length; i++) {
      files = _.toArray( _.filter(sections[i], function (it) {
        return it.indexOf(".jade") >= 0 || it.indexOf(".html") >= 0;
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

  appendSideNav: function (core, components){
    var data = {};
    data.patterns = this.parseTree(components);
    data.core = core;

    $('.jayda-side-nav-wrap').append(J.Jayda.templatizer["side-nav"]["side-nav"]({it: data}));

    this.bindNavButton();
    this.bindOverlay();
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

  removeNav: function () {
      $('.jayda-nav-button' ).removeClass( 'jayda-expanded' );
      $( '.jayda-side-nav-wrap' ).removeClass( 'jayda-expanded' );
      $( '.jayda-overlay' ).fadeOut();
  },

  getPatterns: function (file) {
    var res = J.model;

    J.removeNav();

    // Prevent pattern duplication
    if (J.currentPattern === file) {return false;}

    J.currentPattern = file;

    if (!J.templatizer[file]) {
      if (J.Jayda.templatizer.core['_' + file]) {
        if (file === 'icons') {
          return J.getIcons();
        } else {
          return J.renderCoreTemplate(file);
        }
      } else {
        return J.getFile(file);
      }
    }

    var tmpl = $.trim(J.templatizer[file].toString());

    J.createObj(tmpl, file, res);
  },

  getExample: function(str, file, mixinName) {
    var codeArr,
      pseudoJson;

    codeArr = str.split('["' + file + '"]["');

    if (!codeArr[1]) { return false; }

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

  renderPatternsTmpl: function (captionTmpl, markup) {

    this.$parent.html(captionTmpl);
    this.$parent.append(markup);

    Prism.highlightAll();
    this.fireAppJs();
  }

};

$().ready(function () {
  J.init();
});
