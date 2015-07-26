# Jayda
## (Work in progress)
## Style-guide driven development the way it should be.

Jayda is an automatic pattern library generator with some built in start libraries if you choose to use them.

Create pattern libraries automatically by just coding like you do everyday. No extra work or external files to keep up with.


## Install
```
$ npm install jayda --save
```

Copy contents to your app for customization
```
$ cp -r node_modules/jayda [source directory]
```

Initialize jayda
```
$ cd jayda && npm install && bower install && cd -
```

## Config options

* appSrc: The source of your application
  * EX: ``` "appSrc": "./app" ```

* target: The target directory of your application
  * EX: ``` "target": "../dest" ```

* iconFontFile: JSON file that lists icon class names
  *  EX: ``` "iconFontFile": "data/icons.json" ```

* markup: Markup type (options: jade, html)
  * EX: ``` "markup": "jade" ```

## Jade Usage

1. Inside the patterns directory create a folder for your components.
2. Inside that folder create a jade file for your component.
3. Create your mixin.

  ```
  mixin string(item1)
    p= item1
  ```

4. Call your mixin (This is the most important step for getting your documentation to build)

  ```
  if patternLibrary
    // Title: Paragraph
    // Description: I am a paragraph
    +string('I am your paragraph text')
  ```

5. Now you can call this mixin in any file you want and your documentation is generated!





## Angular App Usage

1. Follow Install instructions above
2. Follow instructions to set config options above
3. cd into jayda directory
4. build jayda
  * ``` gulp watch ```
5. Add you controller to ``` jayda/templates/index.jade ```
  * ``` html.jayda(lang="en" ng-app="jaydaAngularDemo") ```




