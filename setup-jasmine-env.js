// If we're running on CircleCI, generate JUnit XML results.

if (process.env.CIRCLE_TEST_REPORTS) {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.VERBOSE = true;
    jasmine.getEnv().addReporter(
        new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: process.env.CIRCLE_TEST_REPORTS + '/jest',
            filePrefix: 'test-results',
        })
    );
}
