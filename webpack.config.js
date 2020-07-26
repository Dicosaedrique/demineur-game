const path = require("path");
// const EventHooksPlugin = require("event-hooks-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackLoggerPlugin = require("webpack-logger-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const config = require("./dev-config");

const development = "development";
const production = "production";

const cleanParamCli = process.argv.includes("--clean"); // detect the '--clean' parameter in the command that launched webpack

/* global WEBPACK_MODE:true */
global.WEBPACK_MODE = development; // development by default

const resolvedAssetsFolder = resolve(
    ...config.output.baseFolder,
    ...config.output.assetsFolder
);

const resolvedScriptsFolder = resolve(
    ...config.output.baseFolder,
    ...config.output.scriptsFolder
);

const resolvedStylesFolder = resolve(
    ...config.output.baseFolder,
    ...config.output.stylesFolder
);

module.exports = (env, argv) => {
    init(argv);

    const finalConfig = {
        mode: WEBPACK_MODE,
        entry: config.webpackEntry,
        devtool: select({
            development: "eval-source-map",
            production: config.sourceMapInProd ? "source-map" : false,
        }),
        ...prod({
            // set the "optimization" options only in prod
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        sourceMap: config.sourceMapInProd,
                        extractComments: false,
                    }),
                    new OptimizeCSSAssetsPlugin({}),
                ],
            },
        }),
        plugins: [
            new WebpackLoggerPlugin(),
            new MiniCssExtractPlugin({
                filename: resolve(
                    resolvedStylesFolder,
                    "[name].[contenthash].css"
                ),
                chunkFilename: resolve(
                    resolvedStylesFolder,
                    "static/css/[id].js"
                ),
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(
                    __dirname,
                    config.publicFolder,
                    config.htmlEntryFile
                ),
            }),
            // MUST BE AFTER "HtmlWebpackPlugin"
            ...prod(
                [
                    new CopyPlugin({
                        patterns: [
                            {
                                from: "public/**/*",
                                to: "[name].[ext]",
                                globOptions: {
                                    ignore: [`**/${config.htmlEntryFile}`],
                                },
                            },
                        ],
                    }),
                    // must be after any plugin that touch to assets
                    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
                    ...(cleanParamCli ? [new CleanWebpackPlugin()] : []), // add clean on outputFolder folder if "--clean" is passed to the webpack cli command
                ],
                false
            ),
        ],
        module: {
            rules: [
                {
                    test: /\.(tsx?|jsx?)$/,
                    loader: "ts-loader",
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    loader: "file-loader",
                    options: {
                        name: resolve(
                            resolvedAssetsFolder,
                            "[name].[contenthash].[ext]"
                        ),
                    },
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
            ],
        },
        resolve: {
            alias: config.webpackAliases || {},
            extensions: [".tsx", ".ts", ".js", ".jsx", "json"],
        },
        output: {
            path: path.resolve(__dirname, config.buildFolder),
            filename: resolve(resolvedScriptsFolder, "[name].[contenthash].js"),
            chunkFilename: resolve(resolvedScriptsFolder, "[id].js"),
        },
        ...dev({
            devServer: {
                port: 3000,
                open: true,
                overlay: {
                    warnings: true,
                    errors: true,
                },
            },
        }),
    };

    return finalConfig;
};

/**
 * Init the "GLOBAL_MODE" var based on the argv passed in parameter (emmit by the webpack function)
 *
 * @param {*} argv "agrv" parameter emmitted by the webpack function
 */
function init(argv) {
    if (
        !argv ||
        !("mode" in argv) ||
        (argv.mode !== development && argv.mode !== production)
    )
        return;

    WEBPACK_MODE = argv.mode;
}

/**
 * Useful to add optionnal options in development (you can spread it if necessary with '...' operator)
 *
 * @param {*} any an object or an array that you want to use only in development
 * @param {string} [isObject=true] defines if the any parameters is an object (in this case an empty object will be returned), if it's not, it's by default an array (and thus return an empty array
 * @returns your parameter any if you're in development else an empty value based on the provided type (object or array)
 */
function dev(any, isObject = true) {
    if (WEBPACK_MODE === development) return any;
    else return isObject ? {} : [];
}

/**
 * Useful to add optionnal options in production (you can spread it if necessary with '...' operator)
 *
 * @param {*} any an object or an array that you want to use only in production
 * @param {string} [isObject=true] defines if the any parameters is an object (in this case an empty object will be returned), if it's not, it's by default an array (and thus return an empty array
 * @returns your parameter any if you're in production else an empty value based on the provided type (object or array)
 */
function prod(any, isObject = true) {
    if (WEBPACK_MODE === production) return any;
    else return isObject ? {} : [];
}

/**
 * Select between two "any" based on the current mode (prod or dev)
 *
 * @param {*} obj an object that respect the { [devMode]: any, [prodMode]: any  } structure
 * @returns one of the "any" passed in parameters base on the currend mode (dev or prod)
 */
function select(obj) {
    return obj[WEBPACK_MODE];
}

function resolve(...paths) {
    return paths.join("/");
}
