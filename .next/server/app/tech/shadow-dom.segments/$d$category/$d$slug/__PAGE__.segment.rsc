1:"$Sreact.fragment"
2:I[8331,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],""]
3:I[17733,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"ViewCounter"]
4:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"MobileTableOfContents"]
d:I[72039,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"Image"]
3a:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"TableOfContents"]
3c:I[2718,["/_next/static/chunks/483a12865e0bba97.js","/_next/static/chunks/1d3be43a6dda29b7.js"],"OutletBoundary"]
3d:"$Sreact.suspense"
:HL["https://images.hexdrinker.dev/tech/shadow-dom/insane.png","image"]
5:T2605,


이번에 Pull Request Previewer 크롬 익스텐션을 개발하면서 최초로 iframe을 사용했다. 일단 내가 iframe을 제대로 써본 적이 없어서 그냥 써보고 싶었다. parent와 postMessage API를 통해 데이터를 주고 받는 통신 방식으로 인한 취약점이나 복잡함들이 불편하게 느껴져서 경험이 좋지 않았다.

일단 다른건 차치하더라도 패널 위치나 사이즈 조정하는데도 메시지를 보내야해서 답이 없다고 느꼈다. 그래서 Shadow DOM으로의 전환을 결심했고 Shadow DOM에 대해서 좀 공부하게 되었다. Shadow DOM에 대해서 처음 들어본 것도 아니고 개념은 어느 정도 알고 있었지만 알아본 것에 대해서 정리를 하고자 기록을 남겨본다.

## 👨🏻‍🏫 역사와 유래

Shadow DOM은 Google Chrome 팀이 2011년 무렵에 제안한 Web Components 기술 중 일부로 시작되었고 이후 W3C와 WHATWG에서 표준화를 진행했다.

| 연도      | 이벤트                                                        |
| --------- | ------------------------------------------------------------- |
| 2011      | Google에서 Web Components 개념 제안                           |
| 2013      | Chrome에 최초로 Shadow DOM v0 구현                            |
| 2016      | v1 발표, Safari, Firefox, Edge 등 주요 브라우저에서 채택 시작 |
| 2018 이후 | 대부분 브라우저가 v1 지원, v0은 폐기 수순                     |

Web Components의 아버지 Dimitri Glazkov의 [What the Heck is Shadow DOM?](https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/) 이란 제목의 블로그 글에 따르면 Shadow DOM의 등장 배경은 아래와 같다

> 기존에 웹 플랫폼에서는 코드 간의 격리를 위해 사용할 수 있는 유일한 내장 메커니즘은 iframe이었는데 이는 무겁고 제한적이었다. 대부분의 브라우저는 DOM의 **복잡한 세부 구현**을 숨기기 위해 강력한 기술을 사용하고 있었고 이것이 Shadow DOM이다.

예를 들어 브라우저는 `<input id="foo" type="range">` 이걸 단순히 태그 하나로 보여주지만 실제로는 내부에 여러 요소가 숨어있다. 저 태그를 렌더링할 때 아래와 같이 복잡한 구조로 만든다.

```
#shadow-root
  <div class="track">
    <div class="thumb"></div>
  </div>
```

이것이 위 인용구에서 말하는 **복잡한 세부 구현**이다. `<input id="foo" type="range" />` 는 내부적으로 슬라이더와 핸들 등 여러 요소가 있고 이런 구조는 브라우저마다 다르고 개발자 입장에서는 알 수 없고 건드릴 수도 없다. 즉, 브라우저가 처리하는 내부 구현을 Shadow DOM이란 기술로 감싸서 격리하고 숨긴 것이다.

구글은 브라우저 내에서만 쓰던 캡슐화 기법을 일반 개발자들도 쓸 수 있도록 API 형태로 공개하자고 제안했고 이것이 Web Components 사양의 일부로 나온 Shadow DOM이다.

<figure className='imageWrapper'>
  <img
    src='https://images.hexdrinker.dev/tech/shadow-dom/insane.png'
    alt='owner-of-shadow'
    width='80%'
  />
  <figcaption>도대체 얼마나 미친놈이에요? ㅋㅋㅋㅋ</figcaption>
</figure>

자 이제 Shadow DOM에 대해서 좀 더 알아보자.

## ⚡️ Shadow DOM이란?

Shadow DOM은 DOM 트리 내에 또 다른 숨겨진 DOM 트리를 생성하는 기술로, DOM 캡슐화를 통해 외부와 격리되어 자체적인 스타일과 구조를 가진 독립적인 컴포넌트를 만들 수 있다. 구글이 제안한 웹 컴포넌트의 핵심 기술 중 하나이다.

```html
<!-- 일반적인 HTML 구조 -->
<div>
  <p>Hello</p>
</div>

<!-- Shadow DOM이 붙은 HTML 구조 -->
<my-component>
  #shadow-root
  <p>Hello from shadow!</p>
</my-component>
```

### 🤔 왜 Shadow DOM이 필요할까?

1. 스타일 캡슐화  
   외부의 스타일이 Shadow DOM 컴포넌트에 영향을 미치지 않고 내부 스타일도 외부를 오염시키지 않는다

2. DOM 구조 은닉화  
   내부 DOM이 숨겨져 있어서 외부 스크립트나 스타일로 접근/변형이 어렵다

3. 컴포넌트 기반 UI 개발  
   React, Vue 같은 프레임워크를 쓰지 않아도 브라우저 단에서 컴포넌트를 만들 수 있다

### 🤖 핵심 API

1. `attachShadow({ mode })`

Shadow root를 생성하고 연결하는 API이며 딱 한 번만 호출이 가능하다.

