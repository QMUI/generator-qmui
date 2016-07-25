'use strict';
var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // 欢迎提示语
    this.log(yosay(
      'Welcome to the majestic ' + chalk.red('generator-qmui') + ' generator!'
    ));
    gutil.log(gutil.colors.green('QMUI Config: ') + '开始进入项目配置');

    // 项目配置信息
    this.projectName = path.basename(process.cwd());

    var prefixLength = this.projectName.toString().length > 2 ? 2 : 1;
    this.prefix = this.projectName.toString().substring(0, prefixLength);

    this.mainStyleFile = 'main.scss';

    var prompts = [
        {
          type: 'input',
          name: 'projectName',
          message: '项目名称:',
          default: this.projectName
        },
        {
          type: 'input',
          name: 'prefix',
          message: '项目前缀（用于公共组件的 Class-name ）:',
          default: this.prefix
        },
        {
          type: 'input',
          name: 'mainStyleFile',
          message: '项目主样式表文件名',
          default: this.mainStyleFile
        }
    ];

    return this.prompt(prompts).then(function (props) {
      this.projectName = props.projectName;
      this.prefix = props.prefix;
      this.mainStyleFile = props.mainStyleFile;

    }.bind(this));
  },

  writing: function () {
    gutil.log(gutil.colors.green('QMUI Install: ') + '写入项目结构');
    mkdirp('UI_html');
    mkdirp('UI_html_result');
    mkdirp('public');
    mkdirp('UI_dev');
    gutil.log(gutil.colors.green('QMUI Install: ') + '安装最新版本的 QMUI Web');
    this.spawnCommandSync('git', ['clone', 'git@github.com:QMUI/qmui_web.git', 'UI_dev/qmui_web']);
    this.fs.copy(this.destinationPath('UI_dev/qmui_web/config.json'), this.destinationPath('UI_dev/config.json'));
    this.fs.copy(this.destinationPath('UI_dev/qmui_web/config.rb'), this.destinationPath('UI_dev/config.rb'));
  },

  install: function () {
    // QMUI 配置表
    this.qmuiConfig = this.destinationPath('UI_dev/config.json');

    // readFile 内 this 被改变，这里需要先把配置数据复制一份
    var qmuiConfig = this.qmuiConfig, 
        projectName = this.projectName,
        prefix = this.prefix,
        mainStyleFile = this.mainStyleFile;

    // 读取配置文件
    fs.readFile(qmuiConfig, function(error, data) {
      if (error) {
        throw error;
      }
      var result = JSON.parse(data);
      result.project = projectName;
      result.prefix = prefix;
      result.resultCssFileName= mainStyleFile;
      
      // 把配置表中的值修改为用户输入后重新写入文件
      fs.writeFileSync(qmuiConfig, JSON.stringify(result), 'utf8');
    });

    // 安装 QMUI Web 依赖包 
    var qmuiWebDir = process.cwd() + '/UI_dev/qmui_web';
    process.chdir(qmuiWebDir);

    gutil.log(gutil.colors.green('QMUI Install: ') + '安装 QMUI Web 依赖包，该过程耗时较长，同时请确保 npm 可用，如安装失败，可自行到 UI_dev/qmui_web 中执行 npm install');
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false,
      npm: true,
      callback: function() {
        this.spawnCommand('gulp', ['createProject']);
      }.bind(this)
    });
  }
});
