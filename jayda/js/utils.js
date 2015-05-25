J.capitalizeFirstLetter = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

J.toTitleCase = function (str) {
  var words,
    wordsArr = [];

    words = str.split("-");
    words = str.split("_");

  for (var i = 0; i < words.length; i++) {
    var word = this.capitalizeFirstLetter(words[i]);

    wordsArr.push(word);
  }

  var title = wordsArr.join(" ");

  return title;
};

J.toSingleLine = function (string) {
  return string.replace(/\s+/g, ' ');
};
