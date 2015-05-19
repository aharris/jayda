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
        patternObj.hideScript = self.hideScript(mixinArray[i]);

        patternsArr.push(patternObj);
      }

      // self.renderPatternsTmpl(patternsArr, caption, file);
      self.parseJadeComments(patternsArr, caption, file);
    }
  );
};

J.parseJadeComments = function (patternsArr, caption, file) {
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

  this.renderPatternsTmpl(captionTmpl, markup);
};

J.getMixins = function(tmpl) {
  var mixinstring,
    mixinArray,
    caption;

  tmpl = this.toSingleLine(tmpl);
  tmpl = tmpl.split('if (patternLibrary) {')[1] || '';
  mixinstring = tmpl.match(/(buf.push)([\s\S]*)(\)\)\;)/g);
  mixinArray = mixinstring[0].split('<!-- Title:');
  mixinArray.splice(0,1);

  return mixinArray;
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

J.hideScript = function (val) {
  if (val.split('<!-- hideScript:')[1] && val.split('<!-- hideScript:')[1].split('-->')[0]) {
    return !!val.split('<!-- hideScript:')[1].split('-->')[0].trim();
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
    codeArr = codeArr[1].split('"]');
    return codeArr[0] || '';
};

