export class Utils {
  //----------------------------------------------------
  // 機能： 配列をシャッフルする
  // 引数: sourceArr  元の配列
  // 戻値： シャッフルされた配列
  //----------------------------------------------------
  public static shuffleArray(sourceArr: Array<any>) {
    // 元の配列を複製
    const array = sourceArr.concat();
    const arrayLength = array.length;
    for (let i = arrayLength - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }
}
