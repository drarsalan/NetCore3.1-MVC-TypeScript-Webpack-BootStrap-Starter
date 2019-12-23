/// <binding />
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}, argv = {}) => {

    const isProd = (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
    const devMode = isProd ? 'production' : 'development'

    const config = {
        mode: devMode ? 'development' : 'production',

        optimization: {
            minimize: true
        },
        entry: {
            'js/main': './ClientApp/src/main.ts',
            'js/newJsPage' : './ClientApp/src/newJsPage.ts'
        },
        output: {
            // filename: isProd ? 'bundle-[chunkHash].js' : '[name].js',
            filename: '[name].js',
            path: path.resolve(__dirname, './wwwroot'),
            publicPath: "/"
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
               }),
            new MiniCssExtractPlugin({
                filename: isProd ? 'css/style-[contenthash].css' : 'css/style.css'
            }),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new HtmlWebpackPlugin(
                {
                    filename: path.resolve(__dirname, 'Views/Shared/_Layout.cshtml'),
                    template: path.resolve(__dirname, 'Views/Shared/_LayoutTemplate.cshtml'),
                    inject: false,
                    //templateParameters: {
                    //	baseHref: BaseConfig.baseUriPath,
                    //	appName: AppConfig.App.Title
                    //}
                }
            )
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'assets/'
                    }
                }
            ]
        }
    };
    return config;
};