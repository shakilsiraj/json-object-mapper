// Karma configuration
// Generated on Wed Dec 14 2016 17:37:46 GMT+1100 (AEDT)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', "karma-typescript"],

    files: [
      { pattern: "./src/**/*.ts" }
    ],

    // list of files to exclude
    exclude: [
      
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],
    specReporter: {
        maxLogLines: 5,         // limit number of lines logged per test 
        suppressErrorSummary: false,  // do not print error summary 
        suppressFailed: false,  // do not print information about failed tests 
        suppressPassed: false,  // do not print information about passed tests 
        suppressSkipped: false,  // do not print information about skipped tests 
        showSpecTiming: true // print the time elapsed for each spec 
      },


    // web server port
    port: 9876,

    browserNotActivityTimeout: 600000,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Safari',
      // "Chrome",
      // "Firefox"
    ],

    

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