```js
const openRoot = element.attachShadow({ mode: 'open' })
console.log(element.shadowRoot) // 접근 가능

const closedRoot = element.attachShadow({ mode: 'closed' })
console.log(element.shadowRoot) // null (외부 접근 불가)
```

- `open` : 디버깅이나 커스터마이징할 때 사용
- `closed` : 접근을 원천 차단하여 보안을 강화하고 캡슐화할 때 사용

2. `shadowRoot`

이미 Shadow DOM이 attach된 경우, 해당 root를 참조하는 프로퍼티이다.

```js
const shadowRoot = myComponent.shadowRoot // open 모드일 때만 접근 가능
```

3. `<slot>`

Shadow DOM 내부에서 호스트(부모)의 children을 삽입할 위치를 정의할 때 쓰인다.

```html
<template id="my-template">
  <style>
    span {
      color: red;
    }
  </style>
  <span><slot></slot></span>
</template>

<!-- 사용 예 -->
<my-element>Hello!</my-element>
```

4. `::part`, `:slotted()`

캡슐화된 스타일을 외부에서 제어할 수 있도록 허용하는 셀렉터들이다.

```html
<!-- Shadow DOM 내부 -->
<button part="my-button">확인</button>
```

```css
/* 외부 스타일 */
my-element::part(my-button) {
  background: blue;
}
```

```css
/* 외부에서 들어온 슬롯 콘텐츠 스타일링 */
::slotted(h1) {
  font-weight: bold;
}
```

5. `composed`

Shadow DOM 내부에서 발생한 이벤트는 기본적으로 외부로 나가지 않는다. 하지만 아래와 같이 설정한다면 외부에서도 전달받을 수 있다.

```js
this.dispatchEvent(
  new CustomEvent('hello', {
    composed: true,
    bubbles: true,
  }),
)
```

### 🔧 예제

```js
// Shadow DOM을 이용한 웹 컴포넌트 예시
class MyComponent extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        p { color: tomato; font-weight: bold; }
      </style>
      <p>Hello Shadow DOM</p>
    `
  }
}
customElements.define('my-component', MyComponent)
```

- `attachShadow({ mode: 'open' })` : shadow root를 생성 (open이면 JS로 접근 가능)
- `shadow.innerHTML = ...` : shadow DOM 내부에 구조와 스타일 삽입
- `customElements.define()` : 커스텀 엘리먼트 등록

### 🧐 언제 Shadow DOM을 써야할까?

| 상황                                           | 사용 여부                                          |
| ---------------------------------------------- | -------------------------------------------------- |
| 공통 UI 컴포넌트를 만들 때 (ex. Button, Modal) | ✅ 적극 추천                                       |
| 외부 스타일로 인해 CSS 충돌이 생길 때          | ✅ 매우 유용                                       |
| 접근성(ARIA 등)을 커스터마이징하고 싶을 때     | ✅ 고려 대상                                       |
| SEO가 중요한 페이지 콘텐츠에 쓸 때             | ❌ 주의 필요                                       |
| React, Vue를 쓰고 있다면?                      | 🔶 굳이 필요는 없음, 프레임워크가 이미 캡슐화 제공 |

### ⚠️ Shadow DOM의 단점 및 주의점

1. SEO 친화적이지 않음  
   Googlebot은 일부 shadow DOM을 인식하지만, 전통적인 크롤러는 무시할 수 있다

2. 접근성 고려 필요  
   ARIA 속성이나 role 등이 잘 전달되도록 해야한다

3. 복잡한 디버깅  
   일반 DOM과 구조가 다르므로 devtools에서 익숙해질 필요가 있다

4. 스타일 커스터마이징 어려움  
   내부 스타일은 외부에서 override하기 어렵다 → CSS 변수나 ::part 선택자 필요

### 🌈 커스텀 스타일 허용

Shadow DOM 내부 스타일을 외부에서 일부만 바꾸고 싶을 때는 위와 같이 ::part와 CSS 변수를 이용하면 된다.

```html
<!-- shadow 내부 -->
<template>
  <style>
    ::part(button) {
      background: var(--btn-bg, skyblue);
    }
  </style>
  <button part="button">Click Me</button>
