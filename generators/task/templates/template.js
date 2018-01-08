// <%- taskName %>
module.exports = function (gulp, common) {

    var taskName = '<%- taskName %>';

    gulp.task(taskName, function (done) {

        // Custom task logic code
        common.util.log('<%- taskName %> execute succeed');

        done();
    });

    // Task Description (For gulp list)
    common.tasks[taskName] = {
        description: 'Custom Task <%- taskName %>'
    };
};
