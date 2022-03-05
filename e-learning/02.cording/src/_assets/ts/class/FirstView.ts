// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const SELECTOR_FV = 'fv-area';
  export const PARAM_THEME = 'fvtheme';
  export const HTML_ID_BUTTON = 'okbtn';
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
    // カスタム要素の作成と登録
    this._customElem = document.createElement(Const.SELECTOR_FV);
    this._customElem.setAttribute(Const.PARAM_THEME, this._theme);
    try {
      customElements.define(Const.SELECTOR_FV, ceFirstView);
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
`;

// カスタム要素HTML
const html: string =
`
<div part="fvContainer" id="fvContainer">
  <p part="theme" id="${Const.PARAM_THEME}"></p>
  <p part="message">Are you ready?</p>
  <div part="okBtn" id="${Const.HTML_ID_BUTTON}">OK</div>
</div>
`

// *****************************************************
// FVのカスタム要素
// *****************************************************
class ceFirstView extends HTMLElement {
  private _altKeyDown: boolean;     // キーボードのalt(option)キー押下（true: 押下している, false: 押下していない）

  //----------------------------------------------------
  // 監視対象の属性指定
  //----------------------------------------------------
  static get observedAttributes() {
    return [ Const.PARAM_THEME ];
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    this._altKeyDown = false;

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<style>${css}</style>${html}`;

    // OKボタン押下監視
    if(shadow.getElementById(Const.HTML_ID_BUTTON)) {
      shadow.getElementById(Const.HTML_ID_BUTTON)!.addEventListener('click', this._goNext);
    }
    // キーボードのイベント登録
    document.addEventListener('keydown', this._updateAltKeyStatus);
    document.addEventListener('keyup', this._updateAltKeyStatus);
  }

  //----------------------------------------------------
  // 属性が変更になった際の処理
  //----------------------------------------------------
  attributeChangedCallback(name: string, OldValue: string|null, newValue: string|null) {
    this.shadowRoot!.getElementById(name)!.textContent = newValue ?? "";
  }

  //----------------------------------------------------
  // 機能： OKボタン押下時の処理（次に進む）
  // 引数: e
  // 戻値： なし
  //----------------------------------------------------
  private _goNext = (e: any) => {
    // OKボタン押下の監視を解除
    this.shadowRoot!.getElementById(Const.HTML_ID_BUTTON)!.removeEventListener('click', this._goNext);

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
