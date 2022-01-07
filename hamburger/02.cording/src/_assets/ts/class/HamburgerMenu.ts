import { AccordionMenu } from "./AccordionMenu";

// 定数
namespace Const {
  export const CLASS_ACTIVE = 'active';   // メニュー表示中につけるクラス名
}

// *****************************************************
// ハンバーガーメニュー
// *****************************************************
export class HamburgerMenu {
  private _nav: HTMLElement;      // nav
  private _navBtn: HTMLElement;   // ナビゲーションボタン
  private _preventScroll: any;    // スクロール禁止のためのクラス

  // ----------------------------------------------------
  // 機能： コンストラクタ
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  constructor() {
    this._nav = document.getElementById('nav')!;
    this._navBtn = document.getElementById('navBtn')!;
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
    new AccordionMenu('li', 'button', 'ul');
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
