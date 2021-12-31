// *****************************************************
// パラメータのクラス（KEYの記述部分をパラメータ値にするために使用する）
// *****************************************************
export class EventInfo {
  public type: string;        // イベントタイプ（'click'や'change'など）
  public elementId: string;   // イベントを登録する要素
  public dispatch: string;    // 発火させたいイベント

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: type      イベントタイプ（'click'や'change'など）
  //      elementId イベントを登録する要素
  //      dispatch  発火させたいイベント
  // 戻値： なし
  //----------------------------------------------------
  constructor(type: string, elementId: string, dispatch: string) {
    // データを保存
    this.type = type;
    this.elementId = elementId;
    this.dispatch = dispatch;
  }
}
