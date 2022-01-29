export default class EmbedPDF {
  constructor() {
    const url = "/_assets/pdf/dummy.pdf";
    const pdfjsLib = require("pdfjs-dist/build/pdf");

    // pdf.worker.min.js の読み込み
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.min.js";

    // PDF の非同期ダウンロード
    const loadingTask = pdfjsLib.getDocument(url);

    loadingTask.promise.then((pdf) => {
      console.log("PDF loaded");

      // 最初のページを取得
      const pageNumber = 1;
      pdf.getPage(pageNumber).then((page) => {
        console.log("Page loaded");

        const scale = 1.5;
        const viewport = page.getViewport({scale: scale});

        // PDF ページの寸法を使用してキャンバスを準備する
        const canvas = document.getElementById("the-canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // PDF ページをキャンバスコンテキストにレンダリングする
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          console.log("Page rendered");
        });
      });
    }, (reason) => {
      // PDF の読み込みエラー
      console.error(reason);
    });
  }
}
