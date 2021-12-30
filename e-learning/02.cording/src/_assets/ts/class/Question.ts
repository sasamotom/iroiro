import { Utils } from "../utils/Utils";

// ===== MEMO ===== ===== ===== ===== =====
// Safariでもスムーススクロールを実現させるために
// npm i scroll-behavior-polyfill
// にてポリフィルを入れた
// ===== ===== ===== ===== ===== ===== =====
import "scroll-behavior-polyfill";

// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const SELECTOR_QUESTION = 'question-area';
  export const PARAM_NO = 'qno';
  export const PARAM_TEXT = 'qtext';
  export const PARAM_HINT = 'qhint';
  export const PARAM_LAST = 'lastflag';
  export const HTML_ID_NEXT = 'nextbtn';
  export const EVENT_SEND_ANSWER = 'sendanswer'
  export const EVENT_NEXT = 'gonext';
  export const TEMPLATE_QUESTION = 'question-area';
  export const SLOT_CHOICES = 'question-choices'
}

// *****************************************************
// 選択肢データ
// *****************************************************
class _Choice {
  private _contents: string;    // コンテンツ（HTML）
  private _correct: boolean;    // その選択肢を選択することが正解か不正解か（true: 正解、false: 不正解）

  get contents(): string {
    return this._contents;
  }
  get correct(): boolean {
    return this._correct;
  }

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: contents   コンテンツ（HTML）
  //      correct    その選択肢を選択することが正解か不正解か（true: 正解、false: 不正解）
  // 戻値： なし
  //----------------------------------------------------
  constructor(contents: string, correct: boolean) {
    this._contents = contents;
    this._correct = correct;
  }
}

// *****************************************************
// 問題クラス
// *****************************************************
export class Question {
  private _customElem! : HTMLElement; // カスタム要素
  private _no: number;          // 問題No（1〜）
  private _text: string;        // 問題文
  private _hint: string;        // ヒント文
  private _type: string;        // 選択肢のタイプ（radioまたはcheckbox）
  private _choices: _Choice[];  // 選択肢の配列
  private _shuffle: boolean;    // シャッフルするかどうか（true: シャッフルする、false: シャッフルしない）
  private _last: boolean;       // 最後かどうか（true: 最後、false: 最後ではない）
  private _choiceIndexs: number[];  // 選択肢の表示順

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: no        問題No
  //      data      質問に関するjsonデータ
  //      shuffle   シャッフル機能を使用するかどうか（true: 使用する、false: 使用しない）
  //      last      最後の問題であるかどうか（true: 最後、false: 最後ではない）
  // 戻値： なし
  //----------------------------------------------------
  constructor(no: number, data: any, shuffle?: boolean, last?: boolean) {
    // データを保存
    this._no = no;
    this._text = data.text ?? '';
    this._hint = data.hint ?? '';
    this._type = data.type ?? 'checkbox';
    this._last = last ?? false;
    this._shuffle = (shuffle ?? '') === true ? true : false;

    // 選択肢を作成
    this._choiceIndexs = new Array();
    this._choices = new Array();
    if (typeof data.choices !== 'undefined') {
      // 選択肢の呼び出し順を作成
      for (let i = 0; i < data.choices.length; i++) {
        this._choiceIndexs.push(i);
      }
      // シャッフルする場合はIndex配列を入れ替える
      if (this._shuffle === true) {
        this._choiceIndexs = Utils.shuffleArray(this._choiceIndexs);
      }
      // 選択肢を作成
      for (let i = 0; i < data.choices.length; i++) {
        const c = data.choices[this._choiceIndexs[i]];
        this._choices.push(new _Choice(c.text ?? "", (c.correct === 'true' ? true : false)));
      }
    }

    // カスタム要素（テンプレート）の登録
    try {
      customElements.define(Const.SELECTOR_QUESTION, tmpQuestion);
    }
    catch { }

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

    // カスタム要素の作成
    this._customElem = document.createElement(Const.SELECTOR_QUESTION);
    this._customElem.setAttribute(Const.PARAM_NO, this._no.toString().padStart(2, '0'));
    this._customElem.setAttribute(Const.PARAM_TEXT, this._text);
    if (this._hint !== '') {
      this._customElem.setAttribute(Const.PARAM_HINT, this._hint);
    }
    if (this._last === true) {
      this._customElem.setAttribute(Const.PARAM_LAST, 'true');
    }
    this._customElem.innerHTML = this._getSlotHmtl();   // 選択肢リストのhtml

    // カスタム要素表示
    document.querySelector(Const.SELECTOR_PARENT)!.appendChild(this._customElem);

    // 解答が確定されるのを監視
    window.addEventListener(Const.EVENT_SEND_ANSWER, this._checkAnswer);
  }

  //----------------------------------------------------
  // 機能： 解答を確認する
  // 引数： e
  //        e.detail.answer 選択した回答のチェック状態
  // 返値： なし
  //----------------------------------------------------
  private _checkAnswer = (e: any) => {
    // 監視を解除
    window.removeEventListener(Const.EVENT_SEND_ANSWER, this._checkAnswer);

    // 回答の確認
    let result = true;   // 結果（true: 正解、false: 不正解）
    for (let i = 0; i < this._choices.length; i++) {
      if (this._choices[i].correct !== e.detail.answer[i]) {
        result = false;
        break;  // 不正解確定のため、ループから抜ける
      }
    }

    // 次に進むイベント発火
    window.dispatchEvent(new CustomEvent(Const.EVENT_NEXT, { bubbles: true,
      detail: { no: this._no, result: result }}));
  }

