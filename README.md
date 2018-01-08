# generator-qmui [![NPM version][npm-image]][npm-url]
> A Yeoman generator for QMUI Web

[![Dependency Status][daviddm-image]][daviddm-url]
[![QMUI Team Name](https://img.shields.io/badge/Team-QMUI-brightgreen.svg?style=flat)](https://github.com/QMUI "QMUI Team")
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT "Feel free to contribute.")

## Installation

First, install [Yeoman](http://yeoman.io) and generator-qmui using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-qmui
```

Then generate your new project on your target directory:

```bash
yo qmui
```

## Preview

<img src="https://raw.githubusercontent.com/QMUI/qmuidemo_web/master/public/style/images/independent/Generator.gif" width="628" height="442" alt="效果预览" />

## Generators

Available generators:

* [qmui](#app) (aka [qmui:app](#app))
* [qmui:html](#html)
* [qmui:scss](#scss)
* [qmui:css](#css)
* [qmui:task](#custom-task)

### App

Sets up a new QMUI Web project on your target directory, generating all the directories and files you need to get started, and guide you to configure the project.

Example:

```bash
yo qmui
```


### Html

Generates a HTML file containing the basic code.

Example:

```bash
yo qmui:html fileName
```

Produces `fileName.html`:

```html
<!DOCTYPE html>
<html lang="zh-cmn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <title>Page Title</title>
</head>
<body>

</body>
</html>
```

For generator that outputs HTML template, the `—-include` option will output template that uses QMUI Include Syntax rather than native HTML.

Example:

```bash
yo qmui:html fileName --include
```

Produces `fileName.html`

```html
@@include('./_header.html', {
  "title": "Page Title"
})

@@include('./_footer.html')
```

### Scss

Generates a scss file that conforms to the QMUI format.

Example:

```bash
yo qmui:scss fileName
```

Produces `fileName.scss`:

```scss
@charset "UTF-8";
/**
 * fileName.scss
 * @author Your OS Username
 * @date Today
 *
 */


```

### Css

Generates a style file that conforms to the QMUI format.

Example:

```bash
yo qmui:css fileName
```

Produces `fileName.css`:

```css
/**
 * fileName.css
 * @author Your OS Username
 * @date Today
 *
 */


```

### Custom Task

Generates a JavaScript file that fits in the QMUI workflow in order to implement custom tasks.

Example:

```bash
yo qmui:task fileName
```

Produces `fileName.js`:

```js
// Task Name
module.exports = function (gulp, common) {

    var taskName = 'Task Name';

    gulp.task(taskName, function (done) {

        // Custom task logic code
        common.util.log('execute succeed');

        done();
    });

    // Task Description (For gulp list)
    common.tasks[taskName] = {
        description: 'Custom Task'
    };
};
```

## License

MIT © [QMUI Team](http://qmuiteam.com)


[npm-image]: https://badge.fury.io/js/generator-qmui.svg
[npm-url]: https://npmjs.org/package/generator-qmui
[daviddm-image]: https://david-dm.org/QMUI/generator-qmui.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/QMUI/generator-qmui
