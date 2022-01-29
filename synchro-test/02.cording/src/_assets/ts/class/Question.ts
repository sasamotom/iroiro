import { Utils } from "../utils/Utils";
import Const from "../utils/Utils";

// 定数
namespace QuestConst {
  export const HTML_ID_NEXT = 'nextbtn';
}

// *****************************************************
// 選択肢データ
// *****************************************************
class _Choice {
  private _contents: string;    // 選択肢のテキスト
  private _code: string;        // コード

  get contents(): string {
    return this._contents;
  }
  get code(): string {
    return this._code;
  }

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: contents   選択肢のテキスト
  //      code       回答のコード
  // 戻値： なし
  //----------------------------------------------------
  constructor(contents: string, code: string) {
    this._contents = contents;
    this._code = code;
  }
}

// *****************************************************
// 質問クラス
// *****************************************************
export class Question {
  private _parentElem! : HTMLElement; // 親要素
  private _no: number;                // 質問No（1〜）
  private _text: string;              // 質問文
  private _type: string;              // 選択肢のタイプ（radioまたはcheckbox）
  private _choices: _Choice[];        // 選択肢の配列
  private _shuffle: boolean;          // シャッフルするかどうか（true: シャッフルする、false: シャッフルしない）
  private _last: boolean;             // 最後かどうか（true: 最後、false: 最後ではない）
  private _choiceIndexs: number[];    // 選択肢の表示順

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: no        質問No
  //      data      質問に関するjsonデータ
  //      shuffle   シャッフル機能を使用するかどうか（true: 使用する、false: 使用しない）
  //      last      最後の問題であるかどうか（true: 最後、false: 最後ではない）
  // 戻値： なし
  //----------------------------------------------------
  constructor(no: number, data: any, shuffle?: boolean, last?: boolean) {
    // データを保存
    this._no = no;
    this._text = data.text ?? '';
    this._type = data.type ?? 'radio';
    this._last = last ?? false;
    this._shuffle = (shuffle ?? false) === true ? true : false;

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
        this._choices.push(new _Choice(c.text ?? '', c.code ?? ''));
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
    if (!document.querySelector(Const.Selector.PARENT)) {
      console.log(Const.Selector.PARENT + 'セレクタが無いため、表示できません。');
      return;
    }

    // divを親要素として持つHTMLの作成
    this._parentElem = document.createElement('div');
    this._parentElem.innerHTML = this._getHmtl();

    // 要素表示
    document.querySelector(Const.Selector.PARENT)!.appendChild(this._parentElem);

    // 選択肢の変更監視要素
    const element: HTMLElement = document.getElementById(`q${this._no}`)!;
    element.addEventListener('change', this._showNextBtn);
  }

  //----------------------------------------------------
  // 機能： 次へボタンを表示する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showNextBtn = () => {
    // inputの変更監視を解除
    document.getElementById(`q${this._no}`)!.removeEventListener('change', this._showNextBtn);
    // 次へボタンの表示
    const nextBtn = document!.getElementById(`${QuestConst.HTML_ID_NEXT}${this._no}`)!;
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
    document.getElementById(`${QuestConst.HTML_ID_NEXT}${this._no}`)!.removeEventListener('click', this._goNext);
    // 次へボタンを非表示
    // document.getElementById(`${Const.HTML_ID_NEXT}${this._no}`)!.classList.add('hidden');

    // 質問を消す
    document.getElementById(`questionContainer${this._no}`)!.classList.add('remove');

    // 選択したラジオボタンのコード取得＆inputの変更を不可とする
    const inputs = (document.getElementById(`q${this._no}`)!).querySelectorAll('input')!;
    let resultCode = '';
    for (let i = 0; i < inputs.length; i++) {
      // 選択したラジオボタンのコード取得
      if (inputs[i].checked === true) {
        resultCode = inputs[i].value;
      }
      // inputの変更を不可とする
      inputs[i].disabled = true;
    }

    // イベント発火（回答を送る）
    window.dispatchEvent(new CustomEvent(Const.Event.NEXT, { bubbles: true,
      detail: { no: this._no, code: resultCode }}));
  }

  //----------------------------------------------------
  // 機能： htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getHmtl = () => {
    let str: string = "";   // htmlの文字列

    str = str +
    `<div class="questionContainer" id="questionContainer${this._no}">
      <div class="container">
        <div class="question">
          <p class="qNo">${this._no.toString().padStart(2, '0')}</p>
          <p class="qText">${this._text}</p>`;

    // 選択肢部分
    str = str +
          `<ul class="qList" id="q${this._no}">`;
    for (let i = 0; i < this._choices.length; i++) {
      str = str +
            `<li>
              <input
                name="${this._type}q${this._no}"
                type="${this._type}"
                id="q${this._no}-${i}"
                value="${this._choices[i].code}"
              />
              <label for="q${this._no}-${i}">
                ${this._choices[i].contents}
              </label>
            </li>`;
    }
    str = str +
          `</ul>`;

    if (this._last === true) {
      str = str +
          `<div class="nextBtn finish" id="${QuestConst.HTML_ID_NEXT}${this._no}"><span>FINISH!</span></div>`;
    }
    else {
      str = str +
          `<div class="nextBtn" id="${QuestConst.HTML_ID_NEXT}${this._no}"><span>NEXT</span></div>`;
    }
    str = str +
        `</div>
      </div>
    </div>`;

    return str;
  }
}
