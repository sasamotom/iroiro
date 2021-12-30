// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const SELECTOR_RESULT = 'result-area';
  export const PARAM_TOTAL_POINT = 'totalpoint';
  export const PARAM_TEXT = 'text';
  export const PARAM_MESSAGE = 'msg';
  export const PARAM_RESULTS = 'results';
  export const HTML_ID_BUTTON = 'restart';
  export const EVENT_RESTART = 'restartelearning';
}

// *****************************************************
// 結果のクラス
// *****************************************************
export class Result {
  protected _customElem! : HTMLElement; // カスタム要素
  private _totalPoint: number;          // 合計得点
  private _text: string;                // 得点に対する一言文
  private _message: string;             // 得点に対するメッセージ
  private _resultStr: string;           // 正誤リスト（1: 正解、0: 不正解）

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: data         結果に関するjsonデータ
  //      resultList   正誤リスト（true: 正解、false: 不正解）
  // 戻値： なし
  //----------------------------------------------------
  constructor(data: any, resultList: boolean[]) {
    // データを保存
    const questionCnt = resultList.length;    // 問題数
    let correctCnt = 0;                       // 正解数
    this._resultStr = '';
    for (let i = 0; i < resultList.length; i++) {
      if (resultList[i] === true) {
        // 正解の場合
        correctCnt++;
        this._resultStr = this._resultStr + '1';
      }
      else {
        // 不正解の場合
        this._resultStr = this._resultStr + '0';
      }
    }
    // 合計得点（小数点以下切り捨て）
    this._totalPoint = Math.floor(correctCnt * 100 / questionCnt);
    // 得点に対する一言文とメッセージ
    this._text = data[data.length - 1].text ?? '';
    this._message = data[data.length - 1].message ?? '';
    for (let i = 0; i < data.length - 1; i++) {
      if ((Number(data[i + 1].pointto) < this._totalPoint) && (this._totalPoint <= Number(data[i].pointto))) {
        this._text = data[i].text ?? '';
        this._message = data[i].message ?? '';
        break;
      }
    }

    // 表示する
    this._show();
  }

  //----------------------------------------------------
  // 機能： 表示する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _show = () => {
    // 描画する領域があるのか確認し、なければ何もしない
    if (!document.querySelector(Const.SELECTOR_PARENT)) {
      console.log(Const.SELECTOR_PARENT + 'セレクタが無いため、表示できません。');
      return;
    }

    // カスタム要素の作成と登録
    this._customElem = document.createElement(Const.SELECTOR_RESULT);
    this._customElem.setAttribute(Const.PARAM_TOTAL_POINT, this._totalPoint.toString());
    this._customElem.setAttribute(Const.PARAM_TEXT, this._text);
    this._customElem.setAttribute(Const.PARAM_MESSAGE, this._message);
    this._customElem.setAttribute(Const.PARAM_RESULTS, this._resultStr);
    try {
      customElements.define(Const.SELECTOR_RESULT, ceResult);
    }
    catch { }

    // カスタム要素表示
    document.querySelector(Const.SELECTOR_PARENT)!.appendChild(this._customElem);
  }
}


// カスタム要素のCSS
const css: string =
`
@import "/_assets/css/common.css";
@import "/_assets/css/result.css";
.resultContainer {
  animation: fromBottom .5s;
}
@keyframes fromBottom {
  0% { transform: translateY(100vh); }
  100% { transform: none; }
}
`;

// カスタム要素HTML
const html: string =
`
<div class="resultContainer">
  <div class="container">
    <div class="result" id="result">
      <div class="point"><span class="total" id="${Const.PARAM_TOTAL_POINT}"></span><span class="label">点</span><span class="detail">/ 100点</span></div>
      <div class="texts">
        <p class="text" id="${Const.PARAM_TEXT}"></p>
        <p class="msg" id="${Const.PARAM_MESSAGE}"></p>
      </div>
      <div class="answers">
        <p class="caption">正誤</p>
        <ul class="answerList" id="${Const.PARAM_RESULTS}">
        </ul>
      </div>
    </div>
    <div class="restartBtn" id="${Const.HTML_ID_BUTTON}">RESTART</div>
  </div>
</div>
`

// *****************************************************
// 結果のカスタム要素
// *****************************************************
class ceResult extends HTMLElement {
  //----------------------------------------------------
  // 監視対象の登録
  //----------------------------------------------------
  static get observedAttributes() {
    return [Const.PARAM_TOTAL_POINT, Const.PARAM_TEXT, Const.PARAM_MESSAGE, Const.PARAM_RESULTS];
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<style>${css}</style>${html}`;
    // リスタートボタン押下監視
    if(shadow.getElementById(Const.HTML_ID_BUTTON)) {
      shadow.getElementById(Const.HTML_ID_BUTTON)!.addEventListener('click', this._restart);
    }
  }

  //----------------------------------------------------
  // 属性が変更になった際の処理
  //----------------------------------------------------
  attributeChangedCallback(name: string, OldValue: string|null, newValue: string|null) {
    if (name === Const.PARAM_RESULTS) {
      // 結果一覧の作成
      const results = (newValue ?? '').split(''); // 一文字ずつ区切る（0がはずれ、1が正解）
      let html = '';
      for (let i = 0; i < results.length; i++) {
        html = html + '<li>';
        html = html + '<div class="answerNo">' + (i + 1).toString().padStart(2, '0') + '</div>';
        html = html + '<div class="answerCorrect ';
        if (results[i] === '1') {
          html = html + 'true';
        }
        else {
          html = html + 'false';
        }
        html = html + '"></div>';
        html = html + '</li>';
      }
      this.shadowRoot!.getElementById(name)!.innerHTML = html;
    }
    else {
      this.shadowRoot!.getElementById(name)!.textContent = newValue ?? "";
    }
  }

  //----------------------------------------------------
  // 機能： リスタートイベント発火
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _restart = () => {
    // リスタートボタンの監視を解除
    this.shadowRoot!.getElementById(Const.HTML_ID_BUTTON)!.removeEventListener('click', this._restart);
    // イベント発火（リスタートイベント）
    window.dispatchEvent(new Event(Const.EVENT_RESTART));
  }
}
