import Const from "../utils/Utils";

// 定数
namespace ResConst {
  export const HTML_ID_BUTTON = 'restartBtn';
}

// *****************************************************
// 個人データ
// *****************************************************
class _Person {
  private _id: string;        // ID
  private _name: string;      // 名前
  private _point: number;     // シンクロ度（0〜100）

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get point(): number {
    return this._point;
  }

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: id      ID
  //      name    名前
  //      point   シンクロ度
  // 戻値： なし
  //----------------------------------------------------
  constructor(id: string, name: string, point: number) {
    this._id = id;
    this._name = name;
    this._point = point;
  }
}

// *****************************************************
// 結果のクラス
// *****************************************************
export class Result {
  private _parentElem! : HTMLElement;   // 親要素
  private _mySelectedData: string[];    // 自分の選択したデータ配列
  private _personData: _Person[];       // 各個人のデータ

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: data              結果に関するjsonデータ
  //      mySelectedData    自分の選択したデータ配列
  // 戻値： なし
  //----------------------------------------------------
  constructor(data: any, mySelectedData: string[]) {
    // データを保存
    this._mySelectedData = mySelectedData;

    // 全員とのシンクロ度を計算し、データを保存する
    this._personData = new Array();
    for (let i = 0; i < data.person.length; i++) {
      const p = data.person[i];
      let synchro = 0;
      // 自分自身の結果は飛ばす
      if (location.search === '?' + p.id) {
        continue;
      }
      for (let j = 0; j < p.results.length; j++) {
        if (this._mySelectedData[j] === p.results[j].ans) {
          synchro++;
        }
      }
      this._personData.push(new _Person(p.id, p.name, Math.floor(synchro * 100 / p.results.length)));
    }

    // 配列をシンクロ度が高い順に並び替える
    for (let i = 0; i < this._personData.length; i++) {
      for (let j = i + 1; j < this._personData.length; j++) {
        if (this._personData[i].point < this._personData[j].point) {
          const bigger: _Person = this._personData[j];
          this._personData[j] = this._personData[i];
          this._personData[i] = bigger;
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
    if (!document.querySelector(Const.Selector.PARENT)) {
      console.log(Const.Selector.PARENT + 'セレクタが無いため、表示できません。');
      return;
    }

    // divを親要素として持つHTMLの作成
    this._parentElem = document.createElement('div');
    this._parentElem.innerHTML = this._getHmtl();

    // 要素表示
    document.querySelector(Const.Selector.PARENT)!.appendChild(this._parentElem);

    // リスタートボタン押下イベント登録
    document.getElementById(ResConst.HTML_ID_BUTTON)!.addEventListener('click', this._restart);

    // 自分の結果のjsonデータをコンソールに表示
    let json = '';
    json = json + '"results": [';
    for (let i = 0; i < this._mySelectedData.length; i++) {
      json = json + `{"qid": "q${i + 1}", "ans": "${this._mySelectedData[i]}"}`;
      if (i < this._mySelectedData.length - 1) {
        json = json + ', ';
      }
    }
    json = json + "]";
    console.log(json);

    // 下にスクロールする
    // window.scrollTo({
    //   top: this._parentElem.getBoundingClientRect().top + window.pageYOffset - 100,
    //   behavior: 'smooth'
    // });
  }

  //----------------------------------------------------
  // 機能： リスタートイベント発火
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _restart = () => {
    // リスタートボタンの監視を解除
    document.getElementById(ResConst.HTML_ID_BUTTON)!.removeEventListener('click', this._restart);
    // イベント発火（リスタートイベント）
    window.dispatchEvent(new Event(Const.Event.RESTART));
  }

   //----------------------------------------------------
  // 機能： htmlを取得する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _getHmtl = () => {
    let str: string = "";   // htmlの文字列

    str = str +
      `<div class="resultContainer">
        <div class="container">
          <div class="result" id="result">
            <p class="ttl"><span>MATCHING<br>PERCENTAGE</span></p>
            <ul class="percentList">`;

    // 結果部分
    let percent = this._personData[0].point;
    str = str +
              `<li>
                <dl class="person -top">
                  <dt class="person_percent">${percent}%</dt>
                  <dd class="person_data">`;
    for (let i = 0; i < this._personData.length; i++) {
      if (percent !== this._personData[i].point) {
        str = str +
                  `</dd>
                </dl>
              </li>`;
        str = str +
              `<li>
                <dl class="person">
                  <dt class="person_percent">${this._personData[i].point}%</dt>
                  <dd class="person_data">`;
      }
      str = str +
                  `<div class="person_detail">
                    <div class="person_pic"><img src="/_assets/images/img_${this._personData[i].id}.jpg" alt="${this._personData[i].name}"></div>
                    <p class="person_name">${this._personData[i].name}さん</p>
                  </div>`;
      percent = this._personData[i].point;
    }
    str = str +
                  `</dd>
                </dl>
              </li>`;

    str = str +
            `</ul>
            <div class="restartBtn" id="restartBtn">RESTART</div>
          </div>
          <p class="footerLink"><a href="./results/" target="_blank">みんなの結果をみる</a></p>
        </div>
      </div>`;

    return str;
  }
}
