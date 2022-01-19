import { Accordion } from "./Accordion";

// 定数
namespace Const {
  export const CLASS_ACTIVE = 'active';   // メニュー表示中につけるクラス名
}

// カスタム要素のCSS
const css: string =
`
@import "/_assets/css/common.css";
@import "/_assets/css/hamburger.css";
`;

// カスタム要素HTML
const html: string =
`
<nav id="nav">
  <div class="navContainer">
    <div class="navBtn" id="navBtn"><span></span></div>
    <ul>
      <li><a href="/iroiro/hamburger/">TOP</a></li>
      <li><a href="/iroiro/hamburger/page1/">Page 1</a></li>
      <li>
        <button></button>
        <a href="/iroiro/hamburger/hamburger/">静的コーディングに使ったページ</a>
        <ul>
          <li><a href="#">こども いち</a></li>
          <li><a href="#">こども に</a></li>
        </ul>
      </li>
      <li>
        <button></button>
        <a href="/iroiro/hamburger/kurukuru/">くるくる</a>
        <ul>
          <li><a href="#">こども さん</a></li>
          <li><a href="#">こども よん</a></li>
        </ul>
      </li>
    </ul>
  </div>
</nav>
`;

// *****************************************************
// ハンバーガーメニューのカスタム要素
// *****************************************************
export class Hamburger extends HTMLElement {
  private _nav: HTMLElement;      // nav
  private _navBtn: HTMLElement;   // ナビゲーションボタン
  private _preventScroll: any;    // スクロール禁止のためのクラス

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<style>${css}</style>${html}`;

    this._nav = shadow.getElementById('nav')!;
    this._navBtn = shadow.getElementById('navBtn')!;
    this._preventScroll = {
      x: 0,
      y: 0,
      setPos: function () {
        this.x = window.pageXOffset;
        this.y = window.pageYOffset;
      },
      handleEvent: function () {
        window.scrollTo(this.x, this.y);
      },
      enable: function () {
        this.setPos();
        window.addEventListener("touchmove", this, { passive: false });
      },
      disable: function () {
        window.removeEventListener("touchmove", this);
      },
    };
    this._navBtn.addEventListener('click', this._toggleNavi);

    // アコーディオンメニューを使用できるようにする
    new Accordion(shadow, 'li', 'button', 'ul');
  }

  // ----------------------------------------------------
  // 機能： ナビゲーションの表示・非表示切り替え
  // 引数： e
  // 返値： なし
  //----------------------------------------------------
  private _toggleNavi = (e: any) => {
    this._nav.classList.toggle(Const.CLASS_ACTIVE);
    if (this._nav.classList.contains(Const.CLASS_ACTIVE)) {
      this._preventScroll.enable();
    }
    else {
      this._preventScroll.disable();
    }
    return false;
  }
}
