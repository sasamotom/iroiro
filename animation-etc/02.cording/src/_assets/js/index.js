// import test from './utils/test';
// import igarashi_san from './utils/igarashi_san';
// import Person from './class/Person';

// test.foo();
// test.bar();

// igarashi_san();

// let es6 = new Person('ECMAScript 2015');
// es6.sayHello();

import Vivus from 'vivus';
import AOS from 'aos';
import "intersection-observer";  // IE用の記述


// SVGアニメーションページの場合
if (document.querySelector('body').classList.contains('page-svg')) {
  // === === === === ===
  // npm i vivus
  // === === === === ===
  new Vivus('cat', {start: 'autostart', type: 'oneByOne', duration: 100});
  // new Vivus('Frontend', { duration: 100 , start: 'autostart', pathTimingFunction: Vivus.EASE_OUT,}, function(obj){
  //   obj.el.classList.add('fill');
  // });
}

// SVGマスクページの場合
if (document.querySelector('body').classList.contains('page-svg2')) {
  // SVGマスクとは関係ないが、IntersectionObserverを使っているのでその設定
  // オプション設定
  const options = {
    root: null,
    rootMargin: "0% 0% 0% 0%", //ブラウザ画面の下から-20%の位置をターゲットと交差する位置に指
    // threshold: 0.3, //指定した要素が画面に30%入るとコールバックイベント発生
    threshold: 0
  };

  // Intersection Observer
  const observer = new IntersectionObserver(callback, options);
  observer.observe(document.querySelector('.anime01'));

  // 要素が交差したときに実行する命令
  function callback(entries) {
    entries.forEach(entry => {
      // 該当範囲内の場合は表示、範囲外のときは非表示
      if (entry.isIntersecting) {
        // entry.target.classList.add("show");
        entry.target.setAttribute('class', 'show'); // IEはsvgにクラスをaddできないらしく、このように記述する。
      }
      else {
        // entry.target.classList.remove('show');
        entry.target.setAttribute('class', '');
      }
    });
  };
}

// AOSページの場合
if (document.querySelector('body').classList.contains('page-aos')) {
  // === === === === ===
  // npm i aos
  // === === === === ===
  AOS.init();
}

// Web Animation APIページの場合
if (document.querySelector('body').classList.contains('page-webanimation')) {
  const ball = document.getElementById('ball').animate([
    {'transform': 'translate(0)'},
    {'transform': 'translate(850px)'}
  ], {
      duration: 3000,
      easing: 'ease',
      // iterations: Infinity
    }
  );
  ball.pause();

  const play = document.getElementById('play');
  const pause = document.getElementById('pause');
  const reset = document.getElementById('reset');
  const reverse = document.getElementById('reverse');
  const x2 = document.getElementById('x2');
  play.addEventListener('click', () => {
    ball.play();
  });
  pause.addEventListener('click', () => {
    ball.pause();
  });
  reset.addEventListener('click', () => {
    ball.currentTime = 0;
    ball.playbackRate = 1;  // この値が1のときは通常の速さ。マイナスの値にすると逆方向に再生。
  });
  reverse.addEventListener('click', () => {
    ball.reverse();
  });
  x2.addEventListener('click', () => {
    ball.playbackRate *= 2;
    ball.paly();
  });
}




// Intersection Observerページの場合
if (document.querySelector('body').classList.contains('page-intersection')) {
  //監視したい要素を取得
  const target = document.querySelectorAll('.sec')
  const targetArray = Array.prototype.slice.call(target);

  //オプション設定
  const options = {
      root: null,
      // rootMargin: "0% 0% -20% 0%", //ブラウザ画面の下から-20%の位置をターゲットと交差する位置に指定
      // rootMargin: "0px 0px",
      rootMargin: '0% 0% -30% 0%',
      // threshold: 0.3, //指定した要素が画面に30%入るとコールバックイベント発生
      threshold: 0
  };

  //Intersection Observer
  const observer = new IntersectionObserver(callback, options)
  targetArray.forEach((tgt) => {
    observer.observe(tgt);
  });

  //要素が交差したときに実行する命令
  function callback(entries) {
    entries.forEach(entry => {
      // 該当範囲内の場合は表示、範囲外のときは非表示
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
      else {
        entry.target.classList.remove('show');
      }

      // ヘッダーのリンクを、現在いる位置がわかるようにする
      if (entry.isIntersecting) {
        const currentActiveIndex = document.querySelector("#gnav-nav .active");
        // すでにアクティブになっているものが0個の時（=null）以外は、activeクラスを除去
        if (currentActiveIndex !== null) {
          currentActiveIndex.classList.remove("active");
        }
        // 引数で渡されたDOMが飛び先のaタグを選択し、activeクラスを付与
        const newActiveIndex = document.querySelector(`a[href='#${entry.target.id}']`);
        newActiveIndex.classList.add("active");
      }

      // 最初の１回だけアニメーションさせて、その後はそのまま表示させたままにしたい場合
      // if (entry.intersectionRatio > 0) {
      //   entry.target.classList.add('show');
      //   // ターゲット要素の監視を停止
      //   observer.unobserve(entry.target);
      // }
    });
  };
}
