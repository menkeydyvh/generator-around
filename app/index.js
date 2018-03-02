var generators = require('yeoman-generator'),
    _ = require('lodash'),
    glob = require('glob'),
    chalk = require('chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'around'; // 记住这个名字，下面会有用

// 导出模块，使得yo xxx能够运行
module.exports = generators.Base.extend({
    constructor: function () {
        // 默认会添加的构造函数
        generators.Base.apply(this, arguments);
        // 检查脚手架是否已经存在
        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if (_.includes(dirs, 'src')) {
            // 如果已经存在脚手架，则退出
            log(chalk.bold.green('资源已经初始化，退出...'));
            setTimeout(function () {
                process.exit(1);
            }, 200);
        }
    },
    prompting: function () {
        // 询问用户
        var questions = [
            {
                name: 'projectAssets',
                type: 'list',
                message: '请选择模板:',
                choices: [
                    {
                        name: 'vue模板',
                        value: 'vue',  //templates 下的文件名
                        checked: true // 默认选中
                    }
                ]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称',
                default: this.appname
            },
            {
                type: 'input',
                name: 'projectAuthor',
                message: '项目开发者',
                store: true, // 记住用户的选择
                default: 'xhyu'
            }, {
                type: 'input',
                name: 'projectVersion',
                message: '项目版本号',
                default: '1.0.0'
            }
        ];
        return this.prompt(questions).then(
            function (answers) {
                for (var item in answers) {
                    // 把answers里的内容绑定到外层的this，便于后面的调用
                    answers.hasOwnProperty(item) && (this[item] = answers[item]);
                }
            }.bind(this));

    },
    writing: function () {
        // 拷贝文件，搭建脚手架
        /**
         * 可以在prompting阶段让用户输入
         * 也可以指定，完全根据个人习惯
         **/
        this.projectOutput = './dist';
        //拷贝文件
        this.directory(this.projectAssets, 'src');
        // this.copy('package.json', 'package.json');

    },
    end: function () {
        // 搭建完执行的操作
        /**
         * 删除一些多余的文件
         * 由于无法复制空文件到指定目录，因此，如果想要复制空目录的话
         * 只能在空文件夹下建一个过渡文件，构建完后将其删除
         **/
        del(['src/**/.gitignore', 'src/**/.npmignore']);
        var dirs = glob.sync('+(node_modules)');
        if (!_.includes(dirs, 'node_modules')) {
            // 将你项目的node_modules和根目录下common-packages的node_modules进行软连接
            // 为什么要这样做，大家可以先想想 这个地址根据自己的目录处理 执行 npm link后的目录
            this.spawnCommand('ln', ['-s', 'C:\\Users\\Administrator\\AppData\\Roaming\\npm\\node_modules\\' + generatorName + '/node_modules', 'node_modules']);
        }
    }
})