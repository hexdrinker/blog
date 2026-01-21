1:"$Sreact.fragment"
2:I[8331,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],""]
3:I[17733,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"ViewCounter"]
4:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"MobileTableOfContents"]
d:I[72039,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"Image"]
16:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"TableOfContents"]
18:I[2718,["/_next/static/chunks/483a12865e0bba97.js","/_next/static/chunks/1d3be43a6dda29b7.js"],"OutletBoundary"]
19:"$Sreact.suspense"
:HL["https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-1.png","image"]
:HL["https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-2.png","image"]
5:T151c,


HTTP는 비상태기반(stateless) 프로토콜이다.

자, 이게 뭔 소리냐면 클라이언트와 서버가 상호 간에 했던 리퀘스트, 리스폰스의 상태를 관리를 안한다는 뜻이다. 과거에 했던 통신을 기억하지 못하므로 과거의 통신을 기반으로 현재의 리퀘스트를 처리를 할 수 없다는 것을 말한다.

이런 방식의 장점으로는 상태를 유지할 필요가 없으니까 **서버 컴퓨터의 CPU나 메모리 같은 리소스의 소비를 억제**할 수 있다. 근데 상태를 기억해야할 필요가 있을 때가 있다면 어떡할까? 분명 새로운 페이지로 이동할 때 마다 매번 로그인을 해야한다는 것은 말도 안되는 일이다.

이러한 특징을 살리면서 위와 같은 문제를 해결하기 위해 **쿠키**란 것이 도입되었다.

## 쿠키

쿠키는 리퀘스트와 리스폰스에 쿠키 정보를 추가하여 클라이언트의 상태를 파악하기 위한 도입되었으며 클라이언트의 로컬(브라우저)에 저장되는 key-value 형태의 작은 텍스트 데이터 파일이다. 보통 이름(key), 값(value), 만료 날짜, 경로 정보 등을 포함한다.

### 쿠키 프로세스

![cookie-process-1](https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-1.png)

브라우저가 특정 웹 페이지에 접속하거나 리소스를 요청한다. 그러면 서버는 요청받은 웹 페이지나 리소스와 함께 쿠키도 발행하여 함께 전송한다.

클라이언트는 전송받은 쿠키를 로컬에 저장한다.

![cookie-process-2](https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-2.png)

그 다음 번에 클라이언트가 같은 웹 페이지(서버)에 접속하거나 리소스를 요청할 때 갖고있던 쿠키를 함께 보낸다. 서버는 클라이언트가 보낸 쿠키를 확인하여 어느 클라이언트에서 접속했는지 서버 상의 기록을 확인하여 이전 상태를 알 수 있다.

쿠키는 자동 로그인, 오늘 또는 일정 기간 동안 더 이상 창을 보지 않음, 쇼핑몰의 장바구니 등에 이용된다.

### 쿠키의 단점

완벽한 기술은 없듯 쿠키도 단점이 존재한다.

1. 용량

   쿠키는 클라이언트에 최대 300개까지 저장할 수 있으며 한 쿠키의 용량은 최대 4kb로 제한된다. 또 하나의 도메인 당 20개의 값을 가질 수 있다.

2. 보안

   클라이언트의 로컬에도 저장되고 HTTP 요청에도 함께 포함되어 전송된다. 전송될 때 별다른 암호화를 거치지 않으므로 로컬이나 요청이 도청 당하면 개인정보가 유출되는 등의 문제가 발생할 수 있다.

3. 리소스

   작은 용량이지만 매 HTTP 요청에 포함되어 전송되므로 필요하지 않을 경우엔 리소스의 낭비라고 볼 수 있다.

## 세션

세션은 통신을 위해 클라이언트와 서버가 **연결된 순간부터 통신이 종료될 때까지의 시간**을 의미한다.

클라이언트가 서버에 접속하면 서버는 세션 객체를 생성하여 클라이언트마다 고유한 ID를 부여한다. 이 세션 ID는 세션 쿠키라고도 불리며 쿠키를 통해 오고가지만 쿠키와는 달리 정보를 서버에 저장하므로 보안적인 면에서는 쿠키보다 뛰어나며 용량의 제한 또한 존재하지 않는다. 세션이 종료될 때 세션 ID값 또한 파기된다.

