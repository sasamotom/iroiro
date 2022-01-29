import Const from "../utils/Utils";

// 定数
namespace ResPercentConst {
  // export const HTML_ID_BUTTON = 'restartBtn';
}

// *****************************************************
// 結果（パーセント）のクラス
// *****************************************************
export class ResultsPercent {
  private _parentElem! : HTMLElement;   // 親要素
  private _percentData: string[][];     // 表に設定するテキストのデータ

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: selectedData            結果に関するjsonデータ
  // 戻値： なし
  //----------------------------------------------------
  constructor(selectedData: any) {
    // 配列を初期化
    this._percentData = new Array();
    for (let i = 0; i <= selectedData.person.length; i++) {
      this._percentData.push(new Array(selectedData.person.length + 1));
    }
    this._percentData[0][0] = '';

    // ヘッダー部分の値を作成
    for (let i = 0; i < selectedData.person.length; i++) {
      const head = `<span>${selectedData.person[i].name}さん</span><img src="/_assets/images/img_${selectedData.person[i].id}.jpg" alt="${selectedData.person[i].name}さん">`
      this._percentData[i + 1][0] = head;
      this._percentData[0][i + 1] = head;
      this._percentData[i + 1][i + 1] = `<div class="picSpace"><img src="/_assets/images/img_${selectedData.person[i].id}.jpg" alt="${selectedData.person[i].name}さん"></div>`;
    }

    // 一致度を調べる
    for (let person = 0; person < selectedData.person.length; person++) {
      const myData = selectedData.person[person].results;
      for (let i = person + 1; i < selectedData.person.length; i++) {
        const targetData = selectedData.person[i].results;
        let synchro = 0;
        for (let j = 0; j < targetData.length; j++) {
          if (myData[j].ans === targetData[j].ans) {
            synchro++;
          }
        }
        const result = Math.floor(synchro * 100 / targetData.length).toString();
        this._percentData[person + 1][i + 1] = result;
        this._percentData[i + 1][person + 1] = result;
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
    if (!document.querySelector(Const.Selector.RESULTS_PERCENT)) {
      console.log(Const.Selector.RESULTS_PERCENT + 'セレクタが無いため、表示できません。');
      return;
    }

    // divを親要素として持つHTMLの作成
    this._parentElem = document.createElement('div');
    this._parentElem.innerHTML = this._getHmtl();

    // 要素表示
    document.querySelector(Const.Selector.RESULTS_PERCENT)!.appendChild(this._parentElem);
  }

  //----------------------------------------------------
  // 機能： htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getHmtl = () => {
    let str: string = "";   // htmlの文字列

    str = str +
      `<div class="container percentContainer">
        <p class="resultsTtl">みんなの結果</p>
        <table class="percentList">`;

    // １行目部分
    str = str +
          `<tr class="head">`;
    for (let i = 0; i < this._percentData[0].length; i++) {
      str = str + `
            <th>${this._percentData[0][i]}</th>`;
    }
    str = str + `
          </tr>`;

    // 2行目以降
    for (let row = 1; row < this._percentData[0].length; row++) {
      str = str +
          `<tr>`;
      for (let col = 0; col < this._percentData[row].length; col++) {
        if (col === 0) {
          str = str + `
            <th>${this._percentData[row][col]}</th>`;
        }
        else if (this._percentData[row][col].startsWith('<') === true) {
          str = str + `
            <td>${this._percentData[row][col]}</td>`;
        }
        else {
          str = str + `
            <td data-per="${this._percentData[row][col].padStart(3, '0')}">${this._percentData[row][col]}%</td>`;
        }
      }
      str = str + `
          </tr>`;
    }

    str = str +
      `  </table>
      </div>`;

    return str;
  }
}