</template>
```

- `part="button"`으로 외부에 스타일링이 가능한 타겟을 노출
- 외부 스타일에서 `my-component::part(button)` 형태로 스타일 지정 가능

### ✅ 정리

- Shadow DOM은 웹 컴포넌트 기반 UI에서 핵심 기술
- 스타일과 구조를 외부로부터 보호함으로서 캡슐화 가능
- SEO, 접근성, 커스터마이징은 보완 가능한 단점
- 프레임워크/라이브러리를 쓰지 않는 웹앱을 만들거나 라이브러리를 만들 때 유용

> Shadow DOM은 프레임워크나 라이브러리 없이도 DOM 구조와 스타일을 캡슐화하여 재사용 가능한 컴포넌트를 만들 수 있게 해주는, 웹 컴포넌트의 핵심 기술이다.

## 📚 레퍼런스

v1에 대한 공식 스펙은 [W3C Shadow DOM v1 문서](https://www.w3.org/TR/shadow-dom/)로 확인할 수 있다. 근데 W3C는 스펙을 버전 별로 관리하니까 Living Standard를 알고 싶다면
[WHATWG의 DOM 표준 문서](https://dom.spec.whatwg.org/#shadow-trees)를 확인하는 것이 좋다.

- https://www.w3.org/TR/shadow-dom/
- https://dom.spec.whatwg.org/#shadow-trees
- https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/
- https://ko.javascript.info/shadow-dom
- chat gpt
0:{"buildId":"fIMFzVBp7PQWc8En8Qe49","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"max-w-6xl mx-auto px-4 py-12","children":["$","div",null,{"className":"flex gap-8 justify-center xl:justify-start","children":[["$","article",null,{"className":"flex-1 max-w-3xl","children":[["$","header",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-muted-foreground mb-4","children":["$","$L2",null,{"href":"/tech","className":"hover:text-foreground transition-colors capitalize","children":"tech"}]}],["$","h1",null,{"className":"text-4xl font-bold tracking-tight mb-3","children":"Shadow DOM은 대하여"}],["$","div",null,{"className":"flex justify-between items-center gap-3 text-sm text-muted-foreground","children":[["$","time",null,{"dateTime":"2025-05-11T21:00","children":"May 11, 2025"}],["$","div",null,{"className":"flex items-center gap-3","children":[["$","$L3",null,{"slug":"shadow-dom"}],["$","span",null,{"children":"11 min read"}]]}]]}]]}],["$","hr",null,{"className":"border-border mb-8"}],["$","$L4",null,{"content":"$5"}],"$L6","$L7","$L8"]}],"$L9"]}]}],["$La","$Lb"],"$Lc"]}],"loading":null,"isPartial":false}
6:["$","div",null,{"className":"relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden","children":["$","$Ld",null,{"src":"https://images.hexdrinker.dev/tech/shadow-dom/zed.webp","alt":"Shadow DOM은 대하여","fill":true,"className":"object-cover","priority":true}]}]
7:["$","div",null,{"className":"prose dark:prose-invert max-w-none","children":[["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"이번에 Pull Request Previewer 크롬 익스텐션을 개발하면서 최초로 iframe을 사용했다. 일단 내가 iframe을 제대로 써본 적이 없어서 그냥 써보고 싶었다. parent와 postMessage API를 통해 데이터를 주고 받는 통신 방식으로 인한 취약점이나 복잡함들이 불편하게 느껴져서 경험이 좋지 않았다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"일단 다른건 차치하더라도 패널 위치나 사이즈 조정하는데도 메시지를 보내야해서 답이 없다고 느꼈다. 그래서 Shadow DOM으로의 전환을 결심했고 Shadow DOM에 대해서 좀 공부하게 되었다. Shadow DOM에 대해서 처음 들어본 것도 아니고 개념은 어느 정도 알고 있었지만 알아본 것에 대해서 정리를 하고자 기록을 남겨본다."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"-역사와-유래","children":"👨🏻‍🏫 역사와 유래"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM은 Google Chrome 팀이 2011년 무렵에 제안한 Web Components 기술 중 일부로 시작되었고 이후 W3C와 WHATWG에서 표준화를 진행했다."}],"\n",["$","div",null,{"className":"my-4 overflow-x-auto","children":["$","table",null,{"className":"w-full border-collapse text-sm","children":[["$","thead",null,{"children":["$","tr",null,{"children":[["$","th",null,{"className":"border border-border px-4 py-2 bg-muted font-medium text-left","children":"연도"}],["$","th",null,{"className":"border border-border px-4 py-2 bg-muted font-medium text-left","children":"이벤트"}]]}]}],["$","tbody",null,{"children":[["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"2011"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"Google에서 Web Components 개념 제안"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"2013"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"Chrome에 최초로 Shadow DOM v0 구현"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"2016"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"v1 발표, Safari, Firefox, Edge 등 주요 브라우저에서 채택 시작"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"2018 이후"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"대부분 브라우저가 v1 지원, v0은 폐기 수순"}]]}]]}]]}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["Web Components의 아버지 Dimitri Glazkov의 ",["$","a",null,{"href":"https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"What the Heck is Shadow DOM?"}]," 이란 제목의 블로그 글에 따르면 Shadow DOM의 등장 배경은 아래와 같다"]}],"\n",["$","blockquote",null,{"className":"my-4 border-l-2 border-border pl-4 text-muted-foreground","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["기존에 웹 플랫폼에서는 코드 간의 격리를 위해 사용할 수 있는 유일한 내장 메커니즘은 iframe이었는데 이는 무겁고 제한적이었다. 대부분의 브라우저는 DOM의 ",["$","strong",null,{"children":"복잡한 세부 구현"}],"을 숨기기 위해 강력한 기술을 사용하고 있었고 이것이 Shadow DOM이다."]}],"\n"]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["예를 들어 브라우저는 ",["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"<input id=\"foo\" type=\"range\">"}]," 이걸 단순히 태그 하나로 보여주지만 실제로는 내부에 여러 요소가 숨어있다. 저 태그를 렌더링할 때 아래와 같이 복잡한 구조로 만든다."]}],"\n",["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"#shadow-root\n  <div class=\"track\">\n    <div class=\"thumb\"></div>\n  </div>\n"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["이것이 위 인용구에서 말하는 ",["$","strong",null,{"children":"복잡한 세부 구현"}],"이다. ",["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"<input id=\"foo\" type=\"range\" />"}]," 는 내부적으로 슬라이더와 핸들 등 여러 요소가 있고 이런 구조는 브라우저마다 다르고 개발자 입장에서는 알 수 없고 건드릴 수도 없다. 즉, 브라우저가 처리하는 내부 구현을 Shadow DOM이란 기술로 감싸서 격리하고 숨긴 것이다."]}],"\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d","\n","$L1e","\n","$L1f","\n","$L20","\n","$L21","\n","$L22","\n","$L23","\n","$L24","\n","$L25","\n","$L26","\n","$L27","\n","$L28","\n","$L29","\n","$L2a","\n","$L2b","\n","$L2c","\n","$L2d","\n","$L2e","\n","$L2f","\n","$L30","\n","$L31","\n","$L32","\n","$L33","\n","$L34","\n","$L35","\n","$L36","\n","$L37","\n","$L38","\n","$L39"]}]
8:["$","hr",null,{"className":"border-border my-12"}]
3b:T2605,


이번에 Pull Request Previewer 크롬 익스텐션을 개발하면서 최초로 iframe을 사용했다. 일단 내가 iframe을 제대로 써본 적이 없어서 그냥 써보고 싶었다. parent와 postMessage API를 통해 데이터를 주고 받는 통신 방식으로 인한 취약점이나 복잡함들이 불편하게 느껴져서 경험이 좋지 않았다.

일단 다른건 차치하더라도 패널 위치나 사이즈 조정하는데도 메시지를 보내야해서 답이 없다고 느꼈다. 그래서 Shadow DOM으로의 전환을 결심했고 Shadow DOM에 대해서 좀 공부하게 되었다. Shadow DOM에 대해서 처음 들어본 것도 아니고 개념은 어느 정도 알고 있었지만 알아본 것에 대해서 정리를 하고자 기록을 남겨본다.

## 👨🏻‍🏫 역사와 유래

Shadow DOM은 Google Chrome 팀이 2011년 무렵에 제안한 Web Components 기술 중 일부로 시작되었고 이후 W3C와 WHATWG에서 표준화를 진행했다.

| 연도      | 이벤트                                                        |
| --------- | ------------------------------------------------------------- |
| 2011      | Google에서 Web Components 개념 제안                           |
| 2013      | Chrome에 최초로 Shadow DOM v0 구현                            |
| 2016      | v1 발표, Safari, Firefox, Edge 등 주요 브라우저에서 채택 시작 |
| 2018 이후 | 대부분 브라우저가 v1 지원, v0은 폐기 수순                     |

Web Components의 아버지 Dimitri Glazkov의 [What the Heck is Shadow DOM?](https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/) 이란 제목의 블로그 글에 따르면 Shadow DOM의 등장 배경은 아래와 같다

> 기존에 웹 플랫폼에서는 코드 간의 격리를 위해 사용할 수 있는 유일한 내장 메커니즘은 iframe이었는데 이는 무겁고 제한적이었다. 대부분의 브라우저는 DOM의 **복잡한 세부 구현**을 숨기기 위해 강력한 기술을 사용하고 있었고 이것이 Shadow DOM이다.

예를 들어 브라우저는 `<input id="foo" type="range">` 이걸 단순히 태그 하나로 보여주지만 실제로는 내부에 여러 요소가 숨어있다. 저 태그를 렌더링할 때 아래와 같이 복잡한 구조로 만든다.

```
#shadow-root
  <div class="track">
    <div class="thumb"></div>
  </div>
