var J = window.J;

describe("parseTree", function () {
  var res = {
    "patterns": {
      "CSS": {
        "colors.jade": "patterns/CSS/colors.jade"
      },
      "components": {
        "navbar.jade": "patterns/components/navbar.jade"
      }
    }
  };
  var patterns = [
    [
      {
        "group": "CSS",
        "route": "patterns/CSS/colors.jade",
        "name": "Colors",
        "file": "colors"
      }
    ],
    [
      {
        "group": "components",
        "route": "patterns/components/navbar.jade",
        "name": "Navbar",
        "file": "navbar"
      }
    ]
  ];
  it("should return an array from the file tree", function () {
    expect(J.parseTree(res)).toEqual(patterns);
  });
});


describe("parseTemplate", function () {
  it("should return an array of mixins out of compiled jade templates", function () {
    var tmpl,
      array;

    tmpl = 'function tmpl_navbar(locals) { var buf = []; var jade_mixins = {}; var jade_interp; var locals_for_with = locals || {}; (function(patternLibrary) { if (patternLibrary) { buf.push("<!-- Title: Right Aligned Links--><!-- Description: I am right aligned links-->"); buf.push(templatizer["navbar"]["right-nav"]([ { href: "sass.html", text: "Sass" }, { href: "components.html", text: "Components" }, { href: "javascript.html", text: "Javascript" } ])); } }).call(this, "patternLibrary" in locals_for_with ? locals_for_with.patternLibrary : typeof patternLibrary !== "undefined" ? patternLibrary : undefined); return buf.join(""); }';

    array = [' Right Aligned Links--><!-- Description: I am right aligned links-->"); buf.push(templatizer["navbar"]["right-nav"]([ { href: "sass.html", text: "Sass" }, { href: "components.html", text: "Components" }, { href: "javascript.html", text: "Javascript" } ]));'];

    expect(J.parseTemplate(tmpl)).toEqual(array);
  });
});


describe("Split Attribute String", function () {
  it("should return an array of parameters from a string that has multiple parameters (single string only)",function () {
    var multiParam = '"Item string, 1", "Item string, 2"';
    var multiParamResult = ["Item string, 1", "Item string, 2"];

    expect($.splitAttrString(multiParam)).toEqual(multiParamResult);
  });
});

describe("Get Title", function () {
  it("Should return the title", function() {
    var str = " Right Aligned Links-->";
    var title = "Right Aligned Links";
    expect(J.getTitle(str)).toEqual(title);
  });
});

describe("Get Description", function () {
  it("Should return the Description", function() {
    var str = ' Two Param test--><!-- Description: I am a Two Param test-->"); buf.push(templatizer["colors"]["test"]("Item string, 1", "Item string, 2"));';
    var description = "I am a Two Param test";
    expect(J.getDescription(str)).toEqual(description);
  });
});

describe("Get Mixin Name", function () {
  it("Should return the mixin name", function() {
    var str = ' Right Aligned Links--><!-- Description: I am right aligned links-->"); buf.push(templatizer["navbar"]["right-nav"]([ { href: "sass.html", text: "Sass" }, { href: "components.html", text: "Components" }, { href: "javascript.html", text: "Javascript" } ])); buf.push("';
    var file = 'navbar';
    var mixinName = 'right-nav';
    expect(J.getMixinName(str, file)).toEqual(mixinName);
  });
});

// TODO: Fix require js error
// describe("Get Example", function () {
//   it("Should return the example mixin", function() {
//     var str = ' Right Aligned Links--><!-- Description: I am right aligned links-->"); buf.push(templatizer["navbar"]["right-nav"]([ { href: "sass.html", text: "Sass" }, { href: "components.html", text: "Components" }, { href: "javascript.html", text: "Javascript" } ])); buf.push("';
//     var file = "navbar";
//     var mixinName = 'right-nav';
//     var example = '<div class="row"><nav><div class="nav-wrapper"><div class="col s12"><a href="#" class="brand-logo">Logo</a><ul id="nav-mobile" class="right hide-on-med-and-down"><li><a href="sass.html">Sass</a></li><li><a href="components.html">Components</a></li><li><a href="javascript.html">Javascript</a></li></ul></div></div></nav></div>';

//     expect(J.getExample(str, file, mixinName)).toEqual(example);
//   });
// });



