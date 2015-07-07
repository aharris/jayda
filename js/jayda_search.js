J.initSearch = function (core, components) {
  var searchList = $('.jayda-search-results');

  J.initSearchInput();

  // JAYDA CORE SEARCH
  $( "#jayda-search-input" ).autocomplete({
    source: J.searchValues(core, components),
    select: function ( event, ui ) {
      location.hash = '#' + ui.item.value.toLowerCase();
    },
    response: function( event, ui ) {
      if (ui.content.length === 0) {
        $('.jayda-side-nav-list-item-core').remove();
      }
    },

    "appendTo": searchList,

  }).data("ui-autocomplete")._renderItem = function (ul, item) {

    return $('<li class="jayda-side-nav-list-item jayda-side-nav-list-item-search jayda-side-nav-list-item-core"></li>')
      .data("item.autocomplete", item)
        .append('<a class="jayda-side-nav-link" href="#' + item.label + '">' + J.toTitleCase(item.label) + "</a>").
        appendTo( ul );
  };

};

J.initSearchInput = function (){
  $( "#jayda-search-input" ).keyup(function () {
    J.showHideNavItems( $( "#jayda-search-input" ).val() );
  });
};

J.showHideNavItems = function(val) {
  if (val.length === 0) {
    $('.jayda-side-nav-list-item-default').show();
    $('.jayda-side-nav-list-item-search').hide();
  } else {
    $('.jayda-side-nav-list-item-default').hide();
    $('.jayda-side-nav-list-item-search').show();
  }
};

J.searchValues = function (core, components) {
  var values = [];

  for (var i = 0; i < core.pages.length; i++) {
    values.push(core.pages[i].route);
  }

  for (var property in components.components) {
    if (components.components.hasOwnProperty(property)) {
      values.push(property);
    }
  }

  return values;
};
