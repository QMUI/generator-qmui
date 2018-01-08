// 任务 <%- taskName %>
module.exports = function (gulp, common) {

    var taskName = '<%- taskName %>';

    gulp.task(taskName, function (done) {

        // 以下为自定义任务代码
        common.util.log('<%- taskName %> execute succeed');

        done();
    });

    // 任务说明
    common.tasks[taskName] = {
        description: '自定义任务 <%- taskName %>'
    };
};
