'use strict';
var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path'),
    log = require('fancy-log'),
    colors = require('ansi-colors');

// 业务逻辑变量
var devDir = 'UI_dev',
    qmuiDir = devDir + '/qmui_web';

module.exports = yeoman.Base.extend({
    prompting: function () {
        // 欢迎提示语
        this.log(yosay(
            'Welcome to the majestic ' + chalk.red('generator-qmui') + ' generator!'
        ));
        log(colors.green('QMUI Config: ') + '开始进入项目配置');

        // 项目配置信息
        this.projectName = path.basename(process.cwd());

        var prefixLength = this.projectName.toString().length > 2 ? 2 : 1;
        this.prefix = this.projectName.toString().substring(0, prefixLength);

        this.mainStyleFile = 'main.scss';

        this.browserSyncPort = 3030;

        this.browserSyncShowLog = false;

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
            },
            {
                type: 'confirm',
                name: 'openIncludeFunction',
                message: '是否开启模板引擎（增强静态模板 include，条件判断，传参等能力）?'
            },
            {
                type: 'confirm',
                name: 'openBrowserSync',
                message: '是否开启 BrowserSync（修改后自动刷新浏览器）?'
            },
            {
                when: function (response) {
                    return response.openBrowserSync;
                },
                type: 'input',
                name: 'browserSyncPort',
                message: 'BrowserSync 的端口号',
                default: this.browserSyncPort
            },
            {
                when: function (response) {
                    return response.openBrowserSync;
                },
                type: 'confirm',
                name: 'browserSyncShowLog',
                message: '是否显示 BrowserSync 的日志',
                default: this.browserSyncShowLog
            }
        ];

        return this.prompt(prompts).then(function (props) {
            this.projectName = props.projectName;
            this.prefix = props.prefix;
            this.mainStyleFile = props.mainStyleFile;
            this.openIncludeFunction = props.openIncludeFunction;
            this.openBrowserSync = props.openBrowserSync;
            if (this.openBrowserSync) {
                this.browserSyncPort = props.browserSyncPort;
                this.browserSyncShowLog = props.browserSyncShowLog;
            }

        }.bind(this));
    },

    writing: function () {
        log(colors.green('QMUI Install: ') + '写入项目结构');

        // 写入模板目录与主页
        mkdirp('UI_html');
        mkdirp('UI_html_result');
        this.fs.copy(this.templatePath('_footer.html'), this.destinationPath('UI_html/_footer.html'));
        var readmeHeaderTmpl = _.template(this.fs.read(this.templatePath('_header.html')));
        this.fs.write(this.destinationPath('UI_html/_header.html'), readmeHeaderTmpl({
            projectName: this.projectName,
            mainStyleFile: this.mainStyleFile.replace('scss', '')
        }));
        var readmeWidgetTmpl = _.template(this.fs.read(this.templatePath('widget.html')));
        this.fs.write(this.destinationPath('UI_html/widget.html'), readmeWidgetTmpl({
            projectName: this.projectName,
            prefix: this.prefix
        }));
        var readmeIndexTmpl = _.template(this.fs.read(this.templatePath('index.html')));
        this.fs.write(this.destinationPath('UI_html/index.html'), readmeIndexTmpl({
            projectName: this.projectName
        }));

        // 写入样式目标目录
        mkdirp('public');

        // 写入样式源目录与 QMUI Web 源码
        mkdirp(devDir);
        log(colors.green('QMUI Install: ') + '安装最新版本的 QMUI Web');
        this.spawnCommandSync('git', ['clone', 'https://github.com/kayo5994/QMUI_Web.git', qmuiDir]);
        this.fs.copy(this.destinationPath(qmuiDir + '/config.js'), this.destinationPath(devDir + '/config.js'));
    },

    install: function () {
        // QMUI 配置表
        this.qmuiConfig = this.destinationPath(devDir + '/config.js');

        // readFile 内 this 被改变，这里需要先把配置数据复制一份
        var qmuiConfig = this.qmuiConfig,
            projectName = this.projectName,
            prefix = this.prefix,
            mainStyleFile = this.mainStyleFile,
            openIncludeFunction = this.openIncludeFunction,
            openBrowserSync = this.openBrowserSync,
            browserSyncPort = this.browserSyncPort,
            browserSyncShowLog = this.browserSyncShowLog;

        // 读取配置文件
        var result = require(qmuiConfig);
        result.project = projectName;
        result.prefix = prefix;
        result.resultCssFileName = mainStyleFile;
        result.template.openIncludeFunction = openIncludeFunction;
        result.browserSync.browserSyncPort = browserSyncPort;
        result.browserSync.browserSyncShowLog = browserSyncShowLog;

        if (!openBrowserSync) {
            result.browserSync.browserSyncMod = 'close';
        }

        // 把配置表中的值修改为用户输入后重新写入文件
        fs.writeFileSync(qmuiConfig, 'module.exports = ' + JSON.stringify(result, null, '\t') + ';', 'utf8');

        // 安装 QMUI Web 依赖包
        var qmuiWebDir = process.cwd() + '/' + qmuiDir;
        process.chdir(qmuiWebDir);

        log(colors.green('QMUI Install: ') + '安装 QMUI Web 依赖包，该过程耗时较长，同时请确保 npm 可用，如安装失败，可自行到 ' + qmuiDir + ' 中执行 npm install');
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            bower: false,
            npm: true,
            callback: function () {
                this.spawnCommand('gulp', ['init']);
            }.bind(this)
        });
    }
});
