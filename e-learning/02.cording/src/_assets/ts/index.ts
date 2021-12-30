import jsonData from "./json/data.json";
import { Utils } from "./utils/Utils";
import { FirstView } from "./class/FirstView";
import { Question } from "./class/Question";
import { Result } from "./class/Result";

// 定数
namespace Const {
  export const SELECTOR_PARENT = 'eleaning-area';
  export const EVENT_START = 'startelearning';
  export const EVENT_NEXT = 'gonext';
  export const EVENT_RESTART = 'restartelearning';
}

// *****************************************************
// 処理呼び出しメインクラス
// *****************************************************
export class EgELearning {
  private _displayedQuestionCnt: number;    // 表示中の問題数
  private _resultList: boolean[];           // 回答リスト（true: 正解、false: 不正解）
  private _shuffle: boolean;                // シャッフルするかしないか（true: する、false: しない）
  private _questionIndexs: number[];        // 問題の呼び出し順

  //----------------------------------------------------
  // 処理開始
  //----------------------------------------------------
  constructor() {
    // 変数の初期化
    this._displayedQuestionCnt = 0;
    this._resultList = new Array();
    this._shuffle = (jsonData.shuffle === 'true');
    this._questionIndexs = new Array();
    for (let i = 0; i < jsonData.questions.length; i++) {
      this._questionIndexs.push(i);
    }

    // イベント登録
    window.addEventListener(Const.EVENT_START,this._showFirstQuestion);
    window.addEventListener(Const.EVENT_NEXT,this._showNextQuestion);
    window.addEventListener(Const.EVENT_RESTART,this._restart);

    // FVの表示
    new FirstView(jsonData.theme ?? "");
  }

  //----------------------------------------------------
  // 機能： 最初の問題を表示
  // 引数： e
  //        e.detail.option オプション機能を使うか使わないか（true: 使う、false: 使わない）
  // 返値： なし
  //----------------------------------------------------
  private _showFirstQuestion = (e: any) => {
    // 変数リセット（リスタートでも使用するため）
    this._displayedQuestionCnt = 0;
    this._resultList = new Array();

    // シャッフルするかしないかを取得
    if (e.detail.option === true) {
      // jsonの値によらずシャッフルしない
      this._shuffle = false;
    }

    // シャッフルする場合は、問題の呼び出し順をシャッフル
    if (this._shuffle === true) {
      this._questionIndexs = Utils.shuffleArray(this._questionIndexs);
    }

    // 質問を表示する
    if (this._displayedQuestionCnt < jsonData.questions.length) {
      const last = (this._displayedQuestionCnt + 1 === jsonData.questions.length);
      new Question(this._displayedQuestionCnt + 1, jsonData.questions[this._questionIndexs[this._displayedQuestionCnt]], this._shuffle, last);
      this._displayedQuestionCnt++;
    }
  }

  //----------------------------------------------------
  // 機能： 次の問題を表示
  // 引数： e
  //        e.detail.result 正解か不正解か（true: 正解、false: 不正解）
  // 返値： なし
  //----------------------------------------------------
  private _showNextQuestion = (e: any) => {
    // 正誤を保存する
    this._resultList.push(e.detail.result);

    if (this._displayedQuestionCnt < jsonData.questions.length) {
      // 次の質問を表示する
      const last = (this._displayedQuestionCnt + 1 === jsonData.questions.length);
      new Question(this._displayedQuestionCnt + 1, jsonData.questions[this._questionIndexs[this._displayedQuestionCnt]], this._shuffle, last);
      this._displayedQuestionCnt++;
    }
    else {
      // 結果を表示する
      this._showResult();
    }
  }

  //----------------------------------------------------
  // 機能： 結果を表示
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showResult = () => {
    // 結果を表示させる
    new Result(jsonData.result ?? "", this._resultList);
  }

  //----------------------------------------------------
  // 機能： リスタートする
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _restart = () => {
    document.querySelector(Const.SELECTOR_PARENT)!.innerHTML = '';

    // 次に進むイベント発火(渡すパラメータ option: trueの時オプションあり、falseのときオプションなし)
    window.dispatchEvent(new CustomEvent(Const.EVENT_START, { bubbles: true,
      detail: { option: false}}));
  }
}

new EgELearning();


// const template =
// ` <template id="my-paragraph">
//     <style>
//       p {
//         background: #eee;
//         color: blue;
//       }
//       ::slotted(ul) {
//         color: red;
//       }
//     </style>
//     <p><slot name="my-text">DEFALUT TEXT</slot></p>
//   </template>`;

// const temp2 =
//   ` <template id="my-texttemp">
//   <style>
//     p {
//       background: #eff;
//       color: yello;
//     }
//   </style>
//   <p>テキストテキスト！！！！<p>
//   <p><slot name="my-text2">規定値</slot></p>
// </template>`;

// const html =
// ` <my-paragraph>
//     <span slot="my-text">NEW TEXT</slot>
//   </my-paragraph>
//   <my-paragraph>
//   </my-paragraph>
//   <my-paragraph>
//     <my-texttemp slot="my-text"><p slot="my-text2">wwwww</p></my-texttemp>
//   </my-paragraph>
//   <my-paragraph>
//     <ul slot="my-text"><li>aaa</li><li>bbb</li></slot>
//   </my-paragraph>`;

// export class MyParagraph extends HTMLElement {
//   constructor() {
//     super();
//     const template = document.getElementById('my-paragraph');
//     const templateContent = (<HTMLTemplateElement>template).content;
//     const shadowRoot = this.attachShadow({mode: 'open'});
//     shadowRoot.appendChild(templateContent.cloneNode(true));
//   }
// }

// const container: HTMLElement = <HTMLElement>document.querySelector(Const.Html.SELECTOR_SIMU_CONTAINER);
// container.insertAdjacentHTML('afterbegin', <any>template);
// container.insertAdjacentHTML('afterbegin', <any>temp2);
// container.insertAdjacentHTML('afterbegin', html);

// customElements.define('my-paragraph', MyParagraph);

// export class MyParagraph2 extends HTMLElement {
//   constructor() {
//     super();
//     const shadowRoot = this.attachShadow({mode: 'open'});
//     shadowRoot.appendChild((<HTMLTemplateElement>document.getElementById('my-texttemp')).content.cloneNode(true));
//   }
// }
// customElements.define('my-texttemp', MyParagraph2);

