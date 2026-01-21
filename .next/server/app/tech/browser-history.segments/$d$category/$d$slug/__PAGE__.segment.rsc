1:"$Sreact.fragment"
2:I[8331,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],""]
3:I[17733,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"ViewCounter"]
4:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"MobileTableOfContents"]
d:I[72039,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"Image"]
1e:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"TableOfContents"]
20:I[2718,["/_next/static/chunks/483a12865e0bba97.js","/_next/static/chunks/1d3be43a6dda29b7.js"],"OutletBoundary"]
21:"$Sreact.suspense"
:HL["https://images.hexdrinker.dev/web/browser-history/mosaic.png","image"]
:HL["https://images.hexdrinker.dev/web/browser-history/netscape-navigator.png","image"]
:HL["https://images.hexdrinker.dev/web/browser-history/browser-war1.png","image"]
:HL["https://images.hexdrinker.dev/web/browser-history/windows98.png","image"]
:HL["https://images.hexdrinker.dev/web/browser-history/browser-war2.png","image"]
:HL["https://images.hexdrinker.dev/web/browser-history/brwoser-conversation.jpeg","image"]
5:T2062,
이번 글에서는 웹 브라우저의 무구한(..) 역사에 대해 알아보고자 한다.



웹 브라우저는 웹 서버와 통신하여 HTML 문서나 파일, 이미지 등의 리소스를 출력하는 GUI 기반의 소프트웨어이다. 대표적으로
MS에서 개발한 인터넷 익스플로러와 엣지, 구글의 크롬, 모질라의 파이어폭스, 애플의 사파리, 오페라 등이 있다.

## 태동

세계 최초의 브라우저는 인터넷을 탄생시킨 팀 버너스리가 1990년에 NeXTSTEP용으로 개발한 **WorldWideWeb**이다. 이는 Objective-C로 개발되었고 시간이 흘러 **Nexus**라는 이름으로 불리게 된다.

```
NeXTSTEP은 스티브 잡스가 애플에서 쫓겨난 후 설립한 NeXT에서 개발한 OS이다.
```

