import EmbedPDF from "./utils/EmbedPDF";

class Main {
  constructor() {
    new EmbedPDF()
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new Main();
});
