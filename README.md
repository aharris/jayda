# Jayda
## (Work in progress)
## Style-guide driven development the way it should be.

Jayda is an automatic pattern library generator with some built in start libraries if you choose to use them.

Create pattern libraries automatically by just coding like you do everyday. No extra work or external files to keep up with.

All templates are built using Jade.

You can use this to create fully customized pattern libraries automatically just by creating jade mixins... THAT IS THE POINT.

### If you want to start with no CSS and Markup and roll your own pattern library:

Download the "barebones" branch. (coming soon)

### If you want to start with material design:

Download the "material" branch. (coming soon)

### If you want to start with bootstrap:

Download the "bootstrap" branch. (coming soon)


## Add to existing project
```
$ npm install jayda --save
```

Copy contents to your app for customization
```
$ cp -r node_modules/jayda ./
```

Initialize jayda
```
$ cd jayda
$ npm install
$ bower install
```

## Usage

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


