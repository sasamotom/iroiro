import { LitElement, html } from 'lit';
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
  export const HTML_ID_NEXT = 'nextbtn';
  export const EVENT_SEND_ANSWER = 'sendanswer'
  export const EVENT_NEXT = 'gonext';
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
      customElements.define(Const.SELECTOR_QUESTION, litQuestion);
    }
    catch { }

    // HTML作成
    // 開始タグ部分（パラメータを渡す）
    let html = `
      <${Const.SELECTOR_QUESTION}
      no="${this._no.toString().padStart(2, '0')}"
      text="${this._text}"
      hint="${this._hint}"
      ${this._last ? `lastflag=true` : ``}
      >`;
    // 選択肢部分
    html = html +
      `
      <style>
        @import "/_assets/css/common.css";
        @import "/_assets/css/question.css";
      </style>
      <ul class="qList" id="q${this._no}">`;
    // 選択肢作成
    for (let i = 0; i < this._choices.length; i++) {
      html = html +
        `<li>
          <input
            name="${this._type}q${this._no}"
            type="${this._type}"
            id="q${this._no}-${i}"
          />
          <label for="q${this._no}-${i}">
            ${this._choices[i].contents}
          </label>
        </li>`;
    }
    html = html + `</ul>`;
    // 終了タグ
    html = html + `</${Const.SELECTOR_QUESTION}>`;

    // カスタム要素表示
    document.querySelector(Const.SELECTOR_PARENT)!.insertAdjacentHTML('beforeend', html);

    // 解答が確定されるのを監視
    window.addEventListener(Const.EVENT_SEND_ANSWER, this._checkAnswer);
  }

  //----------------------------------------------------
  // 機能： 解答を確認する
  // 引数： e
  //        e.detail.answer 選択した回答のインデックス
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
}

// *****************************************************
// 問題のテンプレート
// *****************************************************
class litQuestion extends LitElement {
  private _answered: boolean;   // 解答確定したかどうか（NEXTボタンが押下されたかどうか）（true: 押下済み、false: まだ）
  private no: string;           // 問題番号
  private text: string;         // 問題文
  private hint: string;         // ヒント
  private lastflag: boolean;    // 最終問題フラグ（true: 最終問題である、false: 最終問題ではない）

  // プロパティ変更監視登録（reflect: true）
  static get properties() {
    return {
      no: {type: String, reflect: true},
      text: {type: String, reflect: true},
      hint: {type: String, reflect: true},
      lastflag: {type: Boolean, reflect: true}
    };
  }

  //----------------------------------------------------
  // コンストラクタ
  //----------------------------------------------------
  constructor() {
    super();
    // 変数初期化
    this._answered = false;
    this.no = '';
    this.text = '';
    this.hint = '';
    this.lastflag = false;
  }

  //----------------------------------------------------
  // CSS部分のテンプレート
  //----------------------------------------------------
  private _cssTemplate() {
    return html`
      <style>
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
      </style>`;
  }

  //----------------------------------------------------
  // HTML部分のテンプレート
  //----------------------------------------------------
  private _htmlTemplate() {
    return html`
      <div class="questionContainer" id="questionContainer">
        <div class="container">
          <div class="question ${Number(this.no) % 2 !== 0 ? 'color1': 'color2'}"
          id="question">
            <p class="qNo">${this.no}</p>
            <p class="qText">${this.text}</p>
            <div @change="${this._showNextBtn}">
              <slot></slot>
            </div>
            <p class="qHint">${this.hint}</p>
            <div class="nextBtn ${this.lastflag ? 'finish' : ''}"
            id="${Const.HTML_ID_NEXT}" @click="${this._goNext}">
              <span>
                ${
                  this.lastflag
                    ? html`
                      FINISH!!!!!!!!!!!
                    `
                    : html`
                      GO TO THE NEXT
                    `
                }
              </span>
            </div>
          </div>
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
  // 機能： 次へボタンを表示する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showNextBtn = () => {
    // 次へボタンの表示
    const nextBtn = this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!;
    nextBtn.classList.add('show');
  }

  //----------------------------------------------------
  // 機能： 次へイベント発火
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _goNext = () => {
    // 既に解答送信済みの場合は何もしない
    if (this._answered === true) {
      return;
    }
    this._answered = true;

    // 次へボタンを非表示
    this.shadowRoot!.getElementById(Const.HTML_ID_NEXT)!.classList.add('hidden');

    // inputのチェック状態を取得＆inputの変更を不可とする
    const slot = (<HTMLSlotElement>this.shadowRoot!.querySelector('slot')!).assignedElements();
    const inputs = slot[1].querySelectorAll('input');
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