```

이것이 위 인용구에서 말하는 **복잡한 세부 구현**이다. `<input id="foo" type="range" />` 는 내부적으로 슬라이더와 핸들 등 여러 요소가 있고 이런 구조는 브라우저마다 다르고 개발자 입장에서는 알 수 없고 건드릴 수도 없다. 즉, 브라우저가 처리하는 내부 구현을 Shadow DOM이란 기술로 감싸서 격리하고 숨긴 것이다.

구글은 브라우저 내에서만 쓰던 캡슐화 기법을 일반 개발자들도 쓸 수 있도록 API 형태로 공개하자고 제안했고 이것이 Web Components 사양의 일부로 나온 Shadow DOM이다.

<figure className='imageWrapper'>
  <img
    src='https://images.hexdrinker.dev/tech/shadow-dom/insane.png'
    alt='owner-of-shadow'
    width='80%'
  />
  <figcaption>도대체 얼마나 미친놈이에요? ㅋㅋㅋㅋ</figcaption>
</figure>

자 이제 Shadow DOM에 대해서 좀 더 알아보자.

## ⚡️ Shadow DOM이란?

Shadow DOM은 DOM 트리 내에 또 다른 숨겨진 DOM 트리를 생성하는 기술로, DOM 캡슐화를 통해 외부와 격리되어 자체적인 스타일과 구조를 가진 독립적인 컴포넌트를 만들 수 있다. 구글이 제안한 웹 컴포넌트의 핵심 기술 중 하나이다.

```html
<!-- 일반적인 HTML 구조 -->
<div>
  <p>Hello</p>
</div>

<!-- Shadow DOM이 붙은 HTML 구조 -->
<my-component>
  #shadow-root
  <p>Hello from shadow!</p>
</my-component>
```

### 🤔 왜 Shadow DOM이 필요할까?

1. 스타일 캡슐화  
   외부의 스타일이 Shadow DOM 컴포넌트에 영향을 미치지 않고 내부 스타일도 외부를 오염시키지 않는다

2. DOM 구조 은닉화  
   내부 DOM이 숨겨져 있어서 외부 스크립트나 스타일로 접근/변형이 어렵다

3. 컴포넌트 기반 UI 개발  
   React, Vue 같은 프레임워크를 쓰지 않아도 브라우저 단에서 컴포넌트를 만들 수 있다

### 🤖 핵심 API

1. `attachShadow({ mode })`

Shadow root를 생성하고 연결하는 API이며 딱 한 번만 호출이 가능하다.

```js
const openRoot = element.attachShadow({ mode: 'open' })
console.log(element.shadowRoot) // 접근 가능

const closedRoot = element.attachShadow({ mode: 'closed' })
console.log(element.shadowRoot) // null (외부 접근 불가)
```

- `open` : 디버깅이나 커스터마이징할 때 사용
- `closed` : 접근을 원천 차단하여 보안을 강화하고 캡슐화할 때 사용

2. `shadowRoot`

이미 Shadow DOM이 attach된 경우, 해당 root를 참조하는 프로퍼티이다.

```js
const shadowRoot = myComponent.shadowRoot // open 모드일 때만 접근 가능
```

3. `<slot>`

Shadow DOM 내부에서 호스트(부모)의 children을 삽입할 위치를 정의할 때 쓰인다.

```html
<template id="my-template">
  <style>
    span {
      color: red;
    }
  </style>
  <span><slot></slot></span>
