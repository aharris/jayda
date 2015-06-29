J.getIcons = function () {
  var self = this;
  $.ajax({
    url: '../' + self.config.iconFontFile
  }).done(function(res) {
    var markup = J.Jayda.templatizer.core._icon_fonts["jayda-icons"](res.icons);

    self.renderPatternsTmpl(null, markup);

    self.setIconHeight();
  });
};

J.setIconHeight = function () {
  var iconEls = $('.jayda-icons li');
  var iconHeight = 0;
  var lastIconHeight = 0;

  for (var i = 0; i < iconEls.length; i++) {
    if ($(iconEls[i]).height() > lastIconHeight) {
      lastIconHeight = $(iconEls[i]).height();
      iconHeight = lastIconHeight;
    }
  }

  $(iconEls).height(iconHeight + 20);
};
