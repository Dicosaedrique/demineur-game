const path = require("path");

module.exports = {
    webpackEntry: "./index.ts", // entry point of webpack
    sourceMapInProd: true, // use source map in production ?
    copyPublicAssets: true, // copy all static assets of your public dir into the build,
    webpackAliases: {
        // alias used in webpack
        src: path.resolve(__dirname, "src"),
    },
    buildFolder: "build", // name of the build folder (will be saved from the root of the project)
    publicFolder: "public", // name of the public folder where you put your statics assets (robot.txt, index.html, ...)
    htmlEntryFile: "index.html", // name of the html entry point located in your public folder (will be copied in the build dir when building app)
    output: {
        // output folder for the files that are bundled (styles, script and assets) -> for nested folder, you can provide an array ie: ["path", "to", "something"]
        // LEAVE EMPTY ARRAY IF YOU WANT TO SET OUTPUTS TO ROOT BUILD DIR
        baseFolder: ["static"], // base (if you want to set the same dir for all ressources)
        assetsFolder: ["media"], // output dir for assets (images, ...)
        scriptsFolder: ["js"], // output dir for scripts (bundle)
        stylesFolder: ["css"], // output dir for stylesheets
    },
};
