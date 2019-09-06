# 从零开始，再次搭建 react && animation 初探

## stepup 1 Prepare

```
$ npm -v
6.10.2

$ node -v
v10.16.0
```

## stepup 2 Installation

```
$ npm init
```

## install webpack-cli

```
$ npm install webpack-cli -D  // devDependencies 中写入 webpack-cli
$ npm i webpack-dev-server -D // devDependencies 中写入 webpack 开发服务
$ npm i html-webpack-plugin -D  //devDependencies 中写入 webpack 的 html 打包插件
$ npm i style-loader css-loader -D //devDependencies 中写入样式加载器
$ npm i less less-loader -D // devDependencies 中写入less加载器
```

### initialization webpack.config.js

```
$ vim webpack.config.js
```

```javascript
module.exports = {
    entry: {
      index: './src/main.js', // 入口文件
      vendor: ['react', 'react-dom']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve('dist') // path.resolve() 把一个路径或路径片断序列解析为决对路径
    },              // 出口文件
    module: {
      rules: [
        {
            test:/\.js$/,
            use: 'babel-loader',
            include: /src/,          // 只转化src目录下的js
            exclude: /node_modules/  // 排除掉node_modules，优化打包速度
        },
        {
          test: /\.css|\.less$/,     // 解析css
          use: ['style-loader', 'css-loader', 'less-loader'] // 从右向左解析
        }
      ]
    },              // 处理对应模块
    plugins: [
      HtmlWebpackPlugin({
        template: './public/index.html',
        hash: true // 在打包好的 bundle.js 里添加 hash 串
      })
    ],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}
```

--------------------------------------------------------------------------------

## React start

> 安装 babel ，将 es6 转换为 es5 兼容低版本浏览器

```
$ npm i babel-core babel-loader babel-preset-env babel-preset-stage-3  babel-preset-react babel-polyfill babel-plugin-import babel-register -D
```

- babel-core
- babel-loader
- babel-preset-env
- babel-preset-stage-3
- babel-preset-react
- babel-polyfill
- babel-plugin-import
- babel-register

--------------------------------------------------------------------------------

## animation

```
$ npm install --save react-lottie // 安装 react-lottie
```

--------------------------------------------------------------------------------

## 坑系列

### _打包、编译、启服务后，发现 react/react-dom 包文件没有打包进去_

> it's a long long story，废话不多说了，开讲！！！错误的根源在于·在下·对于 webpack 的不理解！！！好吧，还是一句废话。一句话，解决上面问题首先要搞清楚两点，要打包的多页面应该用还是单页面应用，从这两点分别处理：

- 认识 entry

  - entry 值为字符串 - 该配置为单入口

    ```javascript
    entry: './src/main.js'
    ```

- 认识 html-webpack-plugin，生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包，它有一些个配置项，这里只说说，我引用 bug 配置项

  > chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。

chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。

```javascript
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
      // chunks: ['vendor', 'index', 'utils'] //  引入需要的chunk
    }),
  ]
```

到这里基本明了了，产生错误的原因就是在 entry 配置的是单入口。但是吧，HtmlWebpackPlugin 中的配置了 chunks。上正确的代码

#### 单入口

```javascript
module.exports = {
  entry: './src/main.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css'),
    new CleanWebpackPlugin() // 打包前清空 dist
  ],
}
```

#### 多入口

```javascript
module.exports = {
  entry: {
    index: './src/main.js', // 入口文件
    utils: './src/utils/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
      chunks: ['vendor', 'index', 'utils'] //  引入需要的chunk
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css'),
    new CleanWebpackPlugin() // 打包前清空 dist
  ]
}
```
