1:"$Sreact.fragment"
2:I[8331,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],""]
3:I[17733,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"ViewCounter"]
4:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"MobileTableOfContents"]
d:I[72039,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"Image"]
31:I[86902,["/_next/static/chunks/561d09b2dcace1dd.js","/_next/static/chunks/34f3c6f00b149678.js","/_next/static/chunks/8ba36b395f30a90d.js","/_next/static/chunks/cc80ad68b16f74f3.js"],"TableOfContents"]
33:I[2718,["/_next/static/chunks/483a12865e0bba97.js","/_next/static/chunks/1d3be43a6dda29b7.js"],"OutletBoundary"]
34:"$Sreact.suspense"
:HL["https://images.hexdrinker.dev/web/address-story/url-structure.png","image"]
5:T297f,
사람들은 웹 브라우저를 띄워 편하게 그들이 기억하고 있는 주소를 입력하여 웹 페이지에 접근한다.  
사람들 사이에서도 웹 사이트를 공유할 때 링크 또는 URL을 주고 받는다는 표현을 많이 쓴다.  
이렇게 URL이란 단어는 일상적으로 우리 삶에서 찾아볼 수 있다.

이 포스트는 URL을 시작으로 인터넷 세계에서의 주소에 대해서 알아볼 것이다.



## URL

URL은 **U**niform **R**esource **L**ocator의 약자로 번역을 하자면 통합 자원 지시자이다.(한글이 더 어렵다..)  
URL은 네트워크 상의 리소스가 구체적으로 **어디에 위치**하는지 알려주는 규약이다. 흔히 웹 페이지의 주소라고들 알고 있지만 웹 페이지의 주소를 포함하여 네트워크 상의 모든 자원을 나타낼 수 있다.

쉽게 말하자면 인터넷 상에서 **리소스의 위치**이다. 정확히 어디에 위치하며 어떻게 접근할 수 있는지로 리소스를 식별한다. 한 가지 뚜렷한 특징이 있다면 URL은 **특정 순간의 리소스의 위치**일 뿐이지 실제 리소스 객체 자체나 객체의 이름이 아니다. 그러므로 그 위치(URL)가 변경되면 리소스에 접근할 수 없다는 단점이 있다.

URI라고 URL과 생김새가 비슷한 것이 존재한다. URI에 대해서도 알아보자.

## URI

URI는 **U**niform **R**esource **I**dentifier의 약자로 한글로는 통합 자원 식별자이다.

인터넷에 존재하는 리소스를 나타내는 **유일한 주소**이다. 쉽게 말하면 **리소스를 식별하기 위한 문자열 전반**을 말한다. URL이 리소스의 위치(장소) 정보라면 URI는 리소스를 식별하기 위한 정보를 나타낸다. URL과 URN은 URI의 서브셋이다.

URL을 좀 더 잘 이해하기 위해서는 URL의 구성과 웹 환경의 발전에 대한 이야기를 알면 도움이 될 것이다.

## URL의 구성

