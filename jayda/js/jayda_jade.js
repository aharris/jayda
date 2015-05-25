J.createObj = function (tmpl, file, res) {
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
        patternObj.showScript = self.showScript(mixinArray[i]);
        patternObj.codeSnippet = self.getCodeSnippet(mixinArray[i]);
        patternObj.codeSnippetLanguage = self.getCodeSnippetLanguage(mixinArray[i]);


        patternsArr.push(patternObj);
      }

      self.parseJadeComments(patternsArr, caption, file);
    }
  );
};

J.parseJadeComments = function (patternsArr, caption, file) {
  var markup = '',
    sectionTitle = this.toTitleCase(file);

  for (var i = 0; i < patternsArr.length; i++) {

    var it = {};

    it.title = patternsArr[i].title;
    it.desc = patternsArr[i].description;
    it.example = patternsArr[i].example;
    it.codeSnippet = patternsArr[i].codeSnippet;
    it.codeSnippetLanguage = patternsArr[i].codeSnippetLanguage;
    it.mixinName = patternsArr[i].mixinName;
    it.customArgs = patternsArr[i].customArgs;
    it.script = null;

    if (patternsArr[i].script[0] && patternsArr[i].showScript) {
      it.script = patternsArr[i].script[0].string.trim();
    }

    markup += J.Jayda.templatizer["_patterns"]["pattern"](it);

  }

  captionTmpl = J.Jayda.templatizer["_pattern_header"]({title: sectionTitle, caption: caption});

  this.renderPatternsTmpl(captionTmpl, markup);
};

J.getMixins = function(tmpl) {
  var mixinstring,
    mixinArray,
    caption;

  tmpl = this.toSingleLine(tmpl);
  tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
  mixinArray = tmpl.split('<!-- Title:');
  mixinArray.splice(0,1);

  return mixinArray;
};

J.getCustomArgs = function(str, file) {
  var codeArr,
    pseudoJson,
    snippet;

  codeArr = str.split('["' + file + '"]["');

  if (!codeArr[1]) {return false}

  codeArr = codeArr[1].split('"]');

  pseudoJson = codeArr[1].substring(codeArr[1].indexOf('(') + 1, codeArr[1].lastIndexOf('));'));

  snippet = JSON.stringify(this.getValidJSON(pseudoJson), null, 2);

  snippet = snippet.substring(snippet.indexOf('[') + 1, snippet.lastIndexOf(']'));

  return snippet;
};

J.parseComments = function (str, match) {
  if (!str.split(match)[1] || !str.split(match)[1].split('-->')[0]) {
    return '';
  }

  return str.split(match)[1].split('-->')[0].trim();
};

J.getTitle = function (str) {
  return str.split('-->')[0].trim() || '';
};

J.showScript = function (val) {
  if (val.split('<!-- showScript:')[1] && val.split('<!-- showScript:')[1].split('-->')[0]) {
    return !!val.split('<!-- showScript:')[1].split('-->')[0].trim();
  }
  return false;
};

J.getCaption = function (tmpl) {
  if (tmpl.split('<!-- Caption:')[1] && tmpl.split('<!-- Caption:')[1].split('-->')[0]) {
    return tmpl.split('<!-- Caption:')[1].split('-->')[0].trim();
  }
  return '';
};

J.getMixinName = function (str, file) {
    var codeArr = str.split('["' + file + '"]["');
    if (!codeArr[1]) { return null; }

    codeArr = codeArr[1].split('"]');
    return codeArr[0] || '';
};

J.getCodeSnippetLanguage = function (str) {
  if (!str.split('<pre><code class=\\"')[1]) { return null};

  console.log(str.split('<pre><code class=\\"')[1].split('\\"')[0]);
  return str.split('<pre><code class=\\"')[1].split('\\"')[0];
};

J.getCodeSnippet = function (str) {
  var re = /(<pre><code)((\s\w*(.*?))?>)/g;
  var match = str.match(re);

  if (!str.split(match)[1]) { return null};

  var code = str.split(match)[1];


  return code.split('</code>')[0];
};


