// 定数
namespace Const {
  export const CLASS_OPEN = 'open';   // アコーディオンが開いている時につけるクラス名
}

// *****************************************************
// アコーディオンメニュー
// *****************************************************
export class AccordionMenu {
  private _containerSelector: string;     // アコーディオンのボタンと内容を含む領域
  private _btnSelector: string;           // アコーディオンのボタン
  private _contentSelector: string;       // アコーディオンで表示非表示を切り替える領域

  // ----------------------------------------------------
  // 機能： コンストラクタ
  // 引数： containerSelector   アコーディオンのボタンと内容を含む領域
  //      btnSelector         アコーディオンのボタン
  //      contentSelector     アコーディオンで表示非表示を切り替える領域
  // 返値： なし
  //----------------------------------------------------
  constructor(containerSelector?: string, btnSelector?: string, contentSelector?: string) {
    this._containerSelector = containerSelector ?? '.js-accordion';
    this._btnSelector = btnSelector ?? '.js-accordion-trigger';
    this._contentSelector = contentSelector ?? '.js-accordion-content';

    // アコーディオンを全て取得
    const accordions = document.querySelectorAll(this._containerSelector);
    // 取得したアコーディオンをArrayに変換(IE対策)
    const accordionsArr = Array.prototype.slice.call(accordions);

    accordionsArr.forEach((accordion) => {
      // Triggerを全て取得
      const accordionTriggers = accordion.querySelectorAll(this._btnSelector);
      // TriggerをArrayに変換(IE対策)
      const accordionTriggersArr = Array.prototype.slice.call(accordionTriggers);
      accordionTriggersArr.forEach((trigger) => {
        // Triggerにクリックイベントを付与
        trigger.addEventListener('click', () => {
          // '.open'クラスを付与or削除
          trigger.parentNode.classList.toggle(Const.CLASS_OPEN);
          // 開閉させる要素を取得
          const content = trigger.parentNode.querySelector(this._contentSelector);
          // 要素を展開or閉じる
          this._slideToggle(content);
        });
      });
    })
  }

  // ----------------------------------------------------
  // 機能： アコーディオンのオープン・クローズ切り替え
  // 引数： el 　表示。非表示を切り替える要素
  // 返値： なし
  //----------------------------------------------------
  private _slideToggle = (el: HTMLElement, duration = 300) => {
    if (window.getComputedStyle(el).display === 'none') {
      return this._slideDown(el, duration);
    }
    else {
      return this._slideUp(el, duration);
    }
  }

  // ----------------------------------------------------
  // 機能： アコーディオンを開く
  // 引数： el 　表示。非表示を切り替える要素
  // 返値： なし
  //----------------------------------------------------
  private _slideDown = (el: HTMLElement, duration = 300) => {
    el.classList.add(Const.CLASS_OPEN);
    el.style.removeProperty('display');
    let display = window.getComputedStyle(el).display;
    if (display === 'none') {
      display = 'block';
    }
    el.style.display = display;
    let height = el.offsetHeight;
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
    el.style.marginTop = '0';
    el.style.marginBottom = '0';
    el.offsetHeight;
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    el.style.transitionTimingFunction = 'ease';
    el.style.height = height + 'px';
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    setTimeout(() => {
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-duration');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-timing-function');
    }, duration);
  }
  // ----------------------------------------------------
  // 機能： アコーディオンを閉じる
  // 引数： el 　表示。非表示を切り替える要素
  // 返値： なし
  //----------------------------------------------------
  private _slideUp = (el: HTMLElement, duration = 300) => {
    el.style.height = el.offsetHeight + 'px';
    el.offsetHeight;
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    el.style.transitionTimingFunction = 'ease';
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
    el.style.marginTop = '0';
    el.style.marginBottom = '0';
    setTimeout(() => {
      el.style.display = 'none';
      el.style.removeProperty('height');
      el.style.removeProperty('padding-top');
      el.style.removeProperty('padding-bottom');
      el.style.removeProperty('margin-top');
      el.style.removeProperty('margin-bottom');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-duration');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-timing-function');
      el.classList.remove(Const.CLASS_OPEN);
    }, duration);
  }
}
