'use strict';
var yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    fs = require('fs'),
    log = require('fancy-log'),
    colors = require('ansi-colors');

module.exports = yeoman.Base.extend({

    constructor: function () {
        yeoman.Base.apply(this, arguments);

        // fileName 为需要创建的任务文件的文件名
        this.argument('fileName', {
            type: String,
            desc: 'Task file name',
            required: true
        });
    },

    prompting: function () {
        this.taskName = this.fileName;

        var prompts = [
            {
                type: 'input',
                name: 'taskName',
                message: '任务名',
                default: this.taskName
            }
        ];

        return this.prompt(prompts).then(function (props) {
            this.taskName = props.taskName;
        }.bind(this));
    },

    writing: function () {

        // 生成文件
        var readmeTmpl = _.template(this.fs.read(this.templatePath('template.js')));

        fs.writeFileSync(this.destinationPath(this.fileName + '.js'), readmeTmpl({
            taskName: this.taskName
        }));

        log(colors.green('QMUI Generator: ') + '创建自定义任务 ' + this.fileName + '.js');

        process.exit(0);
    }

});