</template>

<!-- 사용 예 -->
<my-element>Hello!</my-element>
```

4. `::part`, `:slotted()`

캡슐화된 스타일을 외부에서 제어할 수 있도록 허용하는 셀렉터들이다.

```html
<!-- Shadow DOM 내부 -->
<button part="my-button">확인</button>
```

```css
/* 외부 스타일 */
my-element::part(my-button) {
  background: blue;
}
```

```css
/* 외부에서 들어온 슬롯 콘텐츠 스타일링 */
::slotted(h1) {
  font-weight: bold;
}
```

5. `composed`

Shadow DOM 내부에서 발생한 이벤트는 기본적으로 외부로 나가지 않는다. 하지만 아래와 같이 설정한다면 외부에서도 전달받을 수 있다.

```js
this.dispatchEvent(
  new CustomEvent('hello', {
    composed: true,
    bubbles: true,
  }),
)
```

### 🔧 예제

```js
// Shadow DOM을 이용한 웹 컴포넌트 예시
class MyComponent extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        p { color: tomato; font-weight: bold; }
      </style>
      <p>Hello Shadow DOM</p>
    `
  }
}
customElements.define('my-component', MyComponent)
```

- `attachShadow({ mode: 'open' })` : shadow root를 생성 (open이면 JS로 접근 가능)
- `shadow.innerHTML = ...` : shadow DOM 내부에 구조와 스타일 삽입
- `customElements.define()` : 커스텀 엘리먼트 등록

### 🧐 언제 Shadow DOM을 써야할까?

| 상황                                           | 사용 여부                                          |
| ---------------------------------------------- | -------------------------------------------------- |
| 공통 UI 컴포넌트를 만들 때 (ex. Button, Modal) | ✅ 적극 추천                                       |
| 외부 스타일로 인해 CSS 충돌이 생길 때          | ✅ 매우 유용                                       |
| 접근성(ARIA 등)을 커스터마이징하고 싶을 때     | ✅ 고려 대상                                       |
| SEO가 중요한 페이지 콘텐츠에 쓸 때             | ❌ 주의 필요                                       |
| React, Vue를 쓰고 있다면?                      | 🔶 굳이 필요는 없음, 프레임워크가 이미 캡슐화 제공 |

### ⚠️ Shadow DOM의 단점 및 주의점

1. SEO 친화적이지 않음  
   Googlebot은 일부 shadow DOM을 인식하지만, 전통적인 크롤러는 무시할 수 있다

2. 접근성 고려 필요  
   ARIA 속성이나 role 등이 잘 전달되도록 해야한다

3. 복잡한 디버깅  
   일반 DOM과 구조가 다르므로 devtools에서 익숙해질 필요가 있다

4. 스타일 커스터마이징 어려움  
   내부 스타일은 외부에서 override하기 어렵다 → CSS 변수나 ::part 선택자 필요

### 🌈 커스텀 스타일 허용

Shadow DOM 내부 스타일을 외부에서 일부만 바꾸고 싶을 때는 위와 같이 ::part와 CSS 변수를 이용하면 된다.

```html
<!-- shadow 내부 -->
<template>
  <style>
    ::part(button) {
      background: var(--btn-bg, skyblue);
    }
  </style>
  <button part="button">Click Me</button>
</template>
```

- `part="button"`으로 외부에 스타일링이 가능한 타겟을 노출
- 외부 스타일에서 `my-component::part(button)` 형태로 스타일 지정 가능

### ✅ 정리

- Shadow DOM은 웹 컴포넌트 기반 UI에서 핵심 기술
- 스타일과 구조를 외부로부터 보호함으로서 캡슐화 가능
- SEO, 접근성, 커스터마이징은 보완 가능한 단점
- 프레임워크/라이브러리를 쓰지 않는 웹앱을 만들거나 라이브러리를 만들 때 유용

> Shadow DOM은 프레임워크나 라이브러리 없이도 DOM 구조와 스타일을 캡슐화하여 재사용 가능한 컴포넌트를 만들 수 있게 해주는, 웹 컴포넌트의 핵심 기술이다.

## 📚 레퍼런스

