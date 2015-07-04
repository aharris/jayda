J.initSearch = function (core, components) {
  $( "#tags" ).autocomplete({
    source: J.searchValues(core, components),
    select: function ( event, data ) {
      location.hash = '#' + data.item.value.toLowerCase();
    }

  });
};

J.searchValues = function (core, components) {
  var values = [];

  for (var i = 0; i < core.pages.length; i++) {
    values.push(J.toTitleCase(core.pages[i].title));
  }

  for (var property in components.components) {
    if (components.components.hasOwnProperty(property)) {
      values.push(J.toTitleCase(property));
    }
  }

  return values;
};
