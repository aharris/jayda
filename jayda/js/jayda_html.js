J.getFile = function (file) {
  var self = this;
  var example = J.model.components[file][file + '.html'];
  var data = J.model.components[file][file + '.json'];
  $.ajax({
    url: '../' + example
  }).done(function(exampleMarkup) {
    var exampleMarkup = exampleMarkup;
    $.ajax({
      url: '../' + data
    }).done(function(exampleData){
      J.parseComponent(exampleMarkup, exampleData);
    });
  });
};

J.parseComponent = function (example, exampleData) {
  var title = exampleData.name,
    desc = exampleData.description,
    script,
    markup;

  markup = J.Jayda.templatizer["_patterns"]["pattern"](null, null, example, script);

  captionTmpl = J.Jayda.templatizer["_pattern_header"]({title: title, caption: desc});

  J.renderPatternsTmpl(captionTmpl, markup);
};
