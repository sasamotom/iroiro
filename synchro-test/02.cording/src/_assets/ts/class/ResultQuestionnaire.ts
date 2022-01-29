import Const from "../utils/Utils";

// 定数
namespace ResConst {
  // export const HTML_ID_BUTTON = 'restartBtn';
  export const HTML_ID_TEXTAREA = 'resulttextarea';
}

// *****************************************************
// アンケート結果のクラス
// *****************************************************
export class ResultQuestionnaire {
  private _parentElem! : HTMLElement;   // 親要素
  private _codes: string[];

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: codes        結果
  // 戻値： なし
  //----------------------------------------------------
  constructor(codes: string[]) {
    // データを保存
    this._codes = codes;

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
  }

  //----------------------------------------------------
  // 機能： htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getHmtl = () => {
    let json = '';  // 選択したものから作成したjsonテキスト
    json = json + '{\n  "id": "xxxx",\n  "name": "xxxx",\n';
    json = json + '  "results": [';
    for (let i = 0; i < this._codes.length; i++) {
      json = json + `{"qid": "q${i + 1}", "ans": "${this._codes[i]}"}`;
      if (i < this._codes.length - 1) {
        json = json + ', ';
      }
    }
    json = json + "]\n}";
    console.log(json);

    let str: string = '';   // htmlの文字列
    str = str +
      `<div class="resultContainer">
        <div class="container">
          <div class="resultQuestionnaire" id="resultQuestionnaire">
            <div class="thankspic"><img src="/_assets/images/pic_thanks.svg"></div>
            <p class="text2">ご協力ありがとうございました！</p>
            <p class="msg2">下記テキストエリアの文字列をご共有くださいませ。<br>お手数をお掛け致しますが、宜しくお願いいたします。</p>
            <textarea id="${ResConst.HTML_ID_TEXTAREA}" name="resulttxt", rows="10">${json}</textarea>
          </div>
        </div>
      </div>`;

    return str;
  }
}