![mosaic](https://images.hexdrinker.dev/web/browser-history/mosaic.png)

그 후 1992년 말을 기점으로 libwww, Line mode Browser, Erwise 등 여러 브라우저가 등장했고 1993년 NCSA의 마크 앤드리슨과 에릭 바나가 개발한 **MOSAIC**이라는 이름의 브라우저가 출시했다. 이는 최초로 이미지, 음악 등의 멀티미디어를 바로 표시할 수 있는 기능을 있었고 이는 웹과 브라우저의 대중화를 이끌며 폭발적인 성장을 이룩했다. 이를 계기로 브라우저 전쟁의 시대가 본격적으로 열리게 된다.

## 넷스케이프 네비게이터의 시대 (1994 ~ 1995)

모자익을 개발한 마크 앤드리슨은 NCSA를 떠나 넷스케이프 커뮤니케이션을 설립했고 모자익 넷스케이프를 개발한다. 이는 1994년 12월 정식 버전으로 발매되면서 **넷스케이프 네비게이터**라는 이름으로 불리게 되었다.

<p>
  <img
    className='responsible width-90'
    src='https://images.hexdrinker.dev/web/browser-history/netscape-navigator.png'
    alt='netscape-navigator'
  />
</p>

모자익이 WWW의 부흥을 이끌었다면 넷스케이프 네비게이터는 보다 편리하고 뛰어난 성능을 드러내며 WWW의 활용을 일반화했다고 평가받는다. 당시 여러 브라우저들이 경쟁을 했으나 넷스케이프 네비게이터가 뛰어난 성능과 편의성을 바탕으로 경쟁 브라우저들을 압도하며 브라우저 시장을 정복하고 있었다.

## 제 1차 브라우저 전쟁 (1996 ~ 2008)

![browser-war1](https://images.hexdrinker.dev/web/browser-history/browser-war1.png)

스파이글래스 사는 초기 모자익의 기술과 상표 라이센스를 사서 새로운 브라우저를 내놓았지만 큰 주목을 받지 못한다. 하지만 MS에서 이를 사들여 웹 브라우저를 출시하는데 이것이 바로 **Internet Explorer**이다. (아래서부터는 IE라고 하겠다.)

초기 IE의 기능은 빈약했고 이미 시장은 넷스케이프 네비게이터의 독점체제였다. 그리고 이 자리를 굳건히 하기 위해 브라우저에 경량의 프로그래밍 언어를 임베디드하여 인터랙티브한 HTML을 제공하기로 결정하여 브랜든 아이크를 영입했다. 브랜든 아이크는 단 열흘 만에(...) 자바스크립트를 개발했고 넷스케이프 네비게이터 2.0는 자바스크립트가 내장되어 출시되었다. 그러나 IE는 MS의 전폭적인 지원을 받으며 성장했고 넷스케이프 네비게이터에 비해 특별하게 기술적인 강점이 존재하진 않았지만 MS의 마케팅 전략이 빛을 발하며 시장 점유율을 조금씩 차지하기 시작한다.

당시 MS는 Windows OS를 통해서 전세계의 OS 시장을 쓸어담으며 글로벌 기업으로 성장했으나 넷스케이프는 브라우저 하나로 먹고사는 작은 회사였다. Windows의 시장 점유율은 90%에 육박했으며 너무나 당연하게도 MS는 Windows OS에 기본 브라우저로 IE를 탑재시켰고 따로 브라우저를 설치할 일이 없어지게 되면서 사용자들은 자연스럽게 IE를 사용했고 다른 브라우저들은 하나둘 도태되기 시작했다.

넷스케이프 네비게이터도 예외는 아니었고 IE가 있음에도 넷스케이프 네비게이터를 설치해서 사용할 정도로 엄청난 차이가 존재하진 않았다. 이러한 끼워팔기 마케팅에 넷스케이프는 처참하게 추락하게 된다.

<p>
  <img
    className='responsible width-80'
    src='https://images.hexdrinker.dev/web/browser-history/windows98.png'
    alt='windows98'
  />
</p>

1998년 MS는 그 끼워팔기 때문에 반독점법 소송에 걸려 시정 명령을 받고 회사가 쪼개질 위기까지 갔지만 겨우 항소심에서 승리하여 막아냈고 넷스케이프는 재정 문제 등을 이유로 AOL에 인수당한다. MS는 소송 때문에 고생했지만 이미 시장은 IE가 점령한 상태였기 때문에 넷스케이프의 반등은 불가능했다. 이후 넷스케이프는 AOL의 대규모 정리매각 대상 중 하나가 되었고 이를 MS가 인수하게 된다.

결국 제 1차 브라우저 전쟁은 MS의 IE의 승리로 돌아갔고 2001~2004년, 이의 점유율은 90%를 호가했다. 특히 2002년엔 96%까지 치솟으며 IE는 전성기를 맞이한다. 한편 넷스케이프의 후계자들은 모질라 재단을 설립하여 오픈소스 기반의 웹 브라우저를 개발하는데 이것이 **파이어폭스**이다.

## 제 2차 브라우저 전쟁 (2009 ~ 2015)

<p>
  <img
    className='responsible width-80'
    src='https://images.hexdrinker.dev/web/browser-history/browser-war2.png'
    alt='browser-war2'
  />
</p>

넷스케이프의 실패는 모질라 재단에게 비영리라는 교훈을 주었다. ES 제정 정통성, 우수한 개발도구 지원 등을 토대로 IE를 상대로 선전하기 시작한다.

파이어폭스는 꾸준히 점유율을 높여갔지만 IE에 익숙해진 사용자들에게 큰 영향을 미치기는 어려웠고 MS 또한 아웃룩과의 연계, 표준화 거부 등을 통해서 IE의 점유율을 유지하고자 했다.

그러던 중 2008년 구글의 **크롬**이 혜성같이 등장한다. 크롬은 매우 뛰어난 속도와 가벼움을 기반으로 혁신적인 개발도구 제공 등을 내세우며 개발자와 사용자들로부터 많은 사랑을 받게 된다. 크롬은 파이어폭스가 10여년간 쌓아왔던 30% 가량의 점유율을 단 3년 만에 돌파하였고 2012년을 기점으로 MS의 점유율을 꺾었다.

IE는 독점 시장에서 기술적인 발전은 이루어지지 않는다는 어두운 면을 보여주며 크롬에게 시장의 정복자 자리를 내주었다. 특히나 IE6 ~ 8는 웹 표준을 지키지 않아 많은 문제를 일으켰다. 그리고 2015년 1월, Windows 10 공개 행사에서 MS의 새로운 브라우저 엣지가 처음으로 공개된다. 그에 따라 IE는 더 이상 버전업 되지 않으며 레거시 지원만을 위해 보안 업데이트나 기술 지원만이 지속되게 된다. 엣지의 등장으로 한 시대를 평정했던 IE는 이제 역사의 뒤안길로 점차 사라지게 된다. 아래는 IE의 속도가 느리다는 것을 풍자한 만화이다.

![browser-conversation](https://images.hexdrinker.dev/web/browser-history/brwoser-conversation.jpeg)

최종적으로 브라우저 전쟁의 최종 승자는 MS도 모질라 재단도 아닌 구글에게 돌아갔다.

## 그 밖의 브라우저들

노르웨이의 오페라 소프트웨어가 개발한 **오페라**는 1996년에 처음 공개되었고 현재까지 쭉 잘 서비스되고 있다. 브라우저 역사의 주연은 아니지만 작은 조연으로 아주 가늘고 길게 시장의 한 자리를 차지하고 있는 셈이다. 오페라는 PC 시장보다는 태블릿 PC나 모바일 시장에서 훨씬 높은 점유율을 보이고 있다.

애플의 **사파리**는 macOS와 iOS, iPadOS 등을 이용하는 애플 제품의 기본 브라우저이다. 애플의 지원 아래에 애플 제품과 OS에서 절대적인 점유율을 차지하고 있다.

네이버의 **웨일**은 DEVIW 2016에 최초로 공개되었다. 크롬과 마찬가지로 크로미움 기반이고 크롬과 매우 흡사한 측면이 있다. 그러나 옴니태스킹, 팝업 정리, 이미지 번역 등의 자잘한 기능들이 많다.
0:{"buildId":"fIMFzVBp7PQWc8En8Qe49","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"max-w-6xl mx-auto px-4 py-12","children":["$","div",null,{"className":"flex gap-8 justify-center xl:justify-start","children":[["$","article",null,{"className":"flex-1 max-w-3xl","children":[["$","header",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-muted-foreground mb-4","children":["$","$L2",null,{"href":"/tech","className":"hover:text-foreground transition-colors capitalize","children":"tech"}]}],["$","h1",null,{"className":"text-4xl font-bold tracking-tight mb-3","children":"브라우저 역사 이야기"}],["$","div",null,{"className":"flex justify-between items-center gap-3 text-sm text-muted-foreground","children":[["$","time",null,{"dateTime":"2019-07-03T13:20","children":"Jul 03, 2019"}],["$","div",null,{"className":"flex items-center gap-3","children":[["$","$L3",null,{"slug":"browser-history"}],["$","span",null,{"children":"12 min read"}]]}]]}]]}],["$","hr",null,{"className":"border-border mb-8"}],["$","$L4",null,{"content":"$5"}],"$L6","$L7","$L8"]}],"$L9"]}]}],["$La","$Lb"],"$Lc"]}],"loading":null,"isPartial":false}
6:["$","div",null,{"className":"relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden","children":["$","$Ld",null,{"src":"https://images.hexdrinker.dev/thumbnails/browser-history.jpeg","alt":"브라우저 역사 이야기","fill":true,"className":"object-cover","priority":true}]}]
7:["$","div",null,{"className":"prose dark:prose-invert max-w-none","children":[["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"이번 글에서는 웹 브라우저의 무구한(..) 역사에 대해 알아보고자 한다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"웹 브라우저는 웹 서버와 통신하여 HTML 문서나 파일, 이미지 등의 리소스를 출력하는 GUI 기반의 소프트웨어이다. 대표적으로\nMS에서 개발한 인터넷 익스플로러와 엣지, 구글의 크롬, 모질라의 파이어폭스, 애플의 사파리, 오페라 등이 있다."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"태동","children":"태동"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["세계 최초의 브라우저는 인터넷을 탄생시킨 팀 버너스리가 1990년에 NeXTSTEP용으로 개발한 ",["$","strong",null,{"children":"WorldWideWeb"}],"이다. 이는 Objective-C로 개발되었고 시간이 흘러 ",["$","strong",null,{"children":"Nexus"}],"라는 이름으로 불리게 된다."]}],"\n",["$","pre",null,{"className":"my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm","children":["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"NeXTSTEP은 스티브 잡스가 애플에서 쫓겨난 후 설립한 NeXT에서 개발한 OS이다.\n"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/browser-history/mosaic.png","alt":"mosaic","className":"my-4 rounded-lg max-w-full h-auto"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["그 후 1992년 말을 기점으로 libwww, Line mode Browser, Erwise 등 여러 브라우저가 등장했고 1993년 NCSA의 마크 앤드리슨과 에릭 바나가 개발한 ",["$","strong",null,{"children":"MOSAIC"}],"이라는 이름의 브라우저가 출시했다. 이는 최초로 이미지, 음악 등의 멀티미디어를 바로 표시할 수 있는 기능을 있었고 이는 웹과 브라우저의 대중화를 이끌며 폭발적인 성장을 이룩했다. 이를 계기로 브라우저 전쟁의 시대가 본격적으로 열리게 된다."]}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"넷스케이프-네비게이터의-시대-1994--1995","children":"넷스케이프 네비게이터의 시대 (1994 ~ 1995)"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["모자익을 개발한 마크 앤드리슨은 NCSA를 떠나 넷스케이프 커뮤니케이션을 설립했고 모자익 넷스케이프를 개발한다. 이는 1994년 12월 정식 버전으로 발매되면서 ",["$","strong",null,{"children":"넷스케이프 네비게이터"}],"라는 이름으로 불리게 되었다."]}],"\n",["$","p",null,{"children":["$","img",null,{"className":"responsible width-90","src":"https://images.hexdrinker.dev/web/browser-history/netscape-navigator.png","alt":"netscape-navigator"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"모자익이 WWW의 부흥을 이끌었다면 넷스케이프 네비게이터는 보다 편리하고 뛰어난 성능을 드러내며 WWW의 활용을 일반화했다고 평가받는다. 당시 여러 브라우저들이 경쟁을 했으나 넷스케이프 네비게이터가 뛰어난 성능과 편의성을 바탕으로 경쟁 브라우저들을 압도하며 브라우저 시장을 정복하고 있었다."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"제-1차-브라우저-전쟁-1996--2008","children":"제 1차 브라우저 전쟁 (1996 ~ 2008)"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/browser-history/browser-war1.png","alt":"browser-war1","className":"my-4 rounded-lg max-w-full h-auto"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["스파이글래스 사는 초기 모자익의 기술과 상표 라이센스를 사서 새로운 브라우저를 내놓았지만 큰 주목을 받지 못한다. 하지만 MS에서 이를 사들여 웹 브라우저를 출시하는데 이것이 바로 ",["$","strong",null,{"children":"Internet Explorer"}],"이다. (아래서부터는 IE라고 하겠다.)"]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"초기 IE의 기능은 빈약했고 이미 시장은 넷스케이프 네비게이터의 독점체제였다. 그리고 이 자리를 굳건히 하기 위해 브라우저에 경량의 프로그래밍 언어를 임베디드하여 인터랙티브한 HTML을 제공하기로 결정하여 브랜든 아이크를 영입했다. 브랜든 아이크는 단 열흘 만에(...) 자바스크립트를 개발했고 넷스케이프 네비게이터 2.0는 자바스크립트가 내장되어 출시되었다. 그러나 IE는 MS의 전폭적인 지원을 받으며 성장했고 넷스케이프 네비게이터에 비해 특별하게 기술적인 강점이 존재하진 않았지만 MS의 마케팅 전략이 빛을 발하며 시장 점유율을 조금씩 차지하기 시작한다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"당시 MS는 Windows OS를 통해서 전세계의 OS 시장을 쓸어담으며 글로벌 기업으로 성장했으나 넷스케이프는 브라우저 하나로 먹고사는 작은 회사였다. Windows의 시장 점유율은 90%에 육박했으며 너무나 당연하게도 MS는 Windows OS에 기본 브라우저로 IE를 탑재시켰고 따로 브라우저를 설치할 일이 없어지게 되면서 사용자들은 자연스럽게 IE를 사용했고 다른 브라우저들은 하나둘 도태되기 시작했다."}],"\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d"]}]
8:["$","hr",null,{"className":"border-border my-12"}]
1f:T2062,
이번 글에서는 웹 브라우저의 무구한(..) 역사에 대해 알아보고자 한다.



웹 브라우저는 웹 서버와 통신하여 HTML 문서나 파일, 이미지 등의 리소스를 출력하는 GUI 기반의 소프트웨어이다. 대표적으로
MS에서 개발한 인터넷 익스플로러와 엣지, 구글의 크롬, 모질라의 파이어폭스, 애플의 사파리, 오페라 등이 있다.

## 태동

세계 최초의 브라우저는 인터넷을 탄생시킨 팀 버너스리가 1990년에 NeXTSTEP용으로 개발한 **WorldWideWeb**이다. 이는 Objective-C로 개발되었고 시간이 흘러 **Nexus**라는 이름으로 불리게 된다.

```
NeXTSTEP은 스티브 잡스가 애플에서 쫓겨난 후 설립한 NeXT에서 개발한 OS이다.
```

![mosaic](https://images.hexdrinker.dev/web/browser-history/mosaic.png)

그 후 1992년 말을 기점으로 libwww, Line mode Browser, Erwise 등 여러 브라우저가 등장했고 1993년 NCSA의 마크 앤드리슨과 에릭 바나가 개발한 **MOSAIC**이라는 이름의 브라우저가 출시했다. 이는 최초로 이미지, 음악 등의 멀티미디어를 바로 표시할 수 있는 기능을 있었고 이는 웹과 브라우저의 대중화를 이끌며 폭발적인 성장을 이룩했다. 이를 계기로 브라우저 전쟁의 시대가 본격적으로 열리게 된다.

## 넷스케이프 네비게이터의 시대 (1994 ~ 1995)

모자익을 개발한 마크 앤드리슨은 NCSA를 떠나 넷스케이프 커뮤니케이션을 설립했고 모자익 넷스케이프를 개발한다. 이는 1994년 12월 정식 버전으로 발매되면서 **넷스케이프 네비게이터**라는 이름으로 불리게 되었다.

<p>
  <img
    className='responsible width-90'
    src='https://images.hexdrinker.dev/web/browser-history/netscape-navigator.png'
    alt='netscape-navigator'
  />
</p>

모자익이 WWW의 부흥을 이끌었다면 넷스케이프 네비게이터는 보다 편리하고 뛰어난 성능을 드러내며 WWW의 활용을 일반화했다고 평가받는다. 당시 여러 브라우저들이 경쟁을 했으나 넷스케이프 네비게이터가 뛰어난 성능과 편의성을 바탕으로 경쟁 브라우저들을 압도하며 브라우저 시장을 정복하고 있었다.

## 제 1차 브라우저 전쟁 (1996 ~ 2008)

![browser-war1](https://images.hexdrinker.dev/web/browser-history/browser-war1.png)

스파이글래스 사는 초기 모자익의 기술과 상표 라이센스를 사서 새로운 브라우저를 내놓았지만 큰 주목을 받지 못한다. 하지만 MS에서 이를 사들여 웹 브라우저를 출시하는데 이것이 바로 **Internet Explorer**이다. (아래서부터는 IE라고 하겠다.)

초기 IE의 기능은 빈약했고 이미 시장은 넷스케이프 네비게이터의 독점체제였다. 그리고 이 자리를 굳건히 하기 위해 브라우저에 경량의 프로그래밍 언어를 임베디드하여 인터랙티브한 HTML을 제공하기로 결정하여 브랜든 아이크를 영입했다. 브랜든 아이크는 단 열흘 만에(...) 자바스크립트를 개발했고 넷스케이프 네비게이터 2.0는 자바스크립트가 내장되어 출시되었다. 그러나 IE는 MS의 전폭적인 지원을 받으며 성장했고 넷스케이프 네비게이터에 비해 특별하게 기술적인 강점이 존재하진 않았지만 MS의 마케팅 전략이 빛을 발하며 시장 점유율을 조금씩 차지하기 시작한다.

당시 MS는 Windows OS를 통해서 전세계의 OS 시장을 쓸어담으며 글로벌 기업으로 성장했으나 넷스케이프는 브라우저 하나로 먹고사는 작은 회사였다. Windows의 시장 점유율은 90%에 육박했으며 너무나 당연하게도 MS는 Windows OS에 기본 브라우저로 IE를 탑재시켰고 따로 브라우저를 설치할 일이 없어지게 되면서 사용자들은 자연스럽게 IE를 사용했고 다른 브라우저들은 하나둘 도태되기 시작했다.

넷스케이프 네비게이터도 예외는 아니었고 IE가 있음에도 넷스케이프 네비게이터를 설치해서 사용할 정도로 엄청난 차이가 존재하진 않았다. 이러한 끼워팔기 마케팅에 넷스케이프는 처참하게 추락하게 된다.

<p>
  <img
    className='responsible width-80'
    src='https://images.hexdrinker.dev/web/browser-history/windows98.png'
    alt='windows98'
  />
</p>

1998년 MS는 그 끼워팔기 때문에 반독점법 소송에 걸려 시정 명령을 받고 회사가 쪼개질 위기까지 갔지만 겨우 항소심에서 승리하여 막아냈고 넷스케이프는 재정 문제 등을 이유로 AOL에 인수당한다. MS는 소송 때문에 고생했지만 이미 시장은 IE가 점령한 상태였기 때문에 넷스케이프의 반등은 불가능했다. 이후 넷스케이프는 AOL의 대규모 정리매각 대상 중 하나가 되었고 이를 MS가 인수하게 된다.

결국 제 1차 브라우저 전쟁은 MS의 IE의 승리로 돌아갔고 2001~2004년, 이의 점유율은 90%를 호가했다. 특히 2002년엔 96%까지 치솟으며 IE는 전성기를 맞이한다. 한편 넷스케이프의 후계자들은 모질라 재단을 설립하여 오픈소스 기반의 웹 브라우저를 개발하는데 이것이 **파이어폭스**이다.

## 제 2차 브라우저 전쟁 (2009 ~ 2015)

<p>
  <img
    className='responsible width-80'
    src='https://images.hexdrinker.dev/web/browser-history/browser-war2.png'
    alt='browser-war2'
  />
</p>

넷스케이프의 실패는 모질라 재단에게 비영리라는 교훈을 주었다. ES 제정 정통성, 우수한 개발도구 지원 등을 토대로 IE를 상대로 선전하기 시작한다.

파이어폭스는 꾸준히 점유율을 높여갔지만 IE에 익숙해진 사용자들에게 큰 영향을 미치기는 어려웠고 MS 또한 아웃룩과의 연계, 표준화 거부 등을 통해서 IE의 점유율을 유지하고자 했다.

그러던 중 2008년 구글의 **크롬**이 혜성같이 등장한다. 크롬은 매우 뛰어난 속도와 가벼움을 기반으로 혁신적인 개발도구 제공 등을 내세우며 개발자와 사용자들로부터 많은 사랑을 받게 된다. 크롬은 파이어폭스가 10여년간 쌓아왔던 30% 가량의 점유율을 단 3년 만에 돌파하였고 2012년을 기점으로 MS의 점유율을 꺾었다.

IE는 독점 시장에서 기술적인 발전은 이루어지지 않는다는 어두운 면을 보여주며 크롬에게 시장의 정복자 자리를 내주었다. 특히나 IE6 ~ 8는 웹 표준을 지키지 않아 많은 문제를 일으켰다. 그리고 2015년 1월, Windows 10 공개 행사에서 MS의 새로운 브라우저 엣지가 처음으로 공개된다. 그에 따라 IE는 더 이상 버전업 되지 않으며 레거시 지원만을 위해 보안 업데이트나 기술 지원만이 지속되게 된다. 엣지의 등장으로 한 시대를 평정했던 IE는 이제 역사의 뒤안길로 점차 사라지게 된다. 아래는 IE의 속도가 느리다는 것을 풍자한 만화이다.

![browser-conversation](https://images.hexdrinker.dev/web/browser-history/brwoser-conversation.jpeg)

최종적으로 브라우저 전쟁의 최종 승자는 MS도 모질라 재단도 아닌 구글에게 돌아갔다.

## 그 밖의 브라우저들

노르웨이의 오페라 소프트웨어가 개발한 **오페라**는 1996년에 처음 공개되었고 현재까지 쭉 잘 서비스되고 있다. 브라우저 역사의 주연은 아니지만 작은 조연으로 아주 가늘고 길게 시장의 한 자리를 차지하고 있는 셈이다. 오페라는 PC 시장보다는 태블릿 PC나 모바일 시장에서 훨씬 높은 점유율을 보이고 있다.

애플의 **사파리**는 macOS와 iOS, iPadOS 등을 이용하는 애플 제품의 기본 브라우저이다. 애플의 지원 아래에 애플 제품과 OS에서 절대적인 점유율을 차지하고 있다.

네이버의 **웨일**은 DEVIW 2016에 최초로 공개되었다. 크롬과 마찬가지로 크로미움 기반이고 크롬과 매우 흡사한 측면이 있다. 그러나 옴니태스킹, 팝업 정리, 이미지 번역 등의 자잘한 기능들이 많다.
9:["$","aside",null,{"className":"hidden xl:block w-64 shrink-0 self-start sticky top-24","children":["$","$L1e",null,{"content":"$1f"}]}]
a:["$","script","script-0",{"src":"/_next/static/chunks/8ba36b395f30a90d.js","async":true}]
b:["$","script","script-1",{"src":"/_next/static/chunks/cc80ad68b16f74f3.js","async":true}]
c:["$","$L20",null,{"children":["$","$21",null,{"name":"Next.MetadataOutlet","children":"$@22"}]}]
e:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"넷스케이프 네비게이터도 예외는 아니었고 IE가 있음에도 넷스케이프 네비게이터를 설치해서 사용할 정도로 엄청난 차이가 존재하진 않았다. 이러한 끼워팔기 마케팅에 넷스케이프는 처참하게 추락하게 된다."}]
f:["$","p",null,{"children":["$","img",null,{"className":"responsible width-80","src":"https://images.hexdrinker.dev/web/browser-history/windows98.png","alt":"windows98"}]}]
10:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"1998년 MS는 그 끼워팔기 때문에 반독점법 소송에 걸려 시정 명령을 받고 회사가 쪼개질 위기까지 갔지만 겨우 항소심에서 승리하여 막아냈고 넷스케이프는 재정 문제 등을 이유로 AOL에 인수당한다. MS는 소송 때문에 고생했지만 이미 시장은 IE가 점령한 상태였기 때문에 넷스케이프의 반등은 불가능했다. 이후 넷스케이프는 AOL의 대규모 정리매각 대상 중 하나가 되었고 이를 MS가 인수하게 된다."}]
11:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["결국 제 1차 브라우저 전쟁은 MS의 IE의 승리로 돌아갔고 2001~2004년, 이의 점유율은 90%를 호가했다. 특히 2002년엔 96%까지 치솟으며 IE는 전성기를 맞이한다. 한편 넷스케이프의 후계자들은 모질라 재단을 설립하여 오픈소스 기반의 웹 브라우저를 개발하는데 이것이 ",["$","strong",null,{"children":"파이어폭스"}],"이다."]}]
12:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"제-2차-브라우저-전쟁-2009--2015","children":"제 2차 브라우저 전쟁 (2009 ~ 2015)"}]
13:["$","p",null,{"children":["$","img",null,{"className":"responsible width-80","src":"https://images.hexdrinker.dev/web/browser-history/browser-war2.png","alt":"browser-war2"}]}]
14:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"넷스케이프의 실패는 모질라 재단에게 비영리라는 교훈을 주었다. ES 제정 정통성, 우수한 개발도구 지원 등을 토대로 IE를 상대로 선전하기 시작한다."}]
15:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"파이어폭스는 꾸준히 점유율을 높여갔지만 IE에 익숙해진 사용자들에게 큰 영향을 미치기는 어려웠고 MS 또한 아웃룩과의 연계, 표준화 거부 등을 통해서 IE의 점유율을 유지하고자 했다."}]
16:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["그러던 중 2008년 구글의 ",["$","strong",null,{"children":"크롬"}],"이 혜성같이 등장한다. 크롬은 매우 뛰어난 속도와 가벼움을 기반으로 혁신적인 개발도구 제공 등을 내세우며 개발자와 사용자들로부터 많은 사랑을 받게 된다. 크롬은 파이어폭스가 10여년간 쌓아왔던 30% 가량의 점유율을 단 3년 만에 돌파하였고 2012년을 기점으로 MS의 점유율을 꺾었다."]}]
17:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"IE는 독점 시장에서 기술적인 발전은 이루어지지 않는다는 어두운 면을 보여주며 크롬에게 시장의 정복자 자리를 내주었다. 특히나 IE6 ~ 8는 웹 표준을 지키지 않아 많은 문제를 일으켰다. 그리고 2015년 1월, Windows 10 공개 행사에서 MS의 새로운 브라우저 엣지가 처음으로 공개된다. 그에 따라 IE는 더 이상 버전업 되지 않으며 레거시 지원만을 위해 보안 업데이트나 기술 지원만이 지속되게 된다. 엣지의 등장으로 한 시대를 평정했던 IE는 이제 역사의 뒤안길로 점차 사라지게 된다. 아래는 IE의 속도가 느리다는 것을 풍자한 만화이다."}]
18:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/browser-history/brwoser-conversation.jpeg","alt":"browser-conversation","className":"my-4 rounded-lg max-w-full h-auto"}]}]
19:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"최종적으로 브라우저 전쟁의 최종 승자는 MS도 모질라 재단도 아닌 구글에게 돌아갔다."}]
1a:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"그-밖의-브라우저들","children":"그 밖의 브라우저들"}]
1b:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["노르웨이의 오페라 소프트웨어가 개발한 ",["$","strong",null,{"children":"오페라"}],"는 1996년에 처음 공개되었고 현재까지 쭉 잘 서비스되고 있다. 브라우저 역사의 주연은 아니지만 작은 조연으로 아주 가늘고 길게 시장의 한 자리를 차지하고 있는 셈이다. 오페라는 PC 시장보다는 태블릿 PC나 모바일 시장에서 훨씬 높은 점유율을 보이고 있다."]}]
1c:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["애플의 ",["$","strong",null,{"children":"사파리"}],"는 macOS와 iOS, iPadOS 등을 이용하는 애플 제품의 기본 브라우저이다. 애플의 지원 아래에 애플 제품과 OS에서 절대적인 점유율을 차지하고 있다."]}]
1d:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["네이버의 ",["$","strong",null,{"children":"웨일"}],"은 DEVIW 2016에 최초로 공개되었다. 크롬과 마찬가지로 크로미움 기반이고 크롬과 매우 흡사한 측면이 있다. 그러나 옴니태스킹, 팝업 정리, 이미지 번역 등의 자잘한 기능들이 많다."]}]
22:null
