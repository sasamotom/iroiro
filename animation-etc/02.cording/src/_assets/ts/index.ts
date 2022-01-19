

import { Kurukuru } from "./class/Kurukuru";
import { Kurukuru2 } from "./class/Kurukuru2";

// くるくるページの場合
if (document.querySelector('body')!.classList.contains('page-kurukuru') || document.querySelector('body')!.classList.contains('page-kurukuru2')) {
  new Kurukuru2(11, 'picList', 'btnRight', 'btnLeft');
}
