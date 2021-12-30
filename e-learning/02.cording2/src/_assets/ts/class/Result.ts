import { LitElement, html} from 'lit';

// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const SELECTOR_RESULT = 'result-area';
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

    // カスタム要素の登録
    try {
      customElements.define(Const.SELECTOR_RESULT, litResult);
    }
    catch { }
    // HTML作成
    const html = `<${Const.SELECTOR_RESULT}
      total="${this._totalPoint}"
      text="${this._text}"
      message="${this._message}"
      result="${this._resultStr}">
      </${Const.SELECTOR_RESULT}>`;
    // カスタム要素表示
    document.querySelector(Const.SELECTOR_PARENT)!.insertAdjacentHTML('beforeend', html);
  }
}

// *****************************************************
// 結果のカスタム要素
// *****************************************************
class litResult extends LitElement {
  private total: number;            // 合計得点
  private text: string;             // 得点に対する一言文
  private message: string;          // 得点に対するメッセージ
  private result: string;           // 正誤リスト（1: 正解、0: 不正解）
  private _restarted: boolean;      // 開始したかどうか（OKボタンが押下されたかどうか）（true: 押下済み、false: まだ）

  // プロパティ変更監視登録（reflect: true）
  static get properties() {
    return {
      total: {type: String, reflect: true},
      text: {type: String, reflect: true},
      message: {type: String, reflect: true},
      result: {type: String, reflect: true}
    };
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    // 変数初期化
    this.total = 0;
    this.text = '';
    this.message = '';
    this.result = '';
    this._restarted = false;
  }

  //----------------------------------------------------
  // CSS部分のテンプレート
  //----------------------------------------------------
  private _cssTemplate() {
    return html`
      <style>
        @import "/_assets/css/common.css";
        @import "/_assets/css/result.css";
        .resultContainer {
          animation: fromBottom .5s;
        }
        @keyframes fromBottom {
          0% { transform: translateY(100vh); }
          100% { transform: none; }
        }
      </style>`;
  }

  //----------------------------------------------------
  // HTML部分のテンプレート
  //----------------------------------------------------
  private _htmlTemplate() {
    return html`
      <div class="resultContainer">
        <div class="container">
          <div class="result" id="result">
            <div class="point"><span class="total">${this.total}</span><span class="label">点</span><span class="detail">/ 100点</span></div>
            <div class="texts">
              <p class="text">${this.text}</p>
              <p class="msg">${this.message}</p>
            </div>
            <div class="answers">
              <p class="caption">正誤</p>
              <ul class="answerList">
                ${(this.result.split('')).map(
                  (item, index) => html`
                    <li>
                      <div class="answerNo">${(index + 1).toString().padStart(2, '0')}</div>
                      <div class="answerCorrect ${item === '1' ? 'true' : 'false'}"></div>
                    </li>
                    `
                )}
              </ul>
            </div>
          </div>
          <div class="restartBtn" @click="${this._restart}">RESTART</div>
        </div>
      </div>
    `;
  }

  //----------------------------------------------------
  // 描画する
  //----------------------------------------------------
  render() {
    return html`
      ${this._cssTemplate()}
      ${this._htmlTemplate()}
    `;
  }

  //----------------------------------------------------
  // 機能： リスタートイベント発火
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _restart = () => {
    // 既にリスタートボタン押下済みの場合は何もしない
    if (this._restarted === true) {
      return;
    }
    this._restarted = true;

    // イベント発火（リスタートイベント）
    window.dispatchEvent(new Event(Const.EVENT_RESTART));
  }
}
