# 개요


https://www.youtube.com/watch?v=tMP1PCErrmE

위 영상을 보고 작성한 파일.


TweenMax 는 TweenLite 를 포함하고 있음


### 기본용법

CDN에서 파일을 불러온다.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js"></script>
```

자바스크립트에서 다음 형식으로 사용한다.

```
TweenMax.to(target, duration, {vars})
```


# target

target 에는 css selector 가 문자열로 오거나, document.getElementById 값, jquery selector 등이 올 수 있음.

배열로 여러개를 넘길 수도 있음.

# duration

초단위로 애니메이션이 진행될 시간


# vars

크롬 관리자 페이지를 보면, style 이 계속 업데이트 되는 것을 볼 수 있음.

style 에 들어가는 css style 을 __camelCase__ 로 표현해주면 됨.



### transform matrix

`rotation`, `scale` 같은 값도 있는데, 에건 transform matrix 를 자동으로 만들어서 적용해줌. (vendor prefix등을 고민 할 필요 없이 알아서 해줌.)

정확한 정보는 문서를 확인 (https://greensock.com/docs/TweenMax/vars)


예)

```
TweenMax.to("#logo", 6, {backgroundColor:"#f00"}) // logo 라는 id 를 가진 객체의 배경색을 6초동안 빨간색으로 바꿈.
```


### ease

ease 는 애니메이션 속도를 어떤 함수를 활용할지 결정하는 값으로 다양한 것이 있음

```
TweenMax.to("#logo", 3, {ease:Back.easeOut})
```

사용 가능한 항목은 홈페이지의 ease visualizer 를 확인.(https://greensock.com/docs/Easing)


# from, to

TweenMax.to 의 경우에는 var 가 목표가 되지만, TweenMax.from 의 경우에는 현재 상태로 오기 전 시작 상태를 의미함.


```
TweenMax.from("#logo", 3, {left:"300px"})
```

# 여러타겟에 적용

box class 를 가진 모든 항목에 적용하려면  다음과 같은 방식으로 css selector 를 사용하면 모두 동시에 적용됨.



```
TweenMax.from(".box", 3, {left:"300px"})
```

다른 애니메이션이 끝 날 때 까지 기다렸다가 실행되도록 하고 싶다면 `delay` 를 사용해서 잠깐 기다렸다가 시작 되도록 할 수 있으.ㅁ

```
TweenMax.from(".box", 3, {left:"300px", delay:10}) //10초 기다렸다가 시작
```


# starggerFrom

여러개의 타겟에 애니메이션을 적용하고 싶고, 각 타겟마다 약간의 시간차를 두고 싶은 경우 사용.

마지막 인자에 각 타겟마다 얼마나 시간차를 줄지 지정.

```
TweenMax.staggerFrom(".box", 3, {left:"300px"}, 0.2) //0.2초 간격으로 시간차를 주어 실행
```


# 이벤트 핸들링

애니메이션 시작되거나 종료되는 등의 이벤트가 발생하면 지정한 함수를 호출 하게 하는 기능.

TweenMax.to(".box", 3, {left:"300px", onComplete:doSomthing }, 0.2) //애니메이션이 끝나면 doSomthing 함수를 호출

정확한 정보는 문서를 확인 (https://greensock.com/docs/TweenMax/vars)




# 트윈객체

`TweenMax.to` 나 `TweenMax.from` 등의 함수를 사용하면 tween 객체가 만들어짐, 이렇게 만들어진 객체에는 다음과 같은 함수 접근이 가능함.

```
    let tween = TweenMax.to(".box", 3, {left:"300px"})
```

* tween.play()
* tween.pause()
* tween.resume()
* tween.reverse()
* tween.play(5)
* tween.reverse(1)
* tween.seek(3)
* tween.timeScale(0.5)
* tween.restart()



# TimlineMax 

순차적으로 각 애니메이션의 플레이 순서를 관리하는 것이 불편..

`TimlineMax` 을 이용해서 여러개의 애니메이션을 순차적으로 플레이 가능


TimlineMax 를 사용하려면 아래 js 파일을 불러와야함.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TimelineMax.min.js"></script>
```


### 사용법

```
    let tl = new TimlineMax()
    tl.to(".box", 3, {left:"300px"})
        .to(".box", 3, {left:"200px"})
        .to(".box", 3, {scale:2})
        .to(".box", 3, {scale:2})
```

여기에서 만들어진 tl 객체도 play, pause 등등의 조작이 가능함.