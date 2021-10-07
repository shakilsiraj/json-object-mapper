module.exports = {
    "globals": {
        "ts-jest": {
            "diagnostics": true,
            "tsconfig": "<rootDir>/tsconfig.spec.json"
        },
    },
    "testPathIgnorePatterns": [
        "<rootDir>/.c9/", "<rootDir>/node_modules/"
    ],
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