쿠키는 정보가 클라이언트에 존재하고 이를 통해 요청을 하므로 속도가 빠르나 세션은 정보가 서버에 존재하므로 서버 리소스가 이용되기 때문에 비교적 느린 속도를 낸다. 세션이 보안적으로 뛰어나고 용량 제한도 없으나 무분별한 세션 사용은 서버 리소스를 필요 이상으로 소비할 수 있으므로 용도에 맞게 잘 사용하여야한다.

세션은 쿠키를 이용하는 한 방식 중 하나일 뿐 쿠키와 세션은 반대 관계에 있지 않다. 어떤 서비스를 어떻게 운영할 것이냐를 고려하여 목적에 맞게 이용하면 된다. 주로 로그인 인증 정보 유지에 쓰인다.

> 클라이언트는 다수이고 서버는 소수, 클라이언트는 믿을 수 없고 중요한 정보나 처리는 서버에서 다뤄야한다는 것을 인지해두자.

## 스토리지

스토리지는 HTML5에서 추가된 스펙으로 쿠키와 마찬가지로 key-value 형태로 데이터를 저장하는 저장소이다. 쿠키의 문제점을 보완하기 위해 등장한 기술이므로 쿠키의 단점 대부분을 보완했다.

스토리지는 브라우저마다 상이하지만 표준 스펙에 의하면 5mb 정도가 권장되어 용량도 꽤 큰 편이고 HTTP 요청에 포함되지 않아서 서버의 리소스 낭비를 고려할 필요도 없다. 표준을 지켜서 설계한다면 보안을 강화할 수도 있다.

스토리지는 로컬 스토리지와 세션 스토리지로 나눌 수 있는데 이 둘의 차이는 **영구성**이다.

