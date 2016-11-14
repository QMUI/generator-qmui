'use strict';
var yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    fs = require('fs'),
    gutil = require('gulp-util');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // fileName 为需要创建的 HTML 文件名
    this.argument('fileName', {
      type: String,
      desc: 'HTML file name',
      required: true
    });

    // include Options 表示输出 include header 和 footer 的模板而不是原生的 HTML 模板
    this.option('include', {
      desc: '输出 include header 和 footer 的模板',
      type: Boolean
    });
  },

  prompting: function () {
    this.pageTitle = this.fileName;

    var prompts = [
        {
          type: 'input',
          name: 'pageTitle',
          message: '页面 Title:',
          default: this.pageTitle
        }
    ];

    return this.prompt(prompts).then(function (props) {
      this.pageTitle = props.pageTitle;
    }.bind(this));
  },

  writing: function () {

    // 生成 HTML 文件
    var readmeHeaderTmpl = null;
    if (this.options.include) {
      readmeHeaderTmpl = _.template(this.fs.read(this.templatePath('include.html')));
    } else {
      readmeHeaderTmpl = _.template(this.fs.read(this.templatePath('template.html')));
    }

    fs.writeFileSync(this.destinationPath(this.fileName + '.html'), readmeHeaderTmpl({
      pageTitle: this.pageTitle
    }));

    gutil.log(gutil.colors.green('QMUI Generator: ') + '创建新 HTML 文件 ' + this.fileName + '.html');

    process.exit(0);
  }

});
