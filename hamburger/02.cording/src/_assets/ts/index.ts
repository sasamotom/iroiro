// WebComponentsの右から出てくるverを使用する場合はこちら
import { Hamburger } from "./webcomponents/Hamburger";
customElements.define('hamburger-menu', Hamburger);

// WebComponentsの上から出てくるverを使用する場合はこちら
// import { HamburgerFromTop } from "./webcomponents/HamburgerFromTop";
// customElements.define('hamburger-menu', HamburgerFromTop);


// 静的なものを使用する場合はこちら（コメントアウトしてあるナビゲーションのhtmlを有効化する必要有ｒ）
// import { HamburgerMenu } from "./class/HamburgerMenu";
// new HamburgerMenu();