  //----------------------------------------------------
  // 機能： 選択肢部分htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getSlotHmtl = () => {
    let str: string = "";   // htmlの文字列
    str = str +
      `<style>${css}</style>
      <ul class="qList" id="q${this._no}" slot="${Const.SLOT_CHOICES}">`
    // 選択肢作成
    for (let i = 0; i < this._choices.length; i++) {
      str = str +
        `<li>
          <input
            name="${this._type}q${this._no}"
            type="${this._type}"
            id="q${this._no}-${i}"
          />
          <label for="q${this._no}-${i}">
            ${this._choices[i].contents}
          </label>
        </li>`
    }
    str = str +
      `</ul>`
    return str;
  }
}

// カスタム要素のCSS
const css: string =
`
@import "/_assets/css/common.css";
@import "/_assets/css/question.css";
.questionContainer {
  animation: fadeIn .5s;
}
.nextBtn {
  display: none;
  transition: .5s;
}
.show {
  display: block;
  animation: fromBottom .5s;
}
.hidden {
  opacity: 0;
  cursor: default;
  animation: toTop .5s;
}
@keyframes fromBottom {
  0% { transform: translateY(100vh); }
  100% { transform: none; }
}
@keyframes toTop {
  0% { transform: none; }
  100% { transform: translateY(-400%); }
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;

// テンプレートHTML
const template: string =
`
<template id="${Const.TEMPLATE_QUESTION}">
  <style>${css}</style>
  <div class="questionContainer" id="questionContainer">
    <div class="container">
      <div class="question" id="question">
        <p class="qNo" id="${Const.PARAM_NO}"></p>
        <p class="qText" id="${Const.PARAM_TEXT}"></p>
        <slot name="${Const.SLOT_CHOICES}"></slot>
        <p class="qHint" id="${Const.PARAM_HINT}"></p>
        <div class="nextBtn" id="${Const.HTML_ID_NEXT}"><span>GO TO THE NEXT</span></div>
      </div>
    </div>
  </div>
</template>
`;

// *****************************************************
// 問題のテンプレート
// *****************************************************
class tmpQuestion extends HTMLElement {
  private _questionNo: number;  // 問題番号

  //----------------------------------------------------
  // 監視対象の属性指定
  //----------------------------------------------------
  static get observedAttributes() {
    return [ Const.PARAM_NO, Const.PARAM_TEXT, Const.PARAM_HINT, Const.PARAM_LAST ];
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    this._questionNo = -1;

    // templateがない場合は追加
    if (!document.getElementById(Const.SELECTOR_QUESTION)) {
      document.querySelector(Const.SELECTOR_PARENT)!.insertAdjacentHTML('beforeend', template);
    }
    // templateの内容取得
    const temp = <HTMLTemplateElement>document.getElementById(Const.TEMPLATE_QUESTION);
    let tempCont = temp.content;
    // templateをshadowRootに付与する
    const shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(tempCont.cloneNode(true));

    // inputの変更を感知する
    const element: HTMLElement = <HTMLElement>shadow.getElementById('questionContainer');
    element.addEventListener('change', this._showNextBtn);
  }

  //----------------------------------------------------
  // 属性が変更になった際の処理
  //----------------------------------------------------
  attributeChangedCallback(name: string, OldValue: string|null, newValue: string|null) {
    if (name === Const.PARAM_NO) {
      this._questionNo = Number(newValue);  // 問題番号の保存
      // 装飾の指定
      const q = this.shadowRoot!.getElementById('question')!;
      if (this._questionNo % 2 !== 0) {
        q.classList.add('color1');
      }
      else {
        q.classList.add('color2');
      }
    }

    if (name === Const.PARAM_LAST) {
      // 最後の質問の場合、スタイルやテキストを変更する
      this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!.classList.add('finish');
      this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!.innerHTML = '<span>FINISH!!!!!!!!!!!</span>';
    }
    else {
      this.shadowRoot!.getElementById(name)!.innerHTML = newValue ?? "";
    }
  }

  //----------------------------------------------------
  // 機能： 次へボタンを表示する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showNextBtn = () => {
    // inputの変更監視を解除
    this.shadowRoot!.getElementById('questionContainer')!.removeEventListener('change', this._showNextBtn);
    // 次へボタンの表示
    const nextBtn = this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!;
    nextBtn.classList.add('show');
    // 次へボタン押下イベント登録
    nextBtn.addEventListener('click', this._goNext);
  }

  //----------------------------------------------------
  // 機能： 次へイベント発火
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _goNext = () => {
    // 次へボタンの監視を解除
    this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!.removeEventListener('click', this._goNext);
    // 次へボタンを非表示
    this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!.classList.add('hidden');

    // inputのチェック状態を取得＆inputの変更を不可とする
    const slot = (<HTMLSlotElement>this.shadowRoot!.querySelector(`slot[name="${Const.SLOT_CHOICES}"]`)!).assignedElements();
    const inputs = slot[0].querySelectorAll('input');
    let checkedArray = new Array();
    for (let i = 0; i < inputs.length; i++) {
      // inputのチェック状態を取得
      checkedArray.push(inputs[i].checked);
      // inputの変更を不可とする
      inputs[i].disabled = true;
    }

    // イベント発火（回答を送る）
    window.dispatchEvent(new CustomEvent(Const.EVENT_SEND_ANSWER, { bubbles: true,
      detail: { answer: checkedArray }}));

    // 下にスクロールする
    //   新しい要素が描画されるまでに少し待ってからスクロールする。待機しないと新しい要素のサイズが考慮されず異常な動作となる。
    //   とは言えども、この方法はダサいからなんとかしたい。。。。。
    setTimeout(() => {
      window.scrollTo({
        top: this.getBoundingClientRect().bottom + window.pageYOffset - 0,
        behavior: 'smooth'
      });
    }, 120);
  }
}
