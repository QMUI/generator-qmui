// <%- taskName %>
module.exports = function (gulp, mix) {

    const taskName = '<%- taskName %>';

    gulp.task(taskName, function (done) {

        // Custom task logic code
        mix.util.log('<%- taskName %> execute succeed');

        done();
    });

    // Task Description (For gulp list)
    mix.addTaskDescription(taskName, 'Custom Task <%- taskName %>');
};
