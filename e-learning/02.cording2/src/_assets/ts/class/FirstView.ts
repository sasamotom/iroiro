import { LitElement, html} from 'lit';

// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const SELECTOR_FV = 'fv-area';
  export const EVENT_START = 'startelearning';
}

// *****************************************************
// FVのクラス
// *****************************************************
export class FirstView {
  protected _customElem! : HTMLElement; // カスタム要素
  private _theme: string;               // テーマ名

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: theme  テーマ名
  // 戻値： なし
  //----------------------------------------------------
  constructor(theme: string) {
    // データを保存
    this._theme = theme;

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
      customElements.define(Const.SELECTOR_FV, litFirstView);
    }
    catch { }
    // HTML作成
    const html = `<${Const.SELECTOR_FV} theme="${this._theme}"></${Const.SELECTOR_FV}>`;
    // カスタム要素表示
    document.querySelector(Const.SELECTOR_PARENT)!.insertAdjacentHTML('beforeend', html);
  }
}

// *****************************************************
// FVのカスタム要素
// *****************************************************
class litFirstView extends LitElement {
  private _altKeyDown: boolean;     // キーボードのalt(option)キー押下（true: 押下している, false: 押下していない）
  private theme: string;            // テーマ名
  private _started: boolean;        // 開始したかどうか（OKボタンが押下されたかどうか）（true: 押下済み、false: まだ）

  // プロパティ変更監視登録（reflect: true）
  static get properties() {
    return {
      theme: {type: String, reflect: true}
    };
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    // 変数初期化
    this._altKeyDown = false;
    this.theme = '';
    this._started = false;

    // キーボードのイベント登録
    document.addEventListener('keydown', this._updateAltKeyStatus);
    document.addEventListener('keyup', this._updateAltKeyStatus);
  }

  //----------------------------------------------------
  // CSS部分のテンプレート
  //----------------------------------------------------
  private _cssTemplate() {
    return html`
      <style>
        @import "/_assets/css/common.css";
        @import "/_assets/css/fv.css";
        .fvContainer {
          animation: fadeIn .5s;
          transition: .5s;
        }
        .hidden {
          opacity: 0;
        }
        .hidden .okBtn {
          cursor: default;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      </style>`;
  }

  //----------------------------------------------------
  // HTML部分のテンプレート
  //----------------------------------------------------
  private _htmlTemplate() {
    return html`
      <div class="fvContainer" id="fvContainer">
        <p class="theme">${this.theme}</p>
        <p class="message">Are you ready?</p>
        <div class="okBtn" @click="${this._goNext}">OK</div>
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
  // 機能： OKボタン押下時の処理（次に進む）
  // 引数: e
  // 戻値： なし
  //----------------------------------------------------
  private _goNext = (e: any) => {
    // 既にOKボタン押下済みの場合は何もしない
    if (this._started === true) {
      return;
    }
    this._started = true;

    // キーボードの入力監視を解除
    document.removeEventListener('keydown', this._updateAltKeyStatus);
    document.removeEventListener('keyup', this._updateAltKeyStatus);

    // FVを非表示にする
    this.shadowRoot!.getElementById('fvContainer')!.classList.add('hidden');

    // 次に進むイベント発火(渡すパラメータ option: trueの時オプションあり、falseのときオプションなし)
    window.dispatchEvent(new CustomEvent(Const.EVENT_START, { bubbles: true,
      detail: { option: this._altKeyDown}}));
  }

  //----------------------------------------------------
  // 機能： alt(option)キー押下状態を更新
  // 引数: e
  // 戻値： なし
  //----------------------------------------------------
  private _updateAltKeyStatus = (e: any) => {
    this._altKeyDown = e.altKey;
  }
}

