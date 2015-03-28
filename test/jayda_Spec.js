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

// describe("parseTemplate", function () {
//   it("should generate an array of mixins out of compiled jade templates", function () {

//   });
// });