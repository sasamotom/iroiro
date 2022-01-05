import fortuneData from "./json/fortune.json";            // 占いのデータ
import { DynamicContent } from "./class/DynamicContent";
import { ParamSet } from "./class/ParamSet";
import { EventInfo } from "./class/EventInfo";


// 変数定義
let dc: DynamicContent;         // 動的コンテンツのクラス

// ********** TOPページ **********
const topHtml = `
<div class="top container">
  <ul class="menu">
    <li class="menu_item">
      <div class="menu_pic">
        <img src="/_assets/images/img_menu01.svg" alt="">
      </div>
      <p class="menu_btn" id="simpleBtn">単純すぎるやつ</p>
    </li>
    <li class="menu_item">
      <div class="menu_pic">
        <img src="/_assets/images/img_menu02.svg" alt="">
      </div>
      <p class="menu_btn" id="articleBtn">記事っぽいやつ</p>
    </li>
    <li class="menu_item">
      <div class="menu_pic">
        <img src="/_assets/images/img_menu03.svg" alt="">
      </div>
      <p class="menu_btn" id="fortuneBtn">遊ぶやつ</p>
    </li>
  </ul>
</div>
`;
// イベント情報を事前に作成
const topEvent = new Array();
topEvent.push(new EventInfo('click', 'sitettl', 'go_top'));           // ヘッダーのサイトタイトル押下イベント
topEvent.push(new EventInfo('click', 'simpleBtn', 'go_simple'));      // 「単純すぎるやつ」ボタン押下イベント
topEvent.push(new EventInfo('click', 'articleBtn', 'go_article'));    // 「記事っぽいやつ」ボタン押下イベント
topEvent.push(new EventInfo('click', 'fortuneBtn', 'go_fortune'));    // 「遊ぶやつ」ボタン押下イベント
//----------------------------------------------------
// 機能： TOPページを表示する
// 引数： なし
// 返値： なし
//----------------------------------------------------
function goTopPage() {
  // コンテンツクラスを作成
  if (!dc) {
    dc = new DynamicContent('main', topHtml);
  }
  else {
    dc.setHmtl(topHtml);
  }
  // イベントの登録
  dc.setEvents(topEvent);
  // html表示
  dc.show();
}

//============================================
// ヘッダーのサイトタイトル押下時の処理
//============================================
addEventListener('go_top', () => {
  dc.delete();    // 表示中のページを消す
  goTopPage();    // topページを表示する
});
//============================================
// 「単純すぎるやつ」ボタン押下時の処理
//============================================
addEventListener('go_simple', () => {
  dc.delete();    // 表示中のページを消す
  goSimplePage(); // 単純ページを表示する
});
//============================================
// 「記事っぽいやつ」ボタン押下時の処理
//============================================
addEventListener('go_article', () => {
  dc.delete();        // 表示中のページを消す
  goArticlePage(1);   // 記事ページの１ページ目を表示
});
//============================================
// 「遊ぶやつ」ボタン押下時の処理
//============================================
addEventListener('go_fortune', () => {
  dc.delete();              // 表示中のページを消す
  goFortuneOpeningPage();   // 占いオープニングページを表示
});


// ********** 単純ページ（simple） **********
const simpleHtml = `
<div class="simple container">
  <ul class="btn">
    <li id="addBtn">テキスト追加</li>
    <li id="delBtn">テキスト削除</li>
  </ul>
  <div class="textArea" id="textArea"></div>
</div>
`;
// イベント情報を事前に作成
const simpleEvent = new Array();
simpleEvent.push(new EventInfo('click', 'sitettl', 'go_top'));    // ヘッダーのサイトタイトル押下イベント
//----------------------------------------------------
// 機能： 単純ページを表示する
// 引数： なし
// 返値： なし
//----------------------------------------------------
function goSimplePage() {
  // htmlをセット
  if (!dc) {
    dc = new DynamicContent('main', simpleHtml);
  }
  else {
    dc.setHmtl(simpleHtml);
  }
  // イベントの登録
  dc.setEvents(simpleEvent);
  // html表示
  dc.show();

  // テキスト追加ボタン押下時にshowContents関数を実行する
  const add = document.getElementById('addBtn');
  if (add) {
    add.addEventListener('click', showContents);
  }
  // テキスト削除ボタン押下時にdeleteContents関数を実行する
  const del = document.getElementById('delBtn');
  if (del) {
    del.addEventListener('click', deleteContents);
  }

  //----------------------------------------------------
  // コンテンツを表示する
  //----------------------------------------------------
  function showContents() {
    // 「ボタン押下されたよ」メッセージを画面に表示する
    const html = '<p>ボタン押下されたよ</p>';
    const div = document.getElementById('textArea');
    if (div) {
      div.insertAdjacentHTML('beforeend', html);
    }
  }
  //----------------------------------------------------
  // コンテンツを削除する
  //----------------------------------------------------
  function deleteContents() {
    // テキストを消す
    const div = document.getElementById('textArea');
    if (div) {
      div.innerHTML = '';
    }
  }
}


// ********** 記事ページ(article) **********
// html文を定義
let articleHtml = new Array();
// 1ページ目
articleHtml.push(`
<div class="article container">
  <img src="/_assets/images/img_artic01.svg" alt="">
  <p class="txt">
    Labore velit cillum excepteur excepteur aliquip dolor quis consequat fugiat exercitation deserunt sint eiusmod reprehenderit. Eu ullamco proident culpa aute sunt officia occaecat consectetur minim eiusmod ex. Laborum do officia nisi reprehenderit consequat nostrud. Labore duis ea consectetur laborum labore id enim id fugiat nisi in proident laborum. Fugiat dolor ut esse ad dolor reprehenderit voluptate nulla veniam labore et veniam laboris nisi. Officia Lorem veniam aute laboris commodo qui commodo voluptate exercitation qui non magna ut.<br>
    Est irure incididunt irure cupidatat labore non sint. Ut elit ipsum velit elit reprehenderit velit est commodo non cupidatat commodo. Sint pariatur labore esse tempor proident velit culpa quis in aliquip laborum.<br>
    Excepteur aliquip enim aute id do mollit sunt Lorem nulla adipisicing officia officia qui. Culpa mollit do duis irure consectetur duis enim dolore dolor quis duis. Officia ad aliquip cillum enim incididunt proident cupidatat sunt reprehenderit sunt sunt ullamco. Adipisicing dolore reprehenderit culpa anim quis exercitation id fugiat ad elit dolore. Amet dolor laborum aute esse cupidatat aliquip ad sunt adipisicing Lorem enim nostrud tempor sunt. Eiusmod labore officia ullamco amet ut.<br>
    Do laborum est incididunt consequat laboris do nulla ullamco ad veniam. Adipisicing incididunt do enim ad ex ex laborum aliqua excepteur mollit sint officia reprehenderit culpa. Anim incididunt sunt cillum ullamco Lorem esse nulla tempor ut aliqua nostrud aliqua. Nulla quis do ex amet irure in pariatur irure aute. Do reprehenderit eu aliquip ullamco ullamco commodo veniam ut non duis nostrud incididunt laborum minim. Deserunt pariatur enim consectetur ut aliquip qui. Et et fugiat adipisicing occaecat est ex ea nulla fugiat.<br>
    Consequat cupidatat tempor nisi quis consectetur ipsum ad culpa cupidatat dolor officia in exercitation duis. Aliqua esse magna fugiat non. Culpa nulla dolor adipisicing consectetur eu dolore amet nisi velit deserunt culpa deserunt cillum. Ex ad qui quis est non reprehenderit consectetur Lorem magna deserunt mollit minim magna. Sint ipsum magna culpa minim do cupidatat deserunt ad esse ut id minim. Ut ullamco veniam do ex nostrud ut excepteur magna.
  </p>
  <p class="pageNo">1 / 3</p>
  <ul class="pagebtn">
    <li class="pagebtn_next" id="goPage2">次へ</li>
  </ul>
</div>
`);
// 2ページ目
articleHtml.push(`
<div class="article container">
  <img src="/_assets/images/img_artic02.svg" alt="">
  <p class="txt">
    Qui aliquip dolore pariatur ad est irure quis adipisicing reprehenderit. Lorem sit ipsum fugiat ipsum pariatur pariatur duis sint nostrud. Exercitation irure qui laborum eu cupidatat veniam occaecat elit nulla esse duis sit. Pariatur consequat est culpa velit esse aute labore aliquip tempor amet veniam. Cillum exercitation occaecat tempor ullamco esse cillum. Laboris deserunt id deserunt minim esse tempor consectetur mollit laboris id. Aliquip elit nulla adipisicing labore enim velit proident esse consequat eiusmod eu sit.<br>
    Exercitation aliqua voluptate dolore veniam tempor est. Aute est dolore ad nostrud eiusmod ipsum ipsum non officia exercitation. Voluptate incididunt ad officia Lorem eiusmod adipisicing magna deserunt veniam. Officia sunt amet officia sint proident nisi. Adipisicing qui est id mollit non in dolor officia dolor dolore adipisicing. Aliqua excepteur in aliqua minim. Mollit voluptate ex in et cupidatat.<br>
    Ipsum sit anim cupidatat excepteur enim cupidatat quis reprehenderit occaecat est voluptate duis incididunt adipisicing. Incididunt velit in amet ad do deserunt voluptate excepteur non aliquip sit. Veniam ex sit occaecat officia non sunt est cillum duis aute sint quis. Veniam aliquip occaecat Lorem in minim eu sint. Tempor et nisi nisi aute in labore sunt ullamco Lorem exercitation. Consectetur aliquip ipsum tempor reprehenderit est ad. Tempor aliqua sit consectetur velit aute ea nulla eiusmod non elit consequat elit.
  </p>
  <p class="pageNo">2 / 3</p>
  <ul class="pagebtn">
    <li class="pagebtn_pre" id="goPage1">前へ</li>
    <li class="pagebtn_next" id="goPage3">次へ</li>
  </ul>
</div>
`);
// 3ページ目
articleHtml.push(`
<div class="article container">
  <img src="/_assets/images/img_artic03.svg" alt="">
  <p class="txt">
    Laborum sit est culpa nulla enim. Cillum ad quis officia eiusmod incididunt deserunt ad ad ex non nulla. Nisi tempor sit laborum veniam reprehenderit velit ullamco fugiat ea qui eu irure laboris qui. Lorem irure deserunt anim cupidatat sint id tempor et commodo. Reprehenderit duis tempor veniam reprehenderit cupidatat voluptate laboris irure culpa. Sint reprehenderit voluptate aliquip ipsum mollit tempor amet elit cupidatat aute Lorem cillum et.<br>
    Id voluptate dolor tempor et nostrud ut laboris elit sit culpa magna cupidatat amet. Aliqua tempor sunt eu non dolore adipisicing qui ut nisi ipsum enim magna fugiat elit. Id reprehenderit aute cillum eiusmod. Ea ipsum reprehenderit tempor magna nulla id culpa consequat. Anim minim consectetur consequat labore nostrud deserunt magna. Officia aliqua minim nisi do amet veniam dolore. Reprehenderit ex mollit aute incididunt cillum enim reprehenderit cupidatat officia consectetur nulla officia elit.<br>
    Eiusmod mollit excepteur labore dolore id reprehenderit fugiat reprehenderit aliqua commodo mollit Lorem ex. Ea mollit deserunt sint sit fugiat id consequat. Ea duis nostrud eiusmod ad irure quis reprehenderit. Incididunt cupidatat labore ex labore consequat culpa. Elit nisi nulla ut non quis consequat magna reprehenderit esse quis. Nisi nisi in laboris nostrud tempor adipisicing laboris eu exercitation occaecat dolor.<br>
    Qui nulla elit magna cupidatat magna nostrud esse cupidatat. Commodo culpa culpa ex eiusmod eu do labore voluptate in amet reprehenderit officia esse minim. Nostrud ex officia veniam nostrud. Do fugiat sunt magna irure ipsum mollit qui mollit est pariatur elit ipsum Lorem enim. Nisi deserunt excepteur sunt exercitation consequat adipisicing eiusmod qui duis mollit excepteur sit irure. Ea culpa amet tempor aute. Eiusmod cillum adipisicing occaecat non veniam pariatur deserunt ad exercitation aliquip.
  </p>
  <p class="pageNo">3 / 3</p>
  <ul class="pagebtn">
    <li class="pagebtn_pre" id="goPage2">前へ</li>
  </ul>
</div>
`);
// イベント情報を作成
const articleEvent = new Array();
articleEvent.push(new EventInfo('click', 'sitettl', 'go_top'));          // ヘッダーのサイトタイトル押下イベント
articleEvent.push(new EventInfo('click', 'goPage1', 'go_article1'));     // １ページ目へのボタン押下イベント
articleEvent.push(new EventInfo('click', 'goPage2', 'go_article2'));     // 2ページ目へのボタン押下イベント
articleEvent.push(new EventInfo('click', 'goPage3', 'go_article3'));     // 3ページ目へのボタン押下イベント
//----------------------------------------------------
// 機能： 記事ページを表示する
// 引数： なし
// 返値： なし
//----------------------------------------------------
function goArticlePage(pageNo: number) {
  // htmlをセット
  if (!dc) {
    dc = new DynamicContent('main', articleHtml[pageNo - 1]);
  }
  else {
    dc.setHmtl(articleHtml[pageNo - 1]);
  }
  // イベントの登録
  dc.setEvents(articleEvent);
  // html表示
  dc.show();
}

//============================================
// 1ページ目へのボタン押下時の処理
//============================================
addEventListener('go_article1', () => {
  dc.delete();        // 表示中のページを消す
  goArticlePage(1);   // 記事の1ページ目を表示する
});
//============================================
// ２ページ目へのボタン押下時の処理
//============================================
addEventListener('go_article2', () => {
  dc.delete();        // 表示中のページを消す
  goArticlePage(2);   // 記事の2ページ目を表示する
});
//============================================
// 3ページ目へのボタン押下時の処理
//============================================
addEventListener('go_article3', () => {
  dc.delete();        // 表示中のページを消す
  goArticlePage(3);   // 記事の3ページ目を表示する
});


// ********** 占いページ（fortune） **********
// イベント情報を作成
const fortuneOpeningEvent = new Array();
fortuneOpeningEvent.push(new EventInfo('click', 'sitettl', 'go_top'));           // ヘッダーのサイトタイトル押下イベント
fortuneOpeningEvent.push(new EventInfo('click', 'goFortune', 'play_fortune'));   // 占うボタン押下イベント
//----------------------------------------------------
// 機能： 占いオープニングページを表示する
// 引数： なし
// 返値： なし
//----------------------------------------------------
function goFortuneOpeningPage() {
  // jsonからhtml文を取得
  const fortuneHtml = fortuneData.firsthtml;

  // htmlをセット
  if (!dc) {
    dc = new DynamicContent('main', fortuneHtml);
  }
  else {
    dc.setHmtl(fortuneHtml);
  }
  // イベントの登録
  dc.setEvents(fortuneOpeningEvent);
  // html表示
  dc.show();
}