![url-structure](https://images.hexdrinker.dev/web/address-story/url-structure.png)

### 스키마

스키마는 프로토콜을 나타낸다. 브라우저가 어떤 프로토콜을 이용하여 데이터를 교환하는지를 말해준다. 보통 웹 사이트들은 http 또는 https이나 mailto나 ftp도 가능하다.

### 자격정보

일부 리소스를 획득하기 위해서는 자격정보가 필요하다. 유저명과 패스워드를 지정할 수 있다. 이것은 옵션이다.

### 호스트 주소

리소스를 보유한 서버 호스트 컴퓨터의 주소이다. **도메인 네임**이라고도 불린다. 직접 IP 주소를 입력하는 것도 가능하다.

위 호스트 주소를 보면 www.example.kr 이렇게 .(dot)을 통해서 구분지어져 있다. 이는 계층적 구조를 표현한 것으로 계층은 우측부터 시작한다.
가장 우측 레이블인 kr은 가장 최상위 도메인이고 example은 kr의 서브 도메인이다. www는 example.kr의 서브 도메인이다. 서브 도메인은 127단계까지 가능하다.

### 포트 번호

서버의 포트 번호이다. 서버의 리소스에 접근하기 위한 gate라고 볼 수 있다.

### 파일 경로

서버에서 리소스의 경로를 나타낸다. 초기의 웹에서는 물리적으로 파일의 위치를 나타냈으나 최근에는 실제 물리적 경로를 나타내지 않고 서버에서 추상화하여 보여준다.

### 쿼리 스트링

지정된 리소스에 파라미터를 넘겨주기 위해 이용된다. 이것은 옵션이다.

### 프래그먼트 식별자

리소스 내에서 서브 리소스를 가리키기 위해서 이용된다. 예를 들어서 HTML 문서 내에서 h1~h6 태그로 작성된 텍스트의 위치로 프래그먼트 식별자를 통해 이동할 수 있다. 이것은 옵션이다.

## 웹 환경의 발전

구 시대의 웹은 단순했다. 서버에서는 리소스를 보관하고 있고 클라이언트에서 리소스 요청이 온다면 그것을 보여주기만 하면 됐다. 그래서 클라이언트는 html 파일의 위치를 요청하면 문제가 없었다.

그러나 웹이 발전하게되어 한 페이지 내에서 실시간으로 데이터를 다루는 일이 빈번하게 이루어지는 등 과거보다 많이 복잡해졌다. 클라이언트는 다양한 요청을 하고 요즘의 웹이 리소스의 위치만을 요청하고 응답받는 구조를 유지하기엔 많은 기능을 담고 있다.

그래서 서버는 요청 URL을 rewrite하는 등의 변화가 일어났다.

> rewrite란 클라이언트 리퀘스트 헤더의 URL을 특정 규칙에 따라 변경하여 리스폰스하는 것을 말한다. 이는 웹 서비스를 보다 유연하고 시맨틱하게 만든다.

예를 들어서 당장 이 포스트의 주소만 하더라도 `https://hexdrinker.dev/blog/web/address-story`이다. 이는 hexdrinker.dev라는 도메인 네임을 가진 서버의 web 디렉토리 밑에 address-story란 파일이 있는 것을 말할까? 그럴 수도 있지만 아닐 확률이 높다. 어느 특정 경로에 위치한 이 포스트 파일(리소스)의 주소를 시맨틱하게 rewrite하여 제공함으로서 보다 직관적이고 알기 쉬운 웹 환경을 조성한다.

이렇듯 최근의 웹의 주소는 URL만으로는 설명하기가 어렵고 URL로 제공되는 웹 사이트도 있지만 진보된 웹 환경에서는 URL이 아니라 URI라고 보는 것이 적합하다.

## URN

위에서 URL과 URN은 URI의 서브셋이라고 했다. URN에 대해서도 잠깐 언급하도록 하겠다.

URN은 **U**niform **R**esourcee **N**ame의 약자로 통합 자원 이름이라고 한다.

보통 URL의 경우 리소스의 위치가 바뀐다면 기존의 URL로는 해당 리소스에 접근할 수가 없다. 이런 URL의 한계(특정 순간의 리소스의 위치를 나타내는)로 인해 URN 개발이 착수되었다. URN은 리소스의 위치에 영향을 받지 않는 리소스 객체의 **고유한 이름**을 말한다. 그렇기 때문에 리소스의 위치가 여기저기 옮겨져도 문제없이 작동한다.

현재 웹은 URL 방식을 사용하고 있는데 URN 방식으로의 변경은 매우 크고 어려운 일이다. 표준도 신중하게 정해야하고 수 많은 브라우저 벤더들과의 협의도 필요하다. URL 방식은 뚜렷한 한계를 지니고 있지만 URN 방식으로 완전히 대체할 수 있는 환경이 준비되기 전까지는 계속 쓰일 것이다.

## IP 주소

웹의 주소, 호스트의 주소라고 불리는 것의 실체는 **IP(Internet Protocol) 주소**이다. 컴퓨터 간의 네트워크 통신을 위해서는 상대 컴퓨터가 네트워크 상(L3, 네트워크 레이어)에서 어디에 위치하는지(논리적 주소)를 알아야한다. 즉, 네트워크 레이어에서의 컴퓨터의 논리적 위치를 IP 주소라고 하며 IP 주소를 통해 컴퓨터를 식별할 수 있다.

> 호스트란 데스크톱, 랩톱, 스마트폰, 태블릿, TV 등 인터넷과 연결되는 수 많은 컴퓨팅 장치(디바이스)를 말한다.

IP 주소는 계층적으로 구성되어 있으며 IPv4 기준 32bit, 총 12개의 수로 이루어져있고 0.0.0.0부터 시작하여 255.255.255.255까지 나타낼 수 있다.

그러나 사람들은 이 복잡한 수를 외우기가 정말 어렵다. (~~물론 자주 쓰다보면 외워지겠지~~) 그래서 IP 주소를 대신하여 사람들이 이해하기 쉬운 주소가 필요했고 이를 위해서 탄생한 것이 **도메인 네임**이다. **도메인 네임은 URL의 일부**이다. 위의 [URL의 구성](#url의-구성)에서도 볼 수 있듯 길고 긴 URL에서 호스트의 주소만을 도메인 네임이라고 한다.

근데 컴퓨터는 도메인 네임을 이해할 수 있을까? 결론부터 말하자면, 아니다. 도메인 네임은 네트워크 상에서 호스트의 주소를 인간이 이해하기 쉽게 인간의 언어로 표현한 것이다. 이렇게 호스트의 IP 주소를 도메인 네임으로 바꿔주는 것이 흔히 DNS라고 불리는 **도메인 네임 시스템**이다. 물론 그 반대로 도메인 네임을 컴퓨터가 이해할 수 있는 IP 주소로로 바꾸기도 한다.

그리고 IP 주소와 함께 언급되는 것 중 **MAC 주소**라는 것이 있다.

## MAC 주소 (Mac Address)

MAC 주소는 랜카드라고 흔히 말하는 네트워크 인터페이스 카드(NIC) 또는 스마트폰의 와이파이 모듈에 할당된 고유 식별값을 말하며 주로 물리적 주소, 하드웨어 주소라고도 한다.

~~인터넷에 접속이 가능한 이더넷 기반의 기기에서는 모두 하나 이상씩 갖고 있다.~~  
(요 이야기는 어려울 수 있으니 패스하자)

설명 그대로 하드웨어의 주소이기 때문에 생산하고 나서 특별한 문제(해킹)가 생기지 않는 이상 한 번 할당된 값이 변하지 않는다. NIC를 만드는 회사에서 다른 MAC 주소와 겹치지 않는 고유한 주소를 할당하며 그 값은 48bit로 구성되어있다. 그렇다면 IP 주소와 MAC 주소에는 어떤 관계가 있길래 항상 엮이는 것일까?

가령 한 집에서 여러 대의 컴퓨터를 쓴다고 생각해보자. 아니라면 PC방 환경이라고 생각해도 좋다. 이렇게 같은 공간 내에서 **여러 디바이스가 같은 회선을 공유한다면 결국 이들의 IP 주소는 동일**하다. 당신의 방에 있는 컴퓨터와 당신의 형누나언니오빠동생 방에 있는 컴퓨터가 같은 공유기를 이용한다면 IP는 동일할 것이다. 그렇다면 IP 주소만으로 각 디바이스를 구분할 수는 없다. 그렇기 때문에 MAC 주소가 필요한 것이다. 한 IP 내에 여러 기기들이 존재할 때 이들을 식별하기 위해서 MAC 주소가 존재한다.

그렇다면 MAC 주소는 컴퓨터 한 대 당 하나 뿐일까? 그건 아니다. MAC 주소는 NIC에 할당된 값이기 때문에 NIC를 여러 개 붙이면 여러 개 가질 수 있다.

## 끝내며

웹 세계에서 주소라고 하는 것들에 대해서 이야기를 나눠보았다. 일상에서 손쉽게 접근해서 사용하고 있는 URL에 대해서 좀 더 깊게 알게 되었거나 흥미가 생겼다면 이 포스트는 성공했다고 생각한다.

IP 주소나 MAC 주소에서는 OSI 7계층과 프로토콜 같은 개념이 묶여있기도 하고 DNS 같은 개념도 언급했기 때문에 이에 대한 것도 다루고 싶지만 글이 길어지기 때문에 추후 다른 포스트에서 다루고자 한다.
0:{"buildId":"fIMFzVBp7PQWc8En8Qe49","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"max-w-6xl mx-auto px-4 py-12","children":["$","div",null,{"className":"flex gap-8 justify-center xl:justify-start","children":[["$","article",null,{"className":"flex-1 max-w-3xl","children":[["$","header",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-muted-foreground mb-4","children":["$","$L2",null,{"href":"/tech","className":"hover:text-foreground transition-colors capitalize","children":"tech"}]}],["$","h1",null,{"className":"text-4xl font-bold tracking-tight mb-3","children":"주소 이야기"}],["$","div",null,{"className":"flex justify-between items-center gap-3 text-sm text-muted-foreground","children":[["$","time",null,{"dateTime":"2019-06-18T12:00","children":"Jun 18, 2019"}],["$","div",null,{"className":"flex items-center gap-3","children":[["$","$L3",null,{"slug":"address-story"}],["$","span",null,{"children":"15 min read"}]]}]]}]]}],["$","hr",null,{"className":"border-border mb-8"}],["$","$L4",null,{"content":"$5"}],"$L6","$L7","$L8"]}],"$L9"]}]}],["$La","$Lb"],"$Lc"]}],"loading":null,"isPartial":false}
6:["$","div",null,{"className":"relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden","children":["$","$Ld",null,{"src":"https://images.hexdrinker.dev/tech/address-story/thumbnail.png","alt":"주소 이야기","fill":true,"className":"object-cover","priority":true}]}]
7:["$","div",null,{"className":"prose dark:prose-invert max-w-none","children":[["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["사람들은 웹 브라우저를 띄워 편하게 그들이 기억하고 있는 주소를 입력하여 웹 페이지에 접근한다.",["$","br",null,{}],"\n","사람들 사이에서도 웹 사이트를 공유할 때 링크 또는 URL을 주고 받는다는 표현을 많이 쓴다.",["$","br",null,{}],"\n","이렇게 URL이란 단어는 일상적으로 우리 삶에서 찾아볼 수 있다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"이 포스트는 URL을 시작으로 인터넷 세계에서의 주소에 대해서 알아볼 것이다."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"url","children":"URL"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["URL은 ",["$","strong",null,{"children":"U"}],"niform ",["$","strong",null,{"children":"R"}],"esource ",["$","strong",null,{"children":"L"}],"ocator의 약자로 번역을 하자면 통합 자원 지시자이다.(한글이 더 어렵다..)",["$","br",null,{}],"\n","URL은 네트워크 상의 리소스가 구체적으로 ",["$","strong",null,{"children":"어디에 위치"}],"하는지 알려주는 규약이다. 흔히 웹 페이지의 주소라고들 알고 있지만 웹 페이지의 주소를 포함하여 네트워크 상의 모든 자원을 나타낼 수 있다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["쉽게 말하자면 인터넷 상에서 ",["$","strong",null,{"children":"리소스의 위치"}],"이다. 정확히 어디에 위치하며 어떻게 접근할 수 있는지로 리소스를 식별한다. 한 가지 뚜렷한 특징이 있다면 URL은 ",["$","strong",null,{"children":"특정 순간의 리소스의 위치"}],"일 뿐이지 실제 리소스 객체 자체나 객체의 이름이 아니다. 그러므로 그 위치(URL)가 변경되면 리소스에 접근할 수 없다는 단점이 있다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"URI라고 URL과 생김새가 비슷한 것이 존재한다. URI에 대해서도 알아보자."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"uri","children":"URI"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["URI는 ",["$","strong",null,{"children":"U"}],"niform ",["$","strong",null,{"children":"R"}],"esource ",["$","strong",null,{"children":"I"}],"dentifier의 약자로 한글로는 통합 자원 식별자이다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["인터넷에 존재하는 리소스를 나타내는 ",["$","strong",null,{"children":"유일한 주소"}],"이다. 쉽게 말하면 ",["$","strong",null,{"children":"리소스를 식별하기 위한 문자열 전반"}],"을 말한다. URL이 리소스의 위치(장소) 정보라면 URI는 리소스를 식별하기 위한 정보를 나타낸다. URL과 URN은 URI의 서브셋이다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"URL을 좀 더 잘 이해하기 위해서는 URL의 구성과 웹 환경의 발전에 대한 이야기를 알면 도움이 될 것이다."}],"\n",["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"url의-구성","children":"URL의 구성"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["$","img",null,{"src":"https://images.hexdrinker.dev/web/address-story/url-structure.png","alt":"url-structure","className":"my-4 rounded-lg max-w-full h-auto"}]}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"스키마","children":"스키마"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"스키마는 프로토콜을 나타낸다. 브라우저가 어떤 프로토콜을 이용하여 데이터를 교환하는지를 말해준다. 보통 웹 사이트들은 http 또는 https이나 mailto나 ftp도 가능하다."}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"자격정보","children":"자격정보"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"일부 리소스를 획득하기 위해서는 자격정보가 필요하다. 유저명과 패스워드를 지정할 수 있다. 이것은 옵션이다."}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"호스트-주소","children":"호스트 주소"}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["리소스를 보유한 서버 호스트 컴퓨터의 주소이다. ",["$","strong",null,{"children":"도메인 네임"}],"이라고도 불린다. 직접 IP 주소를 입력하는 것도 가능하다."]}],"\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["위 호스트 주소를 보면 ",["$","a",null,{"href":"http://www.example.kr","target":"_blank","rel":"noopener noreferrer","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"www.example.kr"}]," 이렇게 .(dot)을 통해서 구분지어져 있다. 이는 계층적 구조를 표현한 것으로 계층은 우측부터 시작한다.\n가장 우측 레이블인 kr은 가장 최상위 도메인이고 example은 kr의 서브 도메인이다. www는 example.kr의 서브 도메인이다. 서브 도메인은 127단계까지 가능하다."]}],"\n",["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"포트-번호","children":"포트 번호"}],"\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d","\n","$L1e","\n","$L1f","\n","$L20","\n","$L21","\n","$L22","\n","$L23","\n","$L24","\n","$L25","\n","$L26","\n","$L27","\n","$L28","\n","$L29","\n","$L2a","\n","$L2b","\n","$L2c","\n","$L2d","\n","$L2e","\n","$L2f","\n","$L30"]}]
8:["$","hr",null,{"className":"border-border my-12"}]
32:T297f,
사람들은 웹 브라우저를 띄워 편하게 그들이 기억하고 있는 주소를 입력하여 웹 페이지에 접근한다.  
사람들 사이에서도 웹 사이트를 공유할 때 링크 또는 URL을 주고 받는다는 표현을 많이 쓴다.  
이렇게 URL이란 단어는 일상적으로 우리 삶에서 찾아볼 수 있다.

이 포스트는 URL을 시작으로 인터넷 세계에서의 주소에 대해서 알아볼 것이다.



## URL

URL은 **U**niform **R**esource **L**ocator의 약자로 번역을 하자면 통합 자원 지시자이다.(한글이 더 어렵다..)  
URL은 네트워크 상의 리소스가 구체적으로 **어디에 위치**하는지 알려주는 규약이다. 흔히 웹 페이지의 주소라고들 알고 있지만 웹 페이지의 주소를 포함하여 네트워크 상의 모든 자원을 나타낼 수 있다.

쉽게 말하자면 인터넷 상에서 **리소스의 위치**이다. 정확히 어디에 위치하며 어떻게 접근할 수 있는지로 리소스를 식별한다. 한 가지 뚜렷한 특징이 있다면 URL은 **특정 순간의 리소스의 위치**일 뿐이지 실제 리소스 객체 자체나 객체의 이름이 아니다. 그러므로 그 위치(URL)가 변경되면 리소스에 접근할 수 없다는 단점이 있다.

URI라고 URL과 생김새가 비슷한 것이 존재한다. URI에 대해서도 알아보자.

## URI

URI는 **U**niform **R**esource **I**dentifier의 약자로 한글로는 통합 자원 식별자이다.

인터넷에 존재하는 리소스를 나타내는 **유일한 주소**이다. 쉽게 말하면 **리소스를 식별하기 위한 문자열 전반**을 말한다. URL이 리소스의 위치(장소) 정보라면 URI는 리소스를 식별하기 위한 정보를 나타낸다. URL과 URN은 URI의 서브셋이다.

URL을 좀 더 잘 이해하기 위해서는 URL의 구성과 웹 환경의 발전에 대한 이야기를 알면 도움이 될 것이다.

## URL의 구성

![url-structure](https://images.hexdrinker.dev/web/address-story/url-structure.png)

### 스키마

스키마는 프로토콜을 나타낸다. 브라우저가 어떤 프로토콜을 이용하여 데이터를 교환하는지를 말해준다. 보통 웹 사이트들은 http 또는 https이나 mailto나 ftp도 가능하다.

### 자격정보

일부 리소스를 획득하기 위해서는 자격정보가 필요하다. 유저명과 패스워드를 지정할 수 있다. 이것은 옵션이다.

### 호스트 주소

리소스를 보유한 서버 호스트 컴퓨터의 주소이다. **도메인 네임**이라고도 불린다. 직접 IP 주소를 입력하는 것도 가능하다.

위 호스트 주소를 보면 www.example.kr 이렇게 .(dot)을 통해서 구분지어져 있다. 이는 계층적 구조를 표현한 것으로 계층은 우측부터 시작한다.
가장 우측 레이블인 kr은 가장 최상위 도메인이고 example은 kr의 서브 도메인이다. www는 example.kr의 서브 도메인이다. 서브 도메인은 127단계까지 가능하다.

### 포트 번호

서버의 포트 번호이다. 서버의 리소스에 접근하기 위한 gate라고 볼 수 있다.

### 파일 경로

서버에서 리소스의 경로를 나타낸다. 초기의 웹에서는 물리적으로 파일의 위치를 나타냈으나 최근에는 실제 물리적 경로를 나타내지 않고 서버에서 추상화하여 보여준다.

### 쿼리 스트링

지정된 리소스에 파라미터를 넘겨주기 위해 이용된다. 이것은 옵션이다.

### 프래그먼트 식별자

리소스 내에서 서브 리소스를 가리키기 위해서 이용된다. 예를 들어서 HTML 문서 내에서 h1~h6 태그로 작성된 텍스트의 위치로 프래그먼트 식별자를 통해 이동할 수 있다. 이것은 옵션이다.

## 웹 환경의 발전

구 시대의 웹은 단순했다. 서버에서는 리소스를 보관하고 있고 클라이언트에서 리소스 요청이 온다면 그것을 보여주기만 하면 됐다. 그래서 클라이언트는 html 파일의 위치를 요청하면 문제가 없었다.

그러나 웹이 발전하게되어 한 페이지 내에서 실시간으로 데이터를 다루는 일이 빈번하게 이루어지는 등 과거보다 많이 복잡해졌다. 클라이언트는 다양한 요청을 하고 요즘의 웹이 리소스의 위치만을 요청하고 응답받는 구조를 유지하기엔 많은 기능을 담고 있다.

그래서 서버는 요청 URL을 rewrite하는 등의 변화가 일어났다.

> rewrite란 클라이언트 리퀘스트 헤더의 URL을 특정 규칙에 따라 변경하여 리스폰스하는 것을 말한다. 이는 웹 서비스를 보다 유연하고 시맨틱하게 만든다.

예를 들어서 당장 이 포스트의 주소만 하더라도 `https://hexdrinker.dev/blog/web/address-story`이다. 이는 hexdrinker.dev라는 도메인 네임을 가진 서버의 web 디렉토리 밑에 address-story란 파일이 있는 것을 말할까? 그럴 수도 있지만 아닐 확률이 높다. 어느 특정 경로에 위치한 이 포스트 파일(리소스)의 주소를 시맨틱하게 rewrite하여 제공함으로서 보다 직관적이고 알기 쉬운 웹 환경을 조성한다.

이렇듯 최근의 웹의 주소는 URL만으로는 설명하기가 어렵고 URL로 제공되는 웹 사이트도 있지만 진보된 웹 환경에서는 URL이 아니라 URI라고 보는 것이 적합하다.

## URN

위에서 URL과 URN은 URI의 서브셋이라고 했다. URN에 대해서도 잠깐 언급하도록 하겠다.

URN은 **U**niform **R**esourcee **N**ame의 약자로 통합 자원 이름이라고 한다.

보통 URL의 경우 리소스의 위치가 바뀐다면 기존의 URL로는 해당 리소스에 접근할 수가 없다. 이런 URL의 한계(특정 순간의 리소스의 위치를 나타내는)로 인해 URN 개발이 착수되었다. URN은 리소스의 위치에 영향을 받지 않는 리소스 객체의 **고유한 이름**을 말한다. 그렇기 때문에 리소스의 위치가 여기저기 옮겨져도 문제없이 작동한다.

현재 웹은 URL 방식을 사용하고 있는데 URN 방식으로의 변경은 매우 크고 어려운 일이다. 표준도 신중하게 정해야하고 수 많은 브라우저 벤더들과의 협의도 필요하다. URL 방식은 뚜렷한 한계를 지니고 있지만 URN 방식으로 완전히 대체할 수 있는 환경이 준비되기 전까지는 계속 쓰일 것이다.

## IP 주소

웹의 주소, 호스트의 주소라고 불리는 것의 실체는 **IP(Internet Protocol) 주소**이다. 컴퓨터 간의 네트워크 통신을 위해서는 상대 컴퓨터가 네트워크 상(L3, 네트워크 레이어)에서 어디에 위치하는지(논리적 주소)를 알아야한다. 즉, 네트워크 레이어에서의 컴퓨터의 논리적 위치를 IP 주소라고 하며 IP 주소를 통해 컴퓨터를 식별할 수 있다.

> 호스트란 데스크톱, 랩톱, 스마트폰, 태블릿, TV 등 인터넷과 연결되는 수 많은 컴퓨팅 장치(디바이스)를 말한다.

IP 주소는 계층적으로 구성되어 있으며 IPv4 기준 32bit, 총 12개의 수로 이루어져있고 0.0.0.0부터 시작하여 255.255.255.255까지 나타낼 수 있다.

그러나 사람들은 이 복잡한 수를 외우기가 정말 어렵다. (~~물론 자주 쓰다보면 외워지겠지~~) 그래서 IP 주소를 대신하여 사람들이 이해하기 쉬운 주소가 필요했고 이를 위해서 탄생한 것이 **도메인 네임**이다. **도메인 네임은 URL의 일부**이다. 위의 [URL의 구성](#url의-구성)에서도 볼 수 있듯 길고 긴 URL에서 호스트의 주소만을 도메인 네임이라고 한다.

근데 컴퓨터는 도메인 네임을 이해할 수 있을까? 결론부터 말하자면, 아니다. 도메인 네임은 네트워크 상에서 호스트의 주소를 인간이 이해하기 쉽게 인간의 언어로 표현한 것이다. 이렇게 호스트의 IP 주소를 도메인 네임으로 바꿔주는 것이 흔히 DNS라고 불리는 **도메인 네임 시스템**이다. 물론 그 반대로 도메인 네임을 컴퓨터가 이해할 수 있는 IP 주소로로 바꾸기도 한다.

그리고 IP 주소와 함께 언급되는 것 중 **MAC 주소**라는 것이 있다.

## MAC 주소 (Mac Address)

MAC 주소는 랜카드라고 흔히 말하는 네트워크 인터페이스 카드(NIC) 또는 스마트폰의 와이파이 모듈에 할당된 고유 식별값을 말하며 주로 물리적 주소, 하드웨어 주소라고도 한다.

~~인터넷에 접속이 가능한 이더넷 기반의 기기에서는 모두 하나 이상씩 갖고 있다.~~  
(요 이야기는 어려울 수 있으니 패스하자)

설명 그대로 하드웨어의 주소이기 때문에 생산하고 나서 특별한 문제(해킹)가 생기지 않는 이상 한 번 할당된 값이 변하지 않는다. NIC를 만드는 회사에서 다른 MAC 주소와 겹치지 않는 고유한 주소를 할당하며 그 값은 48bit로 구성되어있다. 그렇다면 IP 주소와 MAC 주소에는 어떤 관계가 있길래 항상 엮이는 것일까?

가령 한 집에서 여러 대의 컴퓨터를 쓴다고 생각해보자. 아니라면 PC방 환경이라고 생각해도 좋다. 이렇게 같은 공간 내에서 **여러 디바이스가 같은 회선을 공유한다면 결국 이들의 IP 주소는 동일**하다. 당신의 방에 있는 컴퓨터와 당신의 형누나언니오빠동생 방에 있는 컴퓨터가 같은 공유기를 이용한다면 IP는 동일할 것이다. 그렇다면 IP 주소만으로 각 디바이스를 구분할 수는 없다. 그렇기 때문에 MAC 주소가 필요한 것이다. 한 IP 내에 여러 기기들이 존재할 때 이들을 식별하기 위해서 MAC 주소가 존재한다.

그렇다면 MAC 주소는 컴퓨터 한 대 당 하나 뿐일까? 그건 아니다. MAC 주소는 NIC에 할당된 값이기 때문에 NIC를 여러 개 붙이면 여러 개 가질 수 있다.

## 끝내며

웹 세계에서 주소라고 하는 것들에 대해서 이야기를 나눠보았다. 일상에서 손쉽게 접근해서 사용하고 있는 URL에 대해서 좀 더 깊게 알게 되었거나 흥미가 생겼다면 이 포스트는 성공했다고 생각한다.

IP 주소나 MAC 주소에서는 OSI 7계층과 프로토콜 같은 개념이 묶여있기도 하고 DNS 같은 개념도 언급했기 때문에 이에 대한 것도 다루고 싶지만 글이 길어지기 때문에 추후 다른 포스트에서 다루고자 한다.
9:["$","aside",null,{"className":"hidden xl:block w-64 shrink-0 self-start sticky top-24","children":["$","$L31",null,{"content":"$32"}]}]
a:["$","script","script-0",{"src":"/_next/static/chunks/8ba36b395f30a90d.js","async":true}]
b:["$","script","script-1",{"src":"/_next/static/chunks/cc80ad68b16f74f3.js","async":true}]
c:["$","$L33",null,{"children":["$","$34",null,{"name":"Next.MetadataOutlet","children":"$@35"}]}]
e:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"서버의 포트 번호이다. 서버의 리소스에 접근하기 위한 gate라고 볼 수 있다."}]
f:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"파일-경로","children":"파일 경로"}]
10:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"서버에서 리소스의 경로를 나타낸다. 초기의 웹에서는 물리적으로 파일의 위치를 나타냈으나 최근에는 실제 물리적 경로를 나타내지 않고 서버에서 추상화하여 보여준다."}]
11:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"쿼리-스트링","children":"쿼리 스트링"}]
12:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"지정된 리소스에 파라미터를 넘겨주기 위해 이용된다. 이것은 옵션이다."}]
13:["$","h3",null,{"className":"text-xl font-medium mt-6 mb-3","id":"프래그먼트-식별자","children":"프래그먼트 식별자"}]
14:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"리소스 내에서 서브 리소스를 가리키기 위해서 이용된다. 예를 들어서 HTML 문서 내에서 h1~h6 태그로 작성된 텍스트의 위치로 프래그먼트 식별자를 통해 이동할 수 있다. 이것은 옵션이다."}]
15:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"웹-환경의-발전","children":"웹 환경의 발전"}]
16:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"구 시대의 웹은 단순했다. 서버에서는 리소스를 보관하고 있고 클라이언트에서 리소스 요청이 온다면 그것을 보여주기만 하면 됐다. 그래서 클라이언트는 html 파일의 위치를 요청하면 문제가 없었다."}]
17:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"그러나 웹이 발전하게되어 한 페이지 내에서 실시간으로 데이터를 다루는 일이 빈번하게 이루어지는 등 과거보다 많이 복잡해졌다. 클라이언트는 다양한 요청을 하고 요즘의 웹이 리소스의 위치만을 요청하고 응답받는 구조를 유지하기엔 많은 기능을 담고 있다."}]
18:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"그래서 서버는 요청 URL을 rewrite하는 등의 변화가 일어났다."}]
19:["$","blockquote",null,{"className":"my-4 border-l-2 border-border pl-4 text-muted-foreground","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"rewrite란 클라이언트 리퀘스트 헤더의 URL을 특정 규칙에 따라 변경하여 리스폰스하는 것을 말한다. 이는 웹 서비스를 보다 유연하고 시맨틱하게 만든다."}],"\n"]}]
1a:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["예를 들어서 당장 이 포스트의 주소만 하더라도 ",["$","code",null,{"className":"px-1.5 py-0.5 bg-muted rounded text-sm font-mono","children":"https://hexdrinker.dev/blog/web/address-story"}],"이다. 이는 hexdrinker.dev라는 도메인 네임을 가진 서버의 web 디렉토리 밑에 address-story란 파일이 있는 것을 말할까? 그럴 수도 있지만 아닐 확률이 높다. 어느 특정 경로에 위치한 이 포스트 파일(리소스)의 주소를 시맨틱하게 rewrite하여 제공함으로서 보다 직관적이고 알기 쉬운 웹 환경을 조성한다."]}]
1b:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"이렇듯 최근의 웹의 주소는 URL만으로는 설명하기가 어렵고 URL로 제공되는 웹 사이트도 있지만 진보된 웹 환경에서는 URL이 아니라 URI라고 보는 것이 적합하다."}]
1c:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"urn","children":"URN"}]
1d:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"위에서 URL과 URN은 URI의 서브셋이라고 했다. URN에 대해서도 잠깐 언급하도록 하겠다."}]
1e:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["URN은 ",["$","strong",null,{"children":"U"}],"niform ",["$","strong",null,{"children":"R"}],"esourcee ",["$","strong",null,{"children":"N"}],"ame의 약자로 통합 자원 이름이라고 한다."]}]
1f:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["보통 URL의 경우 리소스의 위치가 바뀐다면 기존의 URL로는 해당 리소스에 접근할 수가 없다. 이런 URL의 한계(특정 순간의 리소스의 위치를 나타내는)로 인해 URN 개발이 착수되었다. URN은 리소스의 위치에 영향을 받지 않는 리소스 객체의 ",["$","strong",null,{"children":"고유한 이름"}],"을 말한다. 그렇기 때문에 리소스의 위치가 여기저기 옮겨져도 문제없이 작동한다."]}]
20:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"현재 웹은 URL 방식을 사용하고 있는데 URN 방식으로의 변경은 매우 크고 어려운 일이다. 표준도 신중하게 정해야하고 수 많은 브라우저 벤더들과의 협의도 필요하다. URL 방식은 뚜렷한 한계를 지니고 있지만 URN 방식으로 완전히 대체할 수 있는 환경이 준비되기 전까지는 계속 쓰일 것이다."}]
21:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"ip-주소","children":"IP 주소"}]
22:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["웹의 주소, 호스트의 주소라고 불리는 것의 실체는 ",["$","strong",null,{"children":"IP(Internet Protocol) 주소"}],"이다. 컴퓨터 간의 네트워크 통신을 위해서는 상대 컴퓨터가 네트워크 상(L3, 네트워크 레이어)에서 어디에 위치하는지(논리적 주소)를 알아야한다. 즉, 네트워크 레이어에서의 컴퓨터의 논리적 위치를 IP 주소라고 하며 IP 주소를 통해 컴퓨터를 식별할 수 있다."]}]
23:["$","blockquote",null,{"className":"my-4 border-l-2 border-border pl-4 text-muted-foreground","children":["\n",["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"호스트란 데스크톱, 랩톱, 스마트폰, 태블릿, TV 등 인터넷과 연결되는 수 많은 컴퓨팅 장치(디바이스)를 말한다."}],"\n"]}]
24:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"IP 주소는 계층적으로 구성되어 있으며 IPv4 기준 32bit, 총 12개의 수로 이루어져있고 0.0.0.0부터 시작하여 255.255.255.255까지 나타낼 수 있다."}]
25:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["그러나 사람들은 이 복잡한 수를 외우기가 정말 어렵다. (",["$","del",null,{"children":"물론 자주 쓰다보면 외워지겠지"}],") 그래서 IP 주소를 대신하여 사람들이 이해하기 쉬운 주소가 필요했고 이를 위해서 탄생한 것이 ",["$","strong",null,{"children":"도메인 네임"}],"이다. ",["$","strong",null,{"children":"도메인 네임은 URL의 일부"}],"이다. 위의 ",["$","$L2",null,{"href":"#url%EC%9D%98-%EA%B5%AC%EC%84%B1","className":"text-foreground underline underline-offset-4 hover:text-foreground/80","children":"URL의 구성"}],"에서도 볼 수 있듯 길고 긴 URL에서 호스트의 주소만을 도메인 네임이라고 한다."]}]
26:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["근데 컴퓨터는 도메인 네임을 이해할 수 있을까? 결론부터 말하자면, 아니다. 도메인 네임은 네트워크 상에서 호스트의 주소를 인간이 이해하기 쉽게 인간의 언어로 표현한 것이다. 이렇게 호스트의 IP 주소를 도메인 네임으로 바꿔주는 것이 흔히 DNS라고 불리는 ",["$","strong",null,{"children":"도메인 네임 시스템"}],"이다. 물론 그 반대로 도메인 네임을 컴퓨터가 이해할 수 있는 IP 주소로로 바꾸기도 한다."]}]
27:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["그리고 IP 주소와 함께 언급되는 것 중 ",["$","strong",null,{"children":"MAC 주소"}],"라는 것이 있다."]}]
28:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"mac-주소-mac-address","children":"MAC 주소 (Mac Address)"}]
29:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"MAC 주소는 랜카드라고 흔히 말하는 네트워크 인터페이스 카드(NIC) 또는 스마트폰의 와이파이 모듈에 할당된 고유 식별값을 말하며 주로 물리적 주소, 하드웨어 주소라고도 한다."}]
2a:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":[["$","del",null,{"children":"인터넷에 접속이 가능한 이더넷 기반의 기기에서는 모두 하나 이상씩 갖고 있다."}],["$","br",null,{}],"\n","(요 이야기는 어려울 수 있으니 패스하자)"]}]
2b:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"설명 그대로 하드웨어의 주소이기 때문에 생산하고 나서 특별한 문제(해킹)가 생기지 않는 이상 한 번 할당된 값이 변하지 않는다. NIC를 만드는 회사에서 다른 MAC 주소와 겹치지 않는 고유한 주소를 할당하며 그 값은 48bit로 구성되어있다. 그렇다면 IP 주소와 MAC 주소에는 어떤 관계가 있길래 항상 엮이는 것일까?"}]
2c:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":["가령 한 집에서 여러 대의 컴퓨터를 쓴다고 생각해보자. 아니라면 PC방 환경이라고 생각해도 좋다. 이렇게 같은 공간 내에서 ",["$","strong",null,{"children":"여러 디바이스가 같은 회선을 공유한다면 결국 이들의 IP 주소는 동일"}],"하다. 당신의 방에 있는 컴퓨터와 당신의 형누나언니오빠동생 방에 있는 컴퓨터가 같은 공유기를 이용한다면 IP는 동일할 것이다. 그렇다면 IP 주소만으로 각 디바이스를 구분할 수는 없다. 그렇기 때문에 MAC 주소가 필요한 것이다. 한 IP 내에 여러 기기들이 존재할 때 이들을 식별하기 위해서 MAC 주소가 존재한다."]}]
2d:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"그렇다면 MAC 주소는 컴퓨터 한 대 당 하나 뿐일까? 그건 아니다. MAC 주소는 NIC에 할당된 값이기 때문에 NIC를 여러 개 붙이면 여러 개 가질 수 있다."}]
2e:["$","h2",null,{"className":"text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border","id":"끝내며","children":"끝내며"}]
2f:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"웹 세계에서 주소라고 하는 것들에 대해서 이야기를 나눠보았다. 일상에서 손쉽게 접근해서 사용하고 있는 URL에 대해서 좀 더 깊게 알게 되었거나 흥미가 생겼다면 이 포스트는 성공했다고 생각한다."}]
30:["$","p",null,{"className":"my-4 leading-7 text-foreground/90","children":"IP 주소나 MAC 주소에서는 OSI 7계층과 프로토콜 같은 개념이 묶여있기도 하고 DNS 같은 개념도 언급했기 때문에 이에 대한 것도 다루고 싶지만 글이 길어지기 때문에 추후 다른 포스트에서 다루고자 한다."}]
35:null
