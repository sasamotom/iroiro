// *****************************************************
// くるくるアニメーション
// *****************************************************
export class Kurukuru2 {
  private _itemCnt: number;           // アイテム個数
  private _parentEle!: HTMLElement;   // アイテムを含む領域の要素
  private _frontNo: number;           // フロントNo（1〜）
  private _pos1stChild: number;       // 1番目の位置（初期値0、右に進む度に+1、左に進む度に-1）

  // ----------------------------------------------------
  // 機能： コンストラクタ
  // 引数： itemCnt       アイテム個数
  //      parentId      親要素のID
  //      toRightBtnId  右へ進むボタンのID
  //      toLeftBtnId   左へ進むボタンのID
  // 返値： なし
  // ----------------------------------------------------
  constructor(itemCnt: number, parentId: string, toRightBtnId?: string, toLeftBtnId?: string) {
    // データの保存
    this._itemCnt = itemCnt;
    this._frontNo = 1;
    this._pos1stChild = 0;
    if (!document.getElementById(parentId)) {
      console.log(parentId + 'の要素がありません。');
      return;
    }
    this._parentEle = document.getElementById(parentId)!;

    // 右へ進むボタンイベントを登録
    if (toRightBtnId) {
      if (document.getElementById(toRightBtnId)) {
        document.getElementById(toRightBtnId)!.addEventListener('click', () => {
          this._goRight();
        });
      }
    }
    // 左へ進むボタンイベントを登録
    if (toLeftBtnId) {
      if (document.getElementById(toLeftBtnId)) {
        document.getElementById(toLeftBtnId)!.addEventListener('click', () => {
          this._goLeft();
        });
      }
    }

    // PCのマウス対応
    this._mouse();
    // スマホのスワイプ対応
    this._swipe();
  }

  // ----------------------------------------------------
  // 機能： 右へ進む
  // 引数： なし
  // 返値： なし
  // ----------------------------------------------------
  private _goRight() {
    this._frontNo++;
    if (this._frontNo > this._itemCnt) {
      this._frontNo = 1;
    }
    this._pos1stChild++;
    this._parentEle.dataset.front = this._frontNo.toString();
    this._parentEle.style.setProperty('--base-deg', (-360 * this._pos1stChild / this._itemCnt) + 'deg');
  }

  // ----------------------------------------------------
  // 機能： 左へ進む
  // 引数： なし
  // 返値： なし
  // ----------------------------------------------------
  private _goLeft() {
    this._frontNo--;
    if (this._frontNo < 1) {
      this._frontNo = this._itemCnt;
    }
    this._pos1stChild--;
    this._parentEle.dataset.front = this._frontNo.toString();
    this._parentEle.style.setProperty('--base-deg', (-360 * this._pos1stChild / this._itemCnt) + 'deg');
  }

  // ----------------------------------------------------
  // 機能： マウス対応
  // 引数： なし
  // 返値： なし
  // ----------------------------------------------------
  private _mouse() {
    let startX: number;        // タッチ開始 x座標
    // let startY: number;        // タッチ開始 y座標
    let moveX: number;    // スワイプ中の x座標
    // let moveY: number;    // スワイプ中の y座標
    let dist = 30;    // スワイプを感知する最低距離（ピクセル単位）

    // タッチ開始時： xy座標を取得
    this._parentEle.addEventListener("mousedown", function(e) {
      e.preventDefault();
      startX = e.clientX;
      // startY = e.clientY;
    });

    // スワイプ中： xy座標を取得
    this._parentEle.addEventListener("mousemove", function(e) {
      e.preventDefault();
      moveX = e.clientX;
      // moveY = e.clientY;
    });

    // タッチ終了時： スワイプした距離から左右どちらにスワイプしたかを判定する/距離が短い場合何もしない
    this._parentEle.addEventListener("mouseup", (e) => {
      if (startX > moveX && startX > moveX + dist) {        // 右から左にスワイプ
        // 右から左にスワイプした時の処理
        this._goRight();
      }
      else if (startX < moveX && startX + dist < moveX) {    // 左から右にスワイプ
        // 左から右にスワイプした時の処理
        this._goLeft();
      }
    });
  }

  // ----------------------------------------------------
  // 機能： スワイプ対応
  // 引数： なし
  // 返値： なし
  // ----------------------------------------------------
  private _swipe() {
    let startX: number;        // タッチ開始 x座標
    // let startY: number;        // タッチ開始 y座標
    let moveX: number;    // スワイプ中の x座標
    // let moveY: number;    // スワイプ中の y座標
    let dist = 30;    // スワイプを感知する最低距離（ピクセル単位）

    // タッチ開始時： xy座標を取得
    this._parentEle.addEventListener("touchstart", function(e) {
      e.preventDefault();
      startX = e.touches[0].pageX;
      // startY = e.touches[0].pageY;
    });

    // スワイプ中： xy座標を取得
    this._parentEle.addEventListener("touchmove", function(e) {
      e.preventDefault();
      moveX = e.changedTouches[0].pageX;
      // moveY = e.changedTouches[0].pageY;
    });

    // タッチ終了時： スワイプした距離から左右どちらにスワイプしたかを判定する/距離が短い場合何もしない
    this._parentEle.addEventListener("touchend", (e) => {
      if (startX > moveX && startX > moveX + dist) {        // 右から左にスワイプ
        // 右から左にスワイプした時の処理
        this._goRight();
      }
      else if (startX < moveX && startX + dist < moveX) {    // 左から右にスワイプ
        // 左から右にスワイプした時の処理
        this._goLeft();
      }
    });
  }
}
