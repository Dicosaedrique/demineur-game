module.exports = {
    roots: ["src"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    modulePaths: ["<rootDir>"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/__test__/__mocks__/fileMock.js",
        "\\.css$": "identity-obj-proxy",
    },
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx,js,jsx}"],
    coverageReporters: ["text", "html"],
    coverageDirectory: "<rootDir>/__test__/__coverage__/",
};