v1에 대한 공식 스펙은 [W3C Shadow DOM v1 문서](https://www.w3.org/TR/shadow-dom/)로 확인할 수 있다. 근데 W3C는 스펙을 버전 별로 관리하니까 Living Standard를 알고 싶다면
[WHATWG의 DOM 표준 문서](https://dom.spec.whatwg.org/#shadow-trees)를 확인하는 것이 좋다.

- https://www.w3.org/TR/shadow-dom/
- https://dom.spec.whatwg.org/#shadow-trees
- https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/
- https://ko.javascript.info/shadow-dom
- chat gpt
9:["$","aside",null,{"className":"hidden xl:block w-64 shrink-0 self-start sticky top-24","children":["$","$L3a",null,{"content":"$3b"}]}]
a:["$","script","script-0",{"src":"/_next/static/chunks/8ba36b395f30a90d.js","async":true}]
b:["$","script","script-1",{"src":"/_next/static/chunks/cc80ad68b16f74f3.js","async":true}]
c:["$","$L3c",null,{"children":["$","$3d",null,{"name":"Next.MetadataOutlet","children":"$@3e"}]}]
e:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"구글은 브라우저 내에서만 쓰던 캡슐화 기법을 일반 개발자들도 쓸 수 있도록 API 형태로 공개하자고 제안했고 이것이 Web Components 사양의 일부로 나온 Shadow DOM이다."}]
f:["$","figure",null,{"className":"imageWrapper","children":[["$","img",null,{"src":"https://images.hexdrinker.dev/tech/shadow-dom/insane.png","alt":"owner-of-shadow","width":"80%"}],["$","figcaption",null,{"children":"도대체 얼마나 미친놈이에요? ㅋㅋㅋㅋ"}]]}]
10:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"자 이제 Shadow DOM에 대해서 좀 더 알아보자."}]
11:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"️-shadow-dom이란","children":"⚡️ Shadow DOM이란?"}]
12:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM은 DOM 트리 내에 또 다른 숨겨진 DOM 트리를 생성하는 기술로, DOM 캡슐화를 통해 외부와 격리되어 자체적인 스타일과 구조를 가진 독립적인 컴포넌트를 만들 수 있다. 구글이 제안한 웹 컴포넌트의 핵심 기술 중 하나이다."}]
13:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-html","children":[["$","span",null,{"className":"hljs-comment","children":"<!-- 일반적인 HTML 구조 -->"}],"\n",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"div"}],">"]}],"\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"p"}],">"]}],"Hello",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"p"}],">"]}],"\n",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"div"}],">"]}],"\n\n",["$","span",null,{"className":"hljs-comment","children":"<!-- Shadow DOM이 붙은 HTML 구조 -->"}],"\n",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"my-component"}],">"]}],"\n  #shadow-root\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"p"}],">"]}],"Hello from shadow!",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"p"}],">"]}],"\n",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"my-component"}],">"]}],"\n"]}]}]
14:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-왜-shadow-dom이-필요할까","children":"🤔 왜 Shadow DOM이 필요할까?"}]
15:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["스타일 캡슐화",["$","br",null,{}],"\n","외부의 스타일이 Shadow DOM 컴포넌트에 영향을 미치지 않고 내부 스타일도 외부를 오염시키지 않는다"]}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["DOM 구조 은닉화",["$","br",null,{}],"\n","내부 DOM이 숨겨져 있어서 외부 스크립트나 스타일로 접근/변형이 어렵다"]}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["컴포넌트 기반 UI 개발",["$","br",null,{}],"\n","React, Vue 같은 프레임워크를 쓰지 않아도 브라우저 단에서 컴포넌트를 만들 수 있다"]}],"\n"]}],"\n"]}]
16:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-핵심-api","children":"🤖 핵심 API"}]
17:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"attachShadow({ mode })"}]}],"\n"]}]
18:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow root를 생성하고 연결하는 API이며 딱 한 번만 호출이 가능하다."}]
19:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-js","children":[["$","span",null,{"className":"hljs-keyword","children":"const"}]," openRoot = element.",["$","span",null,{"className":"hljs-title function_","children":"attachShadow"}],"({ ",["$","span",null,{"className":"hljs-attr","children":"mode"}],": ",["$","span",null,{"className":"hljs-string","children":"'open'"}]," })\n",["$","span",null,{"className":"hljs-variable language_","children":"console"}],".",["$","span",null,{"className":"hljs-title function_","children":"log"}],"(element.",["$","span",null,{"className":"hljs-property","children":"shadowRoot"}],") ",["$","span",null,{"className":"hljs-comment","children":"// 접근 가능"}],"\n\n",["$","span",null,{"className":"hljs-keyword","children":"const"}]," closedRoot = element.",["$","span",null,{"className":"hljs-title function_","children":"attachShadow"}],"({ ",["$","span",null,{"className":"hljs-attr","children":"mode"}],": ",["$","span",null,{"className":"hljs-string","children":"'closed'"}]," })\n",["$","span",null,{"className":"hljs-variable language_","children":"console"}],".",["$","span",null,{"className":"hljs-title function_","children":"log"}],"(element.",["$","span",null,{"className":"hljs-property","children":"shadowRoot"}],") ",["$","span",null,{"className":"hljs-comment","children":"// null (외부 접근 불가)"}],"\n"]}]}]
1a:["$","ul",null,{"className":"my-4 ml-6 list-disc space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"open"}]," : 디버깅이나 커스터마이징할 때 사용"]}],"\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"closed"}]," : 접근을 원천 차단하여 보안을 강화하고 캡슐화할 때 사용"]}],"\n"]}]
1b:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","start":"2","children":["\n",["$","li",null,{"className":"leading-7","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"shadowRoot"}]}],"\n"]}]
1c:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"이미 Shadow DOM이 attach된 경우, 해당 root를 참조하는 프로퍼티이다."}]
1d:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-js","children":[["$","span",null,{"className":"hljs-keyword","children":"const"}]," shadowRoot = myComponent.",["$","span",null,{"className":"hljs-property","children":"shadowRoot"}]," ",["$","span",null,{"className":"hljs-comment","children":"// open 모드일 때만 접근 가능"}],"\n"]}]}]
1e:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","start":"3","children":["\n",["$","li",null,{"className":"leading-7","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"<slot>"}]}],"\n"]}]
1f:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM 내부에서 호스트(부모)의 children을 삽입할 위치를 정의할 때 쓰인다."}]
20:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-html","children":[["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"template"}]," ",["$","span",null,{"className":"hljs-attr","children":"id"}],"=",["$","span",null,{"className":"hljs-string","children":"\"my-template\""}],">"]}],"\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"style"}],">"]}],["$","span",null,{"className":"css","children":["\n    ",["$","span",null,{"className":"hljs-selector-tag","children":"span"}]," {\n      ",["$","span",null,{"className":"hljs-attribute","children":"color"}],": red;\n    }\n  "]}],["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"style"}],">"]}],"\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"span"}],">"]}],["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"slot"}],">"]}],["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"slot"}],">"]}],["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"span"}],">"]}],"\n",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"template"}],">"]}],"\n\n",["$","span",null,{"className":"hljs-comment","children":"<!-- 사용 예 -->"}],"\n",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"my-element"}],">"]}],"Hello!",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"my-element"}],">"]}],"\n"]}]}]
21:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","start":"4","children":["\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"::part"}],", ",["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":":slotted()"}]]}],"\n"]}]
22:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"캡슐화된 스타일을 외부에서 제어할 수 있도록 허용하는 셀렉터들이다."}]
23:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-html","children":[["$","span",null,{"className":"hljs-comment","children":"<!-- Shadow DOM 내부 -->"}],"\n",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"button"}]," ",["$","span",null,{"className":"hljs-attr","children":"part"}],"=",["$","span",null,{"className":"hljs-string","children":"\"my-button\""}],">"]}],"확인",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"button"}],">"]}],"\n"]}]}]
24:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-css","children":[["$","span",null,{"className":"hljs-comment","children":"/* 외부 스타일 */"}],"\nmy-element",["$","span",null,{"className":"hljs-selector-pseudo","children":"::part"}],"(my-",["$","span",null,{"className":"hljs-selector-tag","children":"button"}],") {\n  ",["$","span",null,{"className":"hljs-attribute","children":"background"}],": blue;\n}\n"]}]}]
25:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-css","children":[["$","span",null,{"className":"hljs-comment","children":"/* 외부에서 들어온 슬롯 콘텐츠 스타일링 */"}],"\n",["$","span",null,{"className":"hljs-selector-pseudo","children":"::slotted"}],"(",["$","span",null,{"className":"hljs-selector-tag","children":"h1"}],") {\n  ",["$","span",null,{"className":"hljs-attribute","children":"font-weight"}],": bold;\n}\n"]}]}]
26:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","start":"5","children":["\n",["$","li",null,{"className":"leading-7","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"composed"}]}],"\n"]}]
27:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM 내부에서 발생한 이벤트는 기본적으로 외부로 나가지 않는다. 하지만 아래와 같이 설정한다면 외부에서도 전달받을 수 있다."}]
28:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-js","children":[["$","span",null,{"className":"hljs-variable language_","children":"this"}],".",["$","span",null,{"className":"hljs-title function_","children":"dispatchEvent"}],"(\n  ",["$","span",null,{"className":"hljs-keyword","children":"new"}]," ",["$","span",null,{"className":"hljs-title class_","children":"CustomEvent"}],"(",["$","span",null,{"className":"hljs-string","children":"'hello'"}],", {\n    ",["$","span",null,{"className":"hljs-attr","children":"composed"}],": ",["$","span",null,{"className":"hljs-literal","children":"true"}],",\n    ",["$","span",null,{"className":"hljs-attr","children":"bubbles"}],": ",["$","span",null,{"className":"hljs-literal","children":"true"}],",\n  }),\n)\n"]}]}]
29:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-예제","children":"🔧 예제"}]
2a:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-js","children":[["$","span",null,{"className":"hljs-comment","children":"// Shadow DOM을 이용한 웹 컴포넌트 예시"}],"\n",["$","span",null,{"className":"hljs-keyword","children":"class"}]," ",["$","span",null,{"className":"hljs-title class_","children":"MyComponent"}]," ",["$","span",null,{"className":"hljs-keyword","children":"extends"}]," ",["$","span",null,{"className":"hljs-title class_ inherited__","children":"HTMLElement"}]," {\n  ",["$","span",null,{"className":"hljs-title function_","children":"constructor"}],"(",["$","span",null,{"className":"hljs-params"}],") {\n    ",["$","span",null,{"className":"hljs-variable language_","children":"super"}],"()\n    ",["$","span",null,{"className":"hljs-keyword","children":"const"}]," shadow = ",["$","span",null,{"className":"hljs-variable language_","children":"this"}],".",["$","span",null,{"className":"hljs-title function_","children":"attachShadow"}],"({ ",["$","span",null,{"className":"hljs-attr","children":"mode"}],": ",["$","span",null,{"className":"hljs-string","children":"'open'"}]," })\n    shadow.",["$","span",null,{"className":"hljs-property","children":"innerHTML"}]," = ",["$","span",null,{"className":"hljs-string","children":"`\n      <style>\n        p { color: tomato; font-weight: bold; }\n      </style>\n      <p>Hello Shadow DOM</p>\n    `"}],"\n  }\n}\ncustomElements.",["$","span",null,{"className":"hljs-title function_","children":"define"}],"(",["$","span",null,{"className":"hljs-string","children":"'my-component'"}],", ",["$","span",null,{"className":"hljs-title class_","children":"MyComponent"}],")\n"]}]}]
2b:["$","ul",null,{"className":"my-4 ml-6 list-disc space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"attachShadow({ mode: 'open' })"}]," : shadow root를 생성 (open이면 JS로 접근 가능)"]}],"\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"shadow.innerHTML = ..."}]," : shadow DOM 내부에 구조와 스타일 삽입"]}],"\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"customElements.define()"}]," : 커스텀 엘리먼트 등록"]}],"\n"]}]
2c:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-언제-shadow-dom을-써야할까","children":"🧐 언제 Shadow DOM을 써야할까?"}]
2d:["$","div",null,{"className":"my-4 overflow-x-auto","children":["$","table",null,{"className":"w-full border-collapse text-sm","children":[["$","thead",null,{"children":["$","tr",null,{"children":[["$","th",null,{"className":"border border-border px-4 py-2 bg-muted font-medium text-left","children":"상황"}],["$","th",null,{"className":"border border-border px-4 py-2 bg-muted font-medium text-left","children":"사용 여부"}]]}]}],["$","tbody",null,{"children":[["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"공통 UI 컴포넌트를 만들 때 (ex. Button, Modal)"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"✅ 적극 추천"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"외부 스타일로 인해 CSS 충돌이 생길 때"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"✅ 매우 유용"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"접근성(ARIA 등)을 커스터마이징하고 싶을 때"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"✅ 고려 대상"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"SEO가 중요한 페이지 콘텐츠에 쓸 때"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"❌ 주의 필요"}]]}],["$","tr",null,{"children":[["$","td",null,{"className":"border border-border px-4 py-2","children":"React, Vue를 쓰고 있다면?"}],["$","td",null,{"className":"border border-border px-4 py-2","children":"🔶 굳이 필요는 없음, 프레임워크가 이미 캡슐화 제공"}]]}]]}]]}]}]
2e:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"️-shadow-dom의-단점-및-주의점","children":"⚠️ Shadow DOM의 단점 및 주의점"}]
2f:["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["SEO 친화적이지 않음",["$","br",null,{}],"\n","Googlebot은 일부 shadow DOM을 인식하지만, 전통적인 크롤러는 무시할 수 있다"]}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["접근성 고려 필요",["$","br",null,{}],"\n","ARIA 속성이나 role 등이 잘 전달되도록 해야한다"]}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["복잡한 디버깅",["$","br",null,{}],"\n","일반 DOM과 구조가 다르므로 devtools에서 익숙해질 필요가 있다"]}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["스타일 커스터마이징 어려움",["$","br",null,{}],"\n","내부 스타일은 외부에서 override하기 어렵다 → CSS 변수나 ::part 선택자 필요"]}],"\n"]}],"\n"]}]
30:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-커스텀-스타일-허용","children":"🌈 커스텀 스타일 허용"}]
31:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM 내부 스타일을 외부에서 일부만 바꾸고 싶을 때는 위와 같이 ::part와 CSS 변수를 이용하면 된다."}]
32:["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"hljs language-html","children":[["$","span",null,{"className":"hljs-comment","children":"<!-- shadow 내부 -->"}],"\n",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"template"}],">"]}],"\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"style"}],">"]}],["$","span",null,{"className":"css","children":["\n    ",["$","span",null,{"className":"hljs-selector-pseudo","children":"::part"}],"(",["$","span",null,{"className":"hljs-selector-tag","children":"button"}],") {\n      ",["$","span",null,{"className":"hljs-attribute","children":"background"}],": ",["$","span",null,{"className":"hljs-built_in","children":"var"}],"(--btn-bg, skyblue);\n    }\n  "]}],["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"style"}],">"]}],"\n  ",["$","span",null,{"className":"hljs-tag","children":["<",["$","span",null,{"className":"hljs-name","children":"button"}]," ",["$","span",null,{"className":"hljs-attr","children":"part"}],"=",["$","span",null,{"className":"hljs-string","children":"\"button\""}],">"]}],"Click Me",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"button"}],">"]}],"\n",["$","span",null,{"className":"hljs-tag","children":["</",["$","span",null,{"className":"hljs-name","children":"template"}],">"]}],"\n"]}]}]
33:["$","ul",null,{"className":"my-4 ml-6 list-disc space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":[["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"part=\"button\""}],"으로 외부에 스타일링이 가능한 타겟을 노출"]}],"\n",["$","li",null,{"className":"leading-7","children":["외부 스타일에서 ",["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"my-component::part(button)"}]," 형태로 스타일 지정 가능"]}],"\n"]}]
34:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"-정리","children":"✅ 정리"}]
35:["$","ul",null,{"className":"my-4 ml-6 list-disc space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":"Shadow DOM은 웹 컴포넌트 기반 UI에서 핵심 기술"}],"\n",["$","li",null,{"className":"leading-7","children":"스타일과 구조를 외부로부터 보호함으로서 캡슐화 가능"}],"\n",["$","li",null,{"className":"leading-7","children":"SEO, 접근성, 커스터마이징은 보완 가능한 단점"}],"\n",["$","li",null,{"className":"leading-7","children":"프레임워크/라이브러리를 쓰지 않는 웹앱을 만들거나 라이브러리를 만들 때 유용"}],"\n"]}]
36:["$","blockquote",null,{"className":"my-4 border-l-2 border-border pl-4 text-muted-foreground","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"Shadow DOM은 프레임워크나 라이브러리 없이도 DOM 구조와 스타일을 캡슐화하여 재사용 가능한 컴포넌트를 만들 수 있게 해주는, 웹 컴포넌트의 핵심 기술이다."}],"\n"]}]
37:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"-레퍼런스","children":"📚 레퍼런스"}]
38:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["v1에 대한 공식 스펙은 ",["$","a",null,{"href":"https://www.w3.org/TR/shadow-dom/","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"W3C Shadow DOM v1 문서"}],"로 확인할 수 있다. 근데 W3C는 스펙을 버전 별로 관리하니까 Living Standard를 알고 싶다면\n",["$","a",null,{"href":"https://dom.spec.whatwg.org/#shadow-trees","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"WHATWG의 DOM 표준 문서"}],"를 확인하는 것이 좋다."]}]
39:["$","ul",null,{"className":"my-4 ml-6 list-disc space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":["$","a",null,{"href":"https://www.w3.org/TR/shadow-dom/","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"https://www.w3.org/TR/shadow-dom/"}]}],"\n",["$","li",null,{"className":"leading-7","children":["$","a",null,{"href":"https://dom.spec.whatwg.org/#shadow-trees","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"https://dom.spec.whatwg.org/#shadow-trees"}]}],"\n",["$","li",null,{"className":"leading-7","children":["$","a",null,{"href":"https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/"}]}],"\n",["$","li",null,{"className":"leading-7","children":["$","a",null,{"href":"https://ko.javascript.info/shadow-dom","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"https://ko.javascript.info/shadow-dom"}]}],"\n",["$","li",null,{"className":"leading-7","children":"chat gpt"}],"\n"]}]
3e:null
