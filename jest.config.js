module.exports = {
    "globals": {
        "ts-jest": {
            "diagnostics": true,
            "tsConfig": "./tsconfig.spec.json"
        },
    },
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/spec/.*|(\\.|/)(test|spec))\\.ts?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "collectCoverage": true,
    "coverageReporters": ["text-summary"],
    "verbose": true,
    "transformIgnorePatterns": [
        "/node_modules/(?!@tsed/testing).+\\.js$"
    ]
}
