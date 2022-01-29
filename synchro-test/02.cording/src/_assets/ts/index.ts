import jsonMain from "./json/main.json";
import jsonPerson from "./json/person.json";
import { Utils } from "./utils/Utils";
import Const from "./utils/Utils";
import { FirstView } from "./class/FirstView";                            // 通常
import { FirstViewQuestionnaire } from "./class/FirstViewQuestionnaire";  // アンケート
import { Question } from "./class/Question";                              // 通常・アンケート共通
import { Result } from "./class/Result";                                  // 通常
import { ResultQuestionnaire } from "./class/ResultQuestionnaire";        // アンケート
import { ResultsPoint } from "./class/ResultsPoint";                      // 結果（票数）
import { ResultsPercent } from "./class/ResultsPercent";                  // 結果（パーセント）

// 定数
namespace MainConst {
  export const QUESTIONNAIRE_MODE = 'questionnaire';
  export const NORMAL_MODE = 'normal';
  export const RESULTS_MODE = 'results';
}

// *****************************************************
// 処理呼び出しメインクラス
// *****************************************************
export class SynchronicityTest {
  private _mode: string;                    // モード（アンケート or 通常）
  private _displayedQuestionCnt: number;    // 表示中の質問数
  private _resultList: string[];            // 回答リスト（回答コードの文字列配列）
  private _shuffle: boolean;                // シャッフルするかしないか（true: する、false: しない）
  private _questionIndexs: number[];        // 問題の呼び出し順
  private _log: boolean;                    // ログにいろいろ表示するかどうか（true: する、false: しない）

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: mode   アンケートモードか通常モードか（規定値：通常モード）
  // 戻値： なし
  //----------------------------------------------------
  constructor(mode?: string) {
    // 変数の初期化
    this._mode = mode ?? MainConst.NORMAL_MODE;
    this._displayedQuestionCnt = 0;
    this._resultList = new Array();
    this._shuffle = (jsonMain.shuffle === 'true');
    this._log = false;
    this._questionIndexs = new Array();
    for (let i = 0; i < jsonMain.questions.length; i++) {
      this._questionIndexs.push(i);
    }

    // イベント登録
    window.addEventListener(Const.Event.START,this._showFirstQuestion);
    window.addEventListener(Const.Event.NEXT,this._showNextQuestion);
    window.addEventListener(Const.Event.RESTART,this._restart);

    // FVの表示
    if (this._mode === MainConst.NORMAL_MODE) {
      new FirstView(jsonMain.theme ?? "");
    }
    else {
      new FirstViewQuestionnaire(jsonMain.theme ?? "");
    }
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

    // ログモードかどうかを取得
    if (e.detail.option === true) {
      this._log = true;
      console.log('******* ログモード *******');
    }

    // シャッフルするかしないかを取得
    // if (e.detail.option === true) {
    //   // jsonの値によらずシャッフルしない
    //   this._shuffle = false;
    // }

    // シャッフルする場合は、問題の呼び出し順をシャッフル
    // if (this._shuffle === true) {
    //   this._questionIndexs = Utils.shuffleArray(this._questionIndexs);
    // }

    // 質問を表示する
    if (this._displayedQuestionCnt < jsonMain.questions.length) {
      const last = (this._displayedQuestionCnt + 1 === jsonMain.questions.length);
      new Question(this._displayedQuestionCnt + 1, jsonMain.questions[this._questionIndexs[this._displayedQuestionCnt]], this._shuffle, last);
      this._displayedQuestionCnt++;
    }
  }

  //----------------------------------------------------
  // 機能： 次の問題を表示
  // 引数： e
  //        e.detail.code 選択した値
  // 返値： なし
  //----------------------------------------------------
  private _showNextQuestion = (e: any) => {
    // 結果を保存する
    this._resultList.push(e.detail.code);

    // ログモードの場合は、ログを表示する
    if (this._log === true) {
      this._showLog(e.detail.code);
    }

    if (this._displayedQuestionCnt < jsonMain.questions.length) {
      // 次の質問を表示する
      const last = (this._displayedQuestionCnt + 1 === jsonMain.questions.length);
      new Question(this._displayedQuestionCnt + 1, jsonMain.questions[this._questionIndexs[this._displayedQuestionCnt]], this._shuffle, last);
      this._displayedQuestionCnt++;
    }
    else {
      if (this._mode === MainConst.NORMAL_MODE) {
        // 結果を表示する
        this._showResult();
      }
      else {
        // アンケート結果jsonを表示する
        this._showResultQuestionnaire();
      }
    }
  }

  //----------------------------------------------------
  // 機能： 結果を表示
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showResult= () => {
    // 結果を表示させる
    new Result(jsonPerson, this._resultList);
  }

  //----------------------------------------------------
  // 機能： アンケート結果jsonを表示
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _showResultQuestionnaire= () => {
    // 結果を表示させる
    new ResultQuestionnaire(this._resultList);
  }

  //----------------------------------------------------
  // 機能： リスタートする
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _restart = () => {
    document.querySelector(Const.Selector.PARENT)!.innerHTML = '';

    // 開始イベント発火(渡すパラメータ option: trueの時オプションあり、falseのときオプションなし)
    window.dispatchEvent(new CustomEvent(Const.Event.START, { bubbles: true,
      detail: { option: false}}));
  }

  //----------------------------------------------------
  // 機能： ログを表示する
  // 引数： code  選択した選択肢のコード
  // 返値： なし
  //----------------------------------------------------
  private _showLog = (code: string) => {
    let same = '';
    // 同回答の人の名前を取得
    for (let i = 0; i < jsonPerson.person.length; i++) {
      if (jsonPerson.person[i].results[this._displayedQuestionCnt - 1].ans === code) {
        same = same + jsonPerson.person[i].name + ' ';
      }
    }
    // 問題
    let question = jsonMain.questions[this._displayedQuestionCnt - 1].text;
    // 自分が選んだ回答を取得
    let myAnswer = '';
    for (let i = 0; i < jsonMain.questions[this._displayedQuestionCnt - 1].choices.length; i++) {
      if (jsonMain.questions[this._displayedQuestionCnt - 1].choices[i].code === code) {
        myAnswer = jsonMain.questions[this._displayedQuestionCnt - 1].choices[i].text;
      }
    }
    console.log(`${question}：${myAnswer} / 同回答の人：${same}`);
  }
}

// 処理開始
if (document.getElementsByClassName('page-questionnaire').length > 0) {
  new SynchronicityTest(MainConst.QUESTIONNAIRE_MODE);  // アンケートモード
}
if (document.getElementsByClassName('results-point').length > 0) {
  new ResultsPoint(jsonPerson, jsonMain);
  new ResultsPercent(jsonPerson);
}
else {
  new SynchronicityTest();  // 通常モード
}