로컬 스토리지는 특별히 지우지 않는 한 브라우저에 계속 남아있지만 세션 스토리지는 브라우저가 종료되면 알아서 제거된다. 스토리지는 HTML5에 추가된 기술인만큼 브라우저, 디바이스 등 환경을 많이 타서 제대로 작동하지 않을 수도 있다.
0:{"buildId":"fIMFzVBp7PQWc8En8Qe49","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"max-w-6xl mx-auto px-4 py-12","children":["$","div",null,{"className":"flex gap-8 justify-center xl:justify-start","children":[["$","article",null,{"className":"flex-1 max-w-3xl","children":[["$","header",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-muted-foreground mb-4","children":["$","$L2",null,{"href":"/tech","className":"hover:text-foreground transition-colors capitalize","children":"tech"}]}],["$","h1",null,{"className":"text-4xl font-bold tracking-tight mb-3","children":"쿠키와 세션 그리고 스토리지"}],["$","div",null,{"className":"flex justify-between items-center gap-3 text-sm text-muted-foreground","children":[["$","time",null,{"dateTime":"2019-12-12T18:27","children":"Dec 12, 2019"}],["$","div",null,{"className":"flex items-center gap-3","children":[["$","$L3",null,{"slug":"cookie-and-session-and-storage"}],["$","span",null,{"children":"8 min read"}]]}]]}]]}],["$","hr",null,{"className":"border-border mb-8"}],["$","$L4",null,{"content":"$5"}],"$L6","$L7","$L8"]}],"$L9"]}]}],["$La","$Lb"],"$Lc"]}],"loading":null,"isPartial":false}
6:["$","div",null,{"className":"relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden","children":["$","$Ld",null,{"src":"https://images.hexdrinker.dev/thumbnails/cookie-and-session-and-storage.jpeg","alt":"쿠키와 세션 그리고 스토리지","fill":true,"className":"object-cover","priority":true}]}]
7:["$","div",null,{"className":"prose dark:prose-invert max-w-none","children":[["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"HTTP는 비상태기반(stateless) 프로토콜이다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"자, 이게 뭔 소리냐면 클라이언트와 서버가 상호 간에 했던 리퀘스트, 리스폰스의 상태를 관리를 안한다는 뜻이다. 과거에 했던 통신을 기억하지 못하므로 과거의 통신을 기반으로 현재의 리퀘스트를 처리를 할 수 없다는 것을 말한다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["이런 방식의 장점으로는 상태를 유지할 필요가 없으니까 ",["$","strong",null,{"children":"서버 컴퓨터의 CPU나 메모리 같은 리소스의 소비를 억제"}],"할 수 있다. 근데 상태를 기억해야할 필요가 있을 때가 있다면 어떡할까? 분명 새로운 페이지로 이동할 때 마다 매번 로그인을 해야한다는 것은 말도 안되는 일이다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["이러한 특징을 살리면서 위와 같은 문제를 해결하기 위해 ",["$","strong",null,{"children":"쿠키"}],"란 것이 도입되었다."]}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"쿠키","children":"쿠키"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"쿠키는 리퀘스트와 리스폰스에 쿠키 정보를 추가하여 클라이언트의 상태를 파악하기 위한 도입되었으며 클라이언트의 로컬(브라우저)에 저장되는 key-value 형태의 작은 텍스트 데이터 파일이다. 보통 이름(key), 값(value), 만료 날짜, 경로 정보 등을 포함한다."}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"쿠키-프로세스","children":"쿠키 프로세스"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-1.png","alt":"cookie-process-1","className":"my-4 rounded-lg max-w-full h-auto"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"브라우저가 특정 웹 페이지에 접속하거나 리소스를 요청한다. 그러면 서버는 요청받은 웹 페이지나 리소스와 함께 쿠키도 발행하여 함께 전송한다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"클라이언트는 전송받은 쿠키를 로컬에 저장한다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-2.png","alt":"cookie-process-2","className":"my-4 rounded-lg max-w-full h-auto"}]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"그 다음 번에 클라이언트가 같은 웹 페이지(서버)에 접속하거나 리소스를 요청할 때 갖고있던 쿠키를 함께 보낸다. 서버는 클라이언트가 보낸 쿠키를 확인하여 어느 클라이언트에서 접속했는지 서버 상의 기록을 확인하여 이전 상태를 알 수 있다."}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"쿠키는 자동 로그인, 오늘 또는 일정 기간 동안 더 이상 창을 보지 않음, 쇼핑몰의 장바구니 등에 이용된다."}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"쿠키의-단점","children":"쿠키의 단점"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"완벽한 기술은 없듯 쿠키도 단점이 존재한다."}],"\n",["$","ol",null,{"className":"my-4 ml-6 list-decimal space-y-2","children":["\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"용량"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"쿠키는 클라이언트에 최대 300개까지 저장할 수 있으며 한 쿠키의 용량은 최대 4kb로 제한된다. 또 하나의 도메인 당 20개의 값을 가질 수 있다."}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"보안"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"클라이언트의 로컬에도 저장되고 HTTP 요청에도 함께 포함되어 전송된다. 전송될 때 별다른 암호화를 거치지 않으므로 로컬이나 요청이 도청 당하면 개인정보가 유출되는 등의 문제가 발생할 수 있다."}],"\n"]}],"\n",["$","li",null,{"className":"leading-7","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"리소스"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"작은 용량이지만 매 HTTP 요청에 포함되어 전송되므로 필요하지 않을 경우엔 리소스의 낭비라고 볼 수 있다."}],"\n"]}],"\n"]}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"세션","children":"세션"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["세션은 통신을 위해 클라이언트와 서버가 ",["$","strong",null,{"children":"연결된 순간부터 통신이 종료될 때까지의 시간"}],"을 의미한다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"클라이언트가 서버에 접속하면 서버는 세션 객체를 생성하여 클라이언트마다 고유한 ID를 부여한다. 이 세션 ID는 세션 쿠키라고도 불리며 쿠키를 통해 오고가지만 쿠키와는 달리 정보를 서버에 저장하므로 보안적인 면에서는 쿠키보다 뛰어나며 용량의 제한 또한 존재하지 않는다. 세션이 종료될 때 세션 ID값 또한 파기된다."}],"\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15"]}]
8:["$","hr",null,{"className":"border-border my-12"}]
17:T151c,


HTTP는 비상태기반(stateless) 프로토콜이다.

자, 이게 뭔 소리냐면 클라이언트와 서버가 상호 간에 했던 리퀘스트, 리스폰스의 상태를 관리를 안한다는 뜻이다. 과거에 했던 통신을 기억하지 못하므로 과거의 통신을 기반으로 현재의 리퀘스트를 처리를 할 수 없다는 것을 말한다.

이런 방식의 장점으로는 상태를 유지할 필요가 없으니까 **서버 컴퓨터의 CPU나 메모리 같은 리소스의 소비를 억제**할 수 있다. 근데 상태를 기억해야할 필요가 있을 때가 있다면 어떡할까? 분명 새로운 페이지로 이동할 때 마다 매번 로그인을 해야한다는 것은 말도 안되는 일이다.

이러한 특징을 살리면서 위와 같은 문제를 해결하기 위해 **쿠키**란 것이 도입되었다.

## 쿠키

쿠키는 리퀘스트와 리스폰스에 쿠키 정보를 추가하여 클라이언트의 상태를 파악하기 위한 도입되었으며 클라이언트의 로컬(브라우저)에 저장되는 key-value 형태의 작은 텍스트 데이터 파일이다. 보통 이름(key), 값(value), 만료 날짜, 경로 정보 등을 포함한다.

### 쿠키 프로세스

![cookie-process-1](https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-1.png)

브라우저가 특정 웹 페이지에 접속하거나 리소스를 요청한다. 그러면 서버는 요청받은 웹 페이지나 리소스와 함께 쿠키도 발행하여 함께 전송한다.

클라이언트는 전송받은 쿠키를 로컬에 저장한다.

![cookie-process-2](https://images.hexdrinker.dev/web/cookie-and-session-and-storage/cookie-process-2.png)

그 다음 번에 클라이언트가 같은 웹 페이지(서버)에 접속하거나 리소스를 요청할 때 갖고있던 쿠키를 함께 보낸다. 서버는 클라이언트가 보낸 쿠키를 확인하여 어느 클라이언트에서 접속했는지 서버 상의 기록을 확인하여 이전 상태를 알 수 있다.

쿠키는 자동 로그인, 오늘 또는 일정 기간 동안 더 이상 창을 보지 않음, 쇼핑몰의 장바구니 등에 이용된다.

### 쿠키의 단점

완벽한 기술은 없듯 쿠키도 단점이 존재한다.

1. 용량

   쿠키는 클라이언트에 최대 300개까지 저장할 수 있으며 한 쿠키의 용량은 최대 4kb로 제한된다. 또 하나의 도메인 당 20개의 값을 가질 수 있다.

2. 보안

   클라이언트의 로컬에도 저장되고 HTTP 요청에도 함께 포함되어 전송된다. 전송될 때 별다른 암호화를 거치지 않으므로 로컬이나 요청이 도청 당하면 개인정보가 유출되는 등의 문제가 발생할 수 있다.

3. 리소스

   작은 용량이지만 매 HTTP 요청에 포함되어 전송되므로 필요하지 않을 경우엔 리소스의 낭비라고 볼 수 있다.

## 세션

세션은 통신을 위해 클라이언트와 서버가 **연결된 순간부터 통신이 종료될 때까지의 시간**을 의미한다.

클라이언트가 서버에 접속하면 서버는 세션 객체를 생성하여 클라이언트마다 고유한 ID를 부여한다. 이 세션 ID는 세션 쿠키라고도 불리며 쿠키를 통해 오고가지만 쿠키와는 달리 정보를 서버에 저장하므로 보안적인 면에서는 쿠키보다 뛰어나며 용량의 제한 또한 존재하지 않는다. 세션이 종료될 때 세션 ID값 또한 파기된다.

쿠키는 정보가 클라이언트에 존재하고 이를 통해 요청을 하므로 속도가 빠르나 세션은 정보가 서버에 존재하므로 서버 리소스가 이용되기 때문에 비교적 느린 속도를 낸다. 세션이 보안적으로 뛰어나고 용량 제한도 없으나 무분별한 세션 사용은 서버 리소스를 필요 이상으로 소비할 수 있으므로 용도에 맞게 잘 사용하여야한다.

세션은 쿠키를 이용하는 한 방식 중 하나일 뿐 쿠키와 세션은 반대 관계에 있지 않다. 어떤 서비스를 어떻게 운영할 것이냐를 고려하여 목적에 맞게 이용하면 된다. 주로 로그인 인증 정보 유지에 쓰인다.

> 클라이언트는 다수이고 서버는 소수, 클라이언트는 믿을 수 없고 중요한 정보나 처리는 서버에서 다뤄야한다는 것을 인지해두자.

## 스토리지

스토리지는 HTML5에서 추가된 스펙으로 쿠키와 마찬가지로 key-value 형태로 데이터를 저장하는 저장소이다. 쿠키의 문제점을 보완하기 위해 등장한 기술이므로 쿠키의 단점 대부분을 보완했다.

스토리지는 브라우저마다 상이하지만 표준 스펙에 의하면 5mb 정도가 권장되어 용량도 꽤 큰 편이고 HTTP 요청에 포함되지 않아서 서버의 리소스 낭비를 고려할 필요도 없다. 표준을 지켜서 설계한다면 보안을 강화할 수도 있다.

스토리지는 로컬 스토리지와 세션 스토리지로 나눌 수 있는데 이 둘의 차이는 **영구성**이다.

로컬 스토리지는 특별히 지우지 않는 한 브라우저에 계속 남아있지만 세션 스토리지는 브라우저가 종료되면 알아서 제거된다. 스토리지는 HTML5에 추가된 기술인만큼 브라우저, 디바이스 등 환경을 많이 타서 제대로 작동하지 않을 수도 있다.
9:["$","aside",null,{"className":"hidden xl:block w-64 shrink-0 self-start sticky top-24","children":["$","$L16",null,{"content":"$17"}]}]
a:["$","script","script-0",{"src":"/_next/static/chunks/8ba36b395f30a90d.js","async":true}]
b:["$","script","script-1",{"src":"/_next/static/chunks/cc80ad68b16f74f3.js","async":true}]
c:["$","$L18",null,{"children":["$","$19",null,{"name":"Next.MetadataOutlet","children":"$@1a"}]}]
e:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"쿠키는 정보가 클라이언트에 존재하고 이를 통해 요청을 하므로 속도가 빠르나 세션은 정보가 서버에 존재하므로 서버 리소스가 이용되기 때문에 비교적 느린 속도를 낸다. 세션이 보안적으로 뛰어나고 용량 제한도 없으나 무분별한 세션 사용은 서버 리소스를 필요 이상으로 소비할 수 있으므로 용도에 맞게 잘 사용하여야한다."}]
f:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"세션은 쿠키를 이용하는 한 방식 중 하나일 뿐 쿠키와 세션은 반대 관계에 있지 않다. 어떤 서비스를 어떻게 운영할 것이냐를 고려하여 목적에 맞게 이용하면 된다. 주로 로그인 인증 정보 유지에 쓰인다."}]
10:["$","blockquote",null,{"className":"my-4 border-l-2 border-border pl-4 text-muted-foreground","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"클라이언트는 다수이고 서버는 소수, 클라이언트는 믿을 수 없고 중요한 정보나 처리는 서버에서 다뤄야한다는 것을 인지해두자."}],"\n"]}]
11:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"스토리지","children":"스토리지"}]
12:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"스토리지는 HTML5에서 추가된 스펙으로 쿠키와 마찬가지로 key-value 형태로 데이터를 저장하는 저장소이다. 쿠키의 문제점을 보완하기 위해 등장한 기술이므로 쿠키의 단점 대부분을 보완했다."}]
13:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"스토리지는 브라우저마다 상이하지만 표준 스펙에 의하면 5mb 정도가 권장되어 용량도 꽤 큰 편이고 HTTP 요청에 포함되지 않아서 서버의 리소스 낭비를 고려할 필요도 없다. 표준을 지켜서 설계한다면 보안을 강화할 수도 있다."}]
14:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["스토리지는 로컬 스토리지와 세션 스토리지로 나눌 수 있는데 이 둘의 차이는 ",["$","strong",null,{"children":"영구성"}],"이다."]}]
15:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"로컬 스토리지는 특별히 지우지 않는 한 브라우저에 계속 남아있지만 세션 스토리지는 브라우저가 종료되면 알아서 제거된다. 스토리지는 HTML5에 추가된 기술인만큼 브라우저, 디바이스 등 환경을 많이 타서 제대로 작동하지 않을 수도 있다."}]
1a:null