// イベント情報を作成
const fortuneResultEvent = new Array();
fortuneResultEvent.push(new EventInfo('click', 'sitettl', 'go_top'));                // ヘッダーのサイトタイトル押下イベント
fortuneResultEvent.push(new EventInfo('click', 'restartFortune', 'play_fortune'));   // 占うボタン押下イベント
//----------------------------------------------------
// 機能： 占い結果ページを表示する
// 引数： なし
// 返値： なし
//----------------------------------------------------
function goFortuneResultPage() {
  // jsonからhtml文を取得
  const fortuneHtml = fortuneData.resulthtml;

  // パラメータの作成
  // 比率の合計値を取得
  let sum = 0;
  for (let i = 0; i < fortuneData.results.length; i++) {
    sum = sum + Number(fortuneData.results[i].percentage);
  }
  // ランダムな数値（0以上sum-1以下の整数）を生成
  const result = Math.trunc(Math.random() * sum);
  // 結果確定とパラメータの取得
  sum = 0;
  const params: ParamSet[] = new Array();
  for (let i = 0; i < fortuneData.results.length; i++) {
    sum = sum + Number(fortuneData.results[i].percentage);
    if (result < sum) {
      const r = fortuneData.results[i];
      params.push(new ParamSet('@@resultno@@', r.resultno));
      params.push(new ParamSet('@@resultttl@@', r.resultttl));
      params.push(new ParamSet('@@resulttxt@@', r.resulttxt));
      break;
    }
  }

  // htmlをセット
  if (!dc) {
    dc = new DynamicContent('main', fortuneHtml, params);
  }
  else {
    dc.setHmtl(fortuneHtml, params);
  }
  // イベントの登録
  dc.setEvents(fortuneResultEvent);
  // html表示
  dc.show();
}

//============================================
// 占うボタン押下時の処理
//============================================
addEventListener('play_fortune', () => {
  dc.delete();            // 表示中のページを消す
  goFortuneResultPage();  // 占い結果ページを表示する
});



//////////////////// ここからメイン処理 ////////////////////

// TOPページの表示呼び出し
goTopPage();
