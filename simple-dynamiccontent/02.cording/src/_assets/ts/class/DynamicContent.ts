import { Utils } from "../utils/Utils";
import { ParamSet } from "./ParamSet";
import { EventInfo } from "./EventInfo";

// *****************************************************
// 動的コンテンツのクラス
// *****************************************************
export class DynamicContent {
  protected _element!: HTMLElement;     // 要素
  protected _id: string;                // divのID（初期値 空）
  protected _parentId: string;          // htmlを入れる領域（親となる領域）のID
  protected _html: string;              // html文
  protected _eventInfo: EventInfo[];    // イベント情報

  //----------------------------------------------------
  // 機能： コンストラクタ
  // 引数: parentId      htmlを入れる領域（親となる領域）のID
  //       html          html文
  //       paramSet      置換パラメータ
  // 戻値： なし
  //----------------------------------------------------
  constructor(parentId: string, html: string, paramSet?: ParamSet[]) {
    // データを保存
    this._parentId = parentId;
    this._html = html;
    this._id = '';
    this._eventInfo = new Array();
    // htmlの設定
    this.setHmtl(html, paramSet);
  }

  //----------------------------------------------------
  // 機能： 表示する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  public show = () => {
    this._element.style.display = 'block;'         // 表示する
  }

  //----------------------------------------------------
  // 機能： 消す
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  public delete = () => {
    // 既に存在していない場合は、何もしない
    if (this._id = '') {
      return;
    }

    // イベントの削除をしておく
    for (let i = 0; i < this._eventInfo.length; i++) {
      // イベントの削除
      document.getElementById(this._eventInfo[i].elementId)!.removeEventListener(this._eventInfo[i].type, this._dispatchEvent);
    }
    this._eventInfo = [];

    // 要素の削除
    this._element.remove();
    this._id = '';    // IDのリセット
  }

  //----------------------------------------------------
  // 機能： htmlを更新する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  public setHmtl = (html: string, paramSet?: ParamSet[]) => {
    this._html = html;
    // パラメーターがある時は置換
    if (paramSet) {
      this._replace(paramSet);
    }
    // 要素を追加する
    this._addElement();
  }

  //----------------------------------------------------
  // 機能： 要素を追加する
  // 引数： なし
  // 返値： なし
  //----------------------------------------------------
  private _addElement = () => {
    // 描画する領域があるのか確認し、なければ何もしない
    if (!document.getElementById(this._parentId)) {
      console.log('ID=' + this._parentId + ' の要素が無いため、表示できません。');
      return;
    }
    // すでに表示済みの場合は何もしない
    if (this._id != '') {
      return;
    }

    // IDの取得
    this._id = Utils.getRandomId();

    // htmlを括るdivを作成
    if (!this._element) {
      this._element = document.createElement('div');
      this._element.setAttribute('id', this._id);   // ランダムなIDを付与しておく（今の所使用する予定は無いけど）
      this._element.style.display = 'none;'         // 非表示にする
    }

    // htmlをdivの中に入れる
    this._element.innerHTML = this._html;

    // 親要素の中に追加する
    document.getElementById(this._parentId)!.appendChild(this._element);
  }

  //----------------------------------------------------
  // 機能： html内のパラメータ値を置換する
  // 引数： paramSet  パラメータセット（配列）
  // 返値： なし
  //----------------------------------------------------
  private _replace = (paramSet: ParamSet[]) => {
    // keyをvalueに置換する
    for (let i = 0; i < paramSet.length; i++) {
      this._html = this._html.replace(paramSet[i].key, paramSet[i].value);
      this._html = this._html.split(paramSet[i].key).join(paramSet[i].value);
    }
  }

  //----------------------------------------------------
  // 機能： イベントを登録する
  // 引数： eventInfo イベント情報（配列）
  // 返値： なし
  //----------------------------------------------------
  public setEvents = (eventInfo: EventInfo[]) => {
    // イベントを監視し、発生時にはイベントを発火する
    for (let i = 0; i < eventInfo.length; i++) {
      // 要素の有無チェックし、無い場合は次に進む
      if (!document.getElementById(eventInfo[i].elementId)) {
        continue;
      }
      // イベント情報の保存
      this._eventInfo.push(eventInfo[i]);
      // イベントの登録
      document.getElementById(eventInfo[i].elementId)!.addEventListener(eventInfo[i].type, this._dispatchEvent);
    }
  }

  //----------------------------------------------------
  // 機能： イベントを発火する
  // 引数： e   イベント情報
  // 返値： なし
  //----------------------------------------------------
  private _dispatchEvent = (e: any) => {
    const id = e.target.id;   // 要素のID
    for (let i = 0; i < this._eventInfo.length; i++) {
      if (id === this._eventInfo[i].elementId) {
        // イベント発火
        window.dispatchEvent(new Event(this._eventInfo[i].dispatch));
        break;
      }
    }
  }
}
