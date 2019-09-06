const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/main.js',
  // entry: {
  //   index: './src/main.js', // 入口文件
  //   // vendor: ['react', 'react-dom']
  // },
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  }, // 出口文件
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/, // 只转化src目录下的js
        exclude: /node_modules/ // 排除掉node_modules，优化打包速度
      },
      {
        test: /\.less$/, // 解析less
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () =>
                  autoprefixer({
                    overrideBrowserslist: [
                      'defaults',
                      'not ie < 11',
                      'last 2 versions',
                      '> 1%',
                      'iOS 7',
                      'last 3 iOS versions'
                    ]
                  })
              }
            },
            'less-loader'
          ] // 从右向左解析
        })
      },
      {
        test: /\.css$/, // 解析css
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () =>
                  autoprefixer({
                    overrideBrowserslist: [
                      'defaults',
                      'not ie < 11',
                      'last 2 versions',
                      '> 1%',
                      'iOS 7',
                      'last 3 iOS versions'
                    ]
                  })
              }
            }
          ]
        })
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: 'images/' // 图片打包后存放的目录
            }
          }
        ]
      }
    ]
  }, // 处理对应模块
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
      // chunks: ['vendor', 'index', 'utils'] //  引入需要的chunk
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css'),
    new CleanWebpackPlugin() // 打包前清空 dist
  ], // 对应的插件
  resolve: {
    // 别名
    alias: {
      pages: path.join(__dirname, 'src/pages'),
      component: path.join(__dirname, 'src/component'),
      actions: path.join(__dirname, 'src/redux/actions'),
      reducers: path.join(__dirname, 'src/redux/reducers')
    },
    // 省略后缀
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less']
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         // 抽离第三方插件
  //         test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
  //         chunks: 'all',
  //         name: 'vendor', // 打包后的文件名，任意命名
  //         // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
  //         priority: 10
  //       },
  //       utils: {
  //         // 抽离自己写的公共代码，utils里面是一个公共类库
  //         chunks: 'initial',
  //         name: 'utils', //  任意命名
  //         minSize: 0 // 只要超出0字节就生成一个新包
  //       }
  //     }
  //   }
  // },
  devServer: {
    port: 3000, // 端口
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    overlay: false, // 浏览器页面上显示错误
    historyApiFallback: true
  }, // 开发服务器配置
  mode: 'development' // 模式配置
};
