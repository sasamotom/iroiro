import Const from "../utils/Utils";

// 定数
namespace ResPointConst {
  // export const HTML_ID_BUTTON = 'restartBtn';
}

// *****************************************************
// 選択されたデータ情報
// *****************************************************
class _ChoicedData {
  private _point: number;       // 選択された数
  private _contents: string;    // 選択肢のテキスト
  private _code: string;        // コード

  get point(): number {
    return this._point;
  }
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
    this._point = 0;
    this._contents = contents;
    this._code = code;
  }

  //----------------------------------------------------
  // 機能： 選択された数を増やす
  // 引数: なし
  // 戻値： なし
  //----------------------------------------------------
  public plusPoint() {
    this._point++;
  }
}

// *****************************************************
// 回答票数のクラス
// *****************************************************
export class ResultsPoint {
  private _parentElem! : HTMLElement;   // 親要素
  private _choicedData: _ChoicedData[][];   // 選択された回答データ配列
  private _questionsData!: any;             // 質問に関するjsonデータ

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: selectedData            結果に関するjsonデータ
  //      questionsData           質問に関するjsonデータ
  // 戻値： なし
  //----------------------------------------------------
  constructor(selectedData: any, questionsData: any) {
    this._questionsData = questionsData;

    // まず回答として選択できるものを配列にセット
    this._choicedData = new Array();
    for (let i = 0; i < questionsData.questions.length; i++) {
      const array = new Array();
      for (let j = 0; j < questionsData.questions[i].choices.length; j++) {
        array.push(new _ChoicedData(questionsData.questions[i].choices[j].text, questionsData.questions[i].choices[j].code))
      }
      this._choicedData.push(array);
    }

    // 個人の回答をチェックして、選択数をセット
    for (let i = 0; i < selectedData.person.length; i++) {
      for (let j = 0; j < selectedData.person[i].results.length; j++) {
        const ans = selectedData.person[i].results[j].ans;
        for (let k = 0; k < this._choicedData[j].length; k++) {
          if (this._choicedData[j][k].code === ans) {
            this._choicedData[j][k].plusPoint();
            break;
          }
        }
      }
    }

    // 各質問で、回答が多い順に並び替え
    for (let i = 0; i < this._choicedData.length; i++) {
      for (let j = 0; j < this._choicedData[i].length; j++) {
        for (let k = j + 1; k < this._choicedData[i].length; k++) {
          if (this._choicedData[i][j].point < this._choicedData[i][k].point) {
            const bigger: _ChoicedData = this._choicedData[i][k];
            this._choicedData[i][k] = this._choicedData[i][j];
            this._choicedData[i][j] = bigger;
          }
        }
      }
    }

    // 配列の中で数が0のものは削除
    for (let i = 0; i < this._choicedData.length; i++) {
      for (let j = this._choicedData[i].length - 1; j >= 0; j--) {
        if (this._choicedData[i][j].point < 1) {
          // 削除
          this._choicedData[i].pop();
        }
        else {
          break;
        }
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
    if (!document.querySelector(Const.Selector.RESULTS_POINT)) {
      console.log(Const.Selector.RESULTS_POINT + 'セレクタが無いため、表示できません。');
      return;
    }

    // divを親要素として持つHTMLの作成
    this._parentElem = document.createElement('div');
    this._parentElem.innerHTML = this._getHmtl();

    // 要素表示
    document.querySelector(Const.Selector.RESULTS_POINT)!.appendChild(this._parentElem);
  }

  //----------------------------------------------------
  // 機能： htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getHmtl = () => {
    let str: string = "";   // htmlの文字列

    str = str +
      `<div class="container pointsContainer">
        <p class="resultsTtl">回答の割合</p>
        <ul class="pointList">`;

    // 結果部分
    for (let i = 0; i < this._choicedData.length; i++) {
      str = str + `
          <li>
            <dl class="points">
              <dt class="points_no">${(i + 1).toString().padStart(2, '0')}</dt>
              <dd class="points_svg">`;
      // グラフ部分
      str = str + this._getGraph(this._choicedData[i]);

      str = str + `
                <p>${this._questionsData.questions[i].text}</p>
              </dd>
              <dd class="points_ans">
                <ul>`;

        // 選ばれた選択肢を表示
        for (let j = 0; j < this._choicedData[i].length; j++) {
          str = str + `<li>${this._choicedData[i][j].contents}</li>`;
        }

        str = str +
                `</ul>
              </dd>
            </dl>
          </li>`;
    }

    str = str +
      `  </ul>
      </div>`;

    return str;
  }

  //----------------------------------------------------
  // 機能： グラフのhtml（svg）を取得する
  // 引数： data  グラフの元となるデータ
  // 返値： なし
  // 参考： http://defghi1977.html.xdomain.jp/tech/svgMemo/svgMemo_03.htm
  //      構文は「A rx,ry x-axis-rotation large-arc-flag,sweep-flag x,y」
  //----------------------------------------------------
  private _getGraph = (data: _ChoicedData[]) => {
    // 初めに合計値を求める
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + data[i].point;
    }

    // htmlを作成
    const strokeWidth = 10;   // 線の太さ
    const rx = 30;        // 水平方向半径
    const ry = 30;        // 垂直方向半径
    const rotation = 0;   // 傾き
    const sweepFlag = 1;  // 円弧の方向 時計回りの場合は1、半時計回りの場合は0
    const paddingx = 10;  // 水平方向余白
    const paddingy = 10;  // 垂直方向余白

    let str = `<svg viewBox="0 0 ${(rx + paddingx) * 2} ${(ry + paddingy) * 2}">
    <g fill="none" stroke-width="${strokeWidth}">`;

    // SVGをごりごり作る。
    let arcFlag = 0;    // 円弧の長い方を採用する場合は1、短い方の場合は0
    let startx = paddingx + rx;   // x軸の開始位置
    let starty = paddingy;        // y軸の開始位置
    let endx = paddingx + rx;     // x軸の終了位置
    let endy = paddingy;          // y軸の終了位置

    let sum = 0;  // 計算済みのポイント数

    for (let i = 0; i < data.length; i++) {
      // 弧の長い方を使うか短い方を使うか
      if (data[i].point * 2 > total) {
        arcFlag = 1;
      }
      else {
        arcFlag = 0;
      }

      // 角度を求める
      const rad = (sum + data[i].point) * 2 * Math.PI / total;

      // 終了位置を求める
      if (i !== data.length - 1) {
        endx = paddingx + rx + rx * (Math.sin(rad));
        endy = paddingy + ry - ry * Math.cos(rad);
      }
      else {
        // 最後のデータの場合は、スタート位置に戻る
        endx = paddingx + rx;
        endy = paddingy;
      }

      // htmlに反映
      str = str + `<path d="M ${startx},${starty} A ${rx},${ry} ${rotation} ${arcFlag},${sweepFlag} ${endx},${endy}" stroke="currentColor"/>`;

      // 次のために、今回の終了位置を保存
      sum = sum + data[i].point;
      startx = endx;
      starty = endy;
    }
    str = str + `</g>
    </svg>`;

    return str;
  }
}
