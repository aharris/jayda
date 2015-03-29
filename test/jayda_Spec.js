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
        "name": "colors"
      }
    ],
    [
      {
        "group": "components",
        "route": "patterns/components/navbar.jade",
        "name": "navbar"
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









