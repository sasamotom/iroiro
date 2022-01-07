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
nav {
  display: none;
  right: 0;
  transition: none;
}
.open .navBtn span {
  transform: translate(-50%, -50%) rotate(-135deg);
}
.open .navBtn span::before {
  opacity: 0;
}
.open .navBtn span::after {
  transform: rotate(-90deg);
}
`;

// カスタム要素HTML
const html: string =
`
<div id="navWrapper">
  <div class="navBtn" id="navBtn"><span></span></div>
  <nav id="nav">
    <div class="navContainer">
      <ul>
        <li><a href="/">TOP</a></li>
        <li><a href="/page1/">Page 1</a></li>
        <li>
          <button></button>
          <a href="/hamburger/">子リンクがあるやつ（ないけど）</a>
          <ul>
            <li><a href="#">こども いち</a></li>
            <li><a href="#">こども に</a></li>
          </ul>
        </li>
        <li>
          <button></button>
          <a href="#">子リンクがあるやつ２</a>
          <ul>
            <li><a href="#">こども さん</a></li>
            <li><a href="#">こども よん</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</div>
`;

// *****************************************************
// ハンバーガーメニュー（上から出てくるver）のカスタム要素
// *****************************************************
export class HamburgerFromTop extends HTMLElement {
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

    // ナビゲーション自体をアコーディオンメニューとする
    new Accordion(shadow, '#navWrapper', '#navBtn', '#nav');

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
