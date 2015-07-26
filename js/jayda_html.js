J.getFile = function (file) {
  var example = J.config.targetComponentsDir + '/' + J.model.components[file][file + '.html'];
  var data = J.config.targetComponentsDir + '/' + J.model.components[file][file + '.json'];
  $.ajax({
    url: '../' + example
  }).done(function(exampleMarkup) {
    $.ajax({
      url: '../' + data
    }).done(function(exampleData){
      J.parseComponent(exampleMarkup, exampleData);
    });
  });
};

J.parseComponent = function (example, exampleData) {
  var markup;

  var tag = '';

  if (exampleData.tag) {
    tag = '<' + exampleData.tag + ' creationDate="main.creationDate" />';
  }


  var data = {
    title : exampleData.name,
    desc : exampleData.description,
    example: example,
    tag: tag,
    data: exampleData.data

  };

  markup = J.Jayda.templatizer._patterns.pattern(data);

  // var captionTmpl = J.Jayda.templatizer._pattern_header({title: data.title, caption: data.desc});

  J.renderPatternsTmpl(null, markup);
};