# 🔧 Nadia Web Starter Kit
ナディアのフロントエンド開発用スターターキットです。

## __インストール__
### __macOS__
- [Homebrew](https://brew.sh/index_ja.html)
- [Node.js](https://nodejs.org/ja/) (v10.15.0)
- [Yarn](https://yarnpkg.com/en/docs/install#mac-tab) (Latest)
- libpng  
💻 `brew install libpng`

### __Windows__
- [Node.js](https://nodejs.org/ja/) (v10.15.0)
- [Yarn](https://yarnpkg.com/en/docs/install#windows-tab) (Latest)

## __主な機能__
- [Pug](https://pugjs.org/api/getting-started.html)
- [Sass](https://sass-lang.com/)
- [Stylus](http://stylus-lang.com/)
- [PostCSS](https://postcss.org/)
- [Stylelint](https://stylelint.io/)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [ESLint](https://eslint.org/)
- [HTMLhint](https://htmlhint.io/)
- [EditorConfig](https://editorconfig.org/)
- フィンガープリント（リビジョン）
- 画像圧縮

## __💻 Development__
```sh
yarn start
```

### __Revision__
```sh
yarn revision
```

## __💻 Production__
```sh
yarn build
```

## __設定／カスタマイズ__
### __⚙ Pug / HTML__
html を使用する場合はウォッチタスク・デフォルトタスク・ビルドタスクの `pug` を `html` に置き換えて下さい。  
リリース時にソースが圧縮されます。

#### ● インクルード
`src` 配下の `_includes` ディレクトリで管理します。  
ディレクトリ名に規則はなく、 `assets` 内で管理しても問題ありません。 

ファイル名の先頭にアンダースコア ( `_` ) を挿入することで、コンパイル／コピーの対象から除外されます。  

【インクルード記述例】
```javascript
// pug
include ./_includes/_header
```
```html
<!-- html -->
@@include('./_includes/_header.html')
```

#### ● HTMLhint
html を使用する場合は [HTMLhint](https://htmlhint.io/) を使用し構文チェックを行います。 （エディタ側で設定が有効になっている場合）  
構文ルールは .htmlhintrc に記述します。

### __⚙ Sass__
開発中はソースマップが使用できます。  
リリース時にはマップファイルを読み込まず、元のソースは参照されません。

#### ● 外部ライブラリのインポート
外部ライブラリは Yarn でインストールしインポートします。（[node-sass-package-importer](https://www.npmjs.com/package/node-sass-package-importer)）  
ライブラリ内で画像を使用している場合は手動で `src` 配下へコピーし、パスを上書きする必要があります。

※ .css をインポートした場合は警告が出ますが、現状問題はありません。
> Including .css files with @import is non-standard behaviour which will be removed in future versions of LibSass.
> Use a custom importer to maintain this behaviour. Check your implementations documentation on how to create a custom importer.

（@import での .css ファイルのインクルードは非標準的な動作で、 LibSass の将来のバージョンでは削除されます。）  
[https://github.com/sass/node-sass/issues/2362](https://github.com/sass/node-sass/issues/2362)

【使用例】
```sh
# CLI
yarn add -D normalize.css
```
```scss
// scss
@import '~normalize.css';
```

#### ● Autoprefixer
対象ブラウザは案件に合わせて指定して下さい。  
https://github.com/ai/browserslist#queries  

```json
// package.json #11

"browserslist": [
  "last 2 version",
  "Android > 4.4"
],
```

#### ● Stylelint ([stylelint-order](https://github.com/hudochenkov/stylelint-order))
Scss のプロパティ記述順を自動ソートします。  
ソートのルールは .stylelintrc に記述します。

### __⚙ Stylus__
カスタマイズすることで Stylus のコンパイルにも対応します。  
Stylus を使用する場合は、ウォッチタスク・デフォルトタスク・ビルドタスクの `styles` を `stylus` に置き換えて下さい。  
Stylelint が使用できなくなるので、プロパティ順の自動ソートは行われません。

また、 `node_modules` からのインポートは __`.css` と `.styl` のみに対応しています。__  
インストールしたライブラリの拡張子が `.scss` だった場合は `src` 配下にコピーし、拡張子を変えた上でインポートしてください。

記述方法は下記のように変わります。

【記述例】
```scss
// styl
@import 'normalize.css/normalize.css';
```

### __⚙ JavaScript__
開発中はソースマップが使用できます。  
リリース時にはマップファイルを読み込まず、元のソースは参照されません。

#### ● Webpack / Babel
Webpack と Babel を使用して開発を行います。  
webpack.config.js に Webpack の設定、 .babelrc に Babel の設定を記述します。

#### ● 外部ライブラリのインポート
外部ライブラリは Yarn でインストールしインポートします。  
インポートの方法は [Webpack 公式ドキュメント](https://webpack.js.org/api/module-methods/)などを参考にして下さい。

【使用例】
```sh
# CLI
yarn add -D jquery.easing wowjs
```
```javascript
// js
import 'jquery.easing';
import {WOW} from 'wowjs';
```

#### ● ESLint
[ESLint](https://eslint.org/) を使用し構文チェックを行います。（エディタ側で設定が有効になっている場合）  
構文ルールは .eslintrc.json に記述します。（現状は推奨設定を使用）  
構文チェック対象外のファイルは .eslintignore に記述します。

### __⚙ 同梱ライブラリ__
- [gsap](https://greensock.com/gsap) (v2.0.2)
- [jquery](https://jquery.com/) (v3.1.1)
- [jquery.easing](https://github.com/gdsmith/jquery.easing) (v1.4.1)
- __[n_utility](https://github.com/nadia-inc/nadia-lib_n_utility) by [@n-igarashi](https://github.com/n-igarashi) &lt;(°.°)&gt;__
- [normalize.css](https://necolas.github.io/normalize.css/) (v7.0.0)
- [html5-reset](https://github.com/murtaugh/HTML5-Reset) (v2.1.3)
- [sanitize.css](https://csstools.github.io/sanitize.css/) (v7.0.1)

### __⚙ フィンガープリント（リビジョン）__
リリース時に CSS ファイルと JS ファイルを 20 桁のハッシュ値を含めたものにリネームし、 html 上の記述を自動で置き換えます。（ファイルに変更があった場合のみ）

【例】
```html
style-56fc92e559a06d8820f4.css
vendor-bf3ca25776623a1ce3a3.js
app-086aec7f7e3b0aefcb37.js
```
機能を無効化したい場合は、ビルドタスクから `revision` タスクを削除して下さい。

### __⚙ PHP を使用する場合__
PHP を使用する場合はローカルサーバーを起動し、`proxy` オプションに URL を指定します。  
`server` オプションの記述は削除 or コメントアウトをします。  

【記述例】
```javascript
// gulpfile.js #70

gulp.task('browser-sync', () => {
  return bs.init({
    notify: false,
    proxy: 'localhost' // ローカルサーバーの URL を指定
    // server: {
    //   baseDir: dir.dist
    // }
  });
});

```
## __注意点__
#### ⏩ 画像圧縮
タスク実行中は __追加／変更があったファイルのみを圧縮__ し `htdocs` ディレクトリに出力するため、 __`src` ディレクトリにて削除した画像ファイルが `htdocs` ディレクトリから自動削除されるのは次回タスク実行時__ となります。  
また、開発タスク実行中に画像ファイルのリネームを行った場合、 `htdocs` ディレクトリにはリネーム前後の両ファイルが出力されたままになります。こちらも次回タスク実行時に解消されます。

#### ⏩ 不可視ファイル
不可視ファイルは `gulp` によるコピー／削除の対象にしていません。

## __更新履歴__
### __[3.0.4](https://github.com/nadia-inc/nodejs-web/releases/tag/v3.0.4) (2019-01-22)__
- babel-polyfill を廃止、 @babel/preset-env を使用
- ESLint のルールを追加
- Stylelint のルールを追加
- node.js v10 系に対応
- browserslist を使用
- node_modules からインポートする JS を別ファイルに分けるよう調整
- .node-version ファイルを追加

### __[3.0.3](https://github.com/nadia-inc/nodejs-web/releases/tag/v3.0.3) (2018-10-17)__
- Stylus パスを修正
- Stylus パッケージのインポート方法を簡略化
- postcss-clean (clean-css) 圧縮後にソースマップを生成しないバグがあるので gulp-clean-css に移行（Issues が Open のため様子見）
  - [Source mapping is lost #17](https://github.com/leodido/postcss-clean/issues/17)
  - [Sourcemaps compatibility with postcss-import #153](https://github.com/postcss/postcss-cli/issues/153)

### __[3.0.2](https://github.com/nadia-inc/nodejs-web/releases/tag/v3.0.2) (2018-10-16)__
- gulp-cssnano 廃止、clean-css (PostCSS) に移行
- gulp-pixrem を pixrem (PostCSS) に変更

### __[3.0.1](https://github.com/nadia-inc/nodejs-web/releases/tag/v3.0.1) (2018-10-12)__
- CSScomb 廃止、Stylelint に移行
- @ルールのソート順を変更
- CSS 圧縮プラグインを gulp-cssnano に変更
- PostCSS を使用 (Autoprefixer, Stylelint)

### __[3.0.0](https://github.com/nadia-inc/nodejs-web/releases/tag/v3.0.0) (2018-10-11)__
- ESlint 設定ファイルを追加
- HTMLhint 設定ファイルを追加
- Pug 追加
- node-sass-package-importer 追加
- CSScomb 追加
- Stylus 追加
- Webpack / Babel 追加
- フィンガープリント機能追加
- npm-scripts を使用
- CSS 構造を微修正
- ソース圧縮タイミングをリリース時のみに変更
- ソースマップを削除しないよう変更
