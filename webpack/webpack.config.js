import _ from "lodash";
import webpack from "webpack";
import strategies from "./strategies";
import yargs from "yargs";

const argv = yargs
  .alias("p", "optimize-minimize")
  .alias("d", "debug")
  .alias("s", "dev-server")
  .argv;

const defaultOptions = {
  development: argv.debug,
  docs: false,
  test: false,
  optimize: argv.optimizeMinimize,
  devServer: argv.devServer,
  separateStylesheet: argv.separateStylesheet,
  prerender: argv.prerender,
};

export default (options) => {
  options = _.merge({}, defaultOptions, options);

  options.publicPath = options.devServer ? "//localhost:2992/_assets/" : "";
  const environment = options.test || options.development ? "development" : "production";
  const babelLoader = "babel?optional[]=es7.objectRestSpread&optional[]=runtime&optional[]=reactCompat"
  const reactLoader = options.development ? `react-hot!${babelLoader}` : babelLoader;
  const chunkFilename = (options.devServer ? "[id].js" : "[name].js") +
    (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "");

  options.excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
  ];

  const config = {
    entry: {
      "app": "./src/client/app.jsx",
      "admin": "./src/client/admin-app.jsx",
    },

    output: {
      path: "./build/public",
      filename: "[name].js",
      chunkFilename: chunkFilename,
      publicPath: options.publicPath,
      sourceMapFilename: "debugging/[file].map",
    },

    externals: [
    ],

    resolve: {
      extensions: ["",".js",".jsx"],
    },

    module: {
      loaders: [
        { test: /\.(js|jsx)/, loader: reactLoader, exclude: /node_modules/ },
        { test: /\.json/, loader: "json" },
        { test: /\.(woff|woff2)/, loader: "url?limit=100000" },
        { test: /\.(png|jpg|jpeg|gif|svg)/, loader: "url?limit=100000" },
        { test: /\.(ttf|eot)/, loader: "file" },
      ]
    },

    plugins: [
      new webpack.PrefetchPlugin("react"),
      new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify(environment)
        }
      }),
    ],

    devServer: {
      stats: {
        exclude: options.excludeFromStats
      }
    }
  };

  return strategies.reduce((conf, strategy) => {
    return strategy(conf, options);
  }, config);
}
