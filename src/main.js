let data = window.data;
let sw = window.innerWidth;
let sh = window.innerHeight;
let stateStack = []

function parentSelector(parentIdx) {
    return `#top-img-layer > img[data-idx='${parentIdx}']`
}

function childSelector(parentIdx, childIdx) {
    return `#sub-img-layer > img[data-parent='${parentIdx}'][data-idx='${childIdx}']`
}

function nextBtnSelector(parentIdx) {
    return `#sub-img-layer > img.next-btn[data-parent='${parentIdx}']`
}

// 최초상태
let state_initial = function (idx) {
    let state = {
        name: "init"
    }
    let end = 0
    let centers = []
    for (let i = 0; i < data.length; i++) {
        // 메인 이미지 위치
        let selector = parentSelector(i)
        let element = $(selector);
        let ratio = element.get(0).naturalWidth / element.get(0).naturalHeight
        var rt = {
            w: sh * 0.7 * ratio,
            h: sh * 0.7
        }
        state[selector] = {
            left: sw / 2 + end,
            top: sh / 2 + Math.random() * 50,
            marginLeft: -rt.w / 2,
            marginTop: -rt.h / 2,
            width: rt.w,
            height: rt.h,
            scale: 1
        };
        centers.push(state[selector].left)
        end += rt.w;

        // 서브 이미지 위치
        for (let j = 0; j < data[i].children.length; j++) {
            let selector = childSelector(i, j)
            let element = $(selector);
            let ratio = element.get(0).naturalWidth / element.get(0).naturalHeight
            var rt = {
                w: sh * 0.9 * ratio,
                h: sh * 0.9
            }
            state[selector] = {
                width: rt.w,
                height: rt.h,
                opacity: 0
            }
        }

        //NEXT 버튼
        selector = nextBtnSelector(i);
        element = $(selector);
        ratio = element.get(0).naturalHeight / element.get(0).naturalWidth
        state[selector] = {
            width: sw * 0.2,
            height: sw * 0.2 * ratio,
            opacity: 0
        }
    }

    // Offset by idx
    let v = sw / 2 - centers[idx]
    for (let i = 0; i < data.length; i++) {
        let selector = parentSelector(i);
        state[selector].left += v;
    }

    return state;
}



// 디테일뷰
let state_scroll = function (idx, scrollRatio) {

    let state = {
        name: "detail"
    }

    if (scrollRatio === undefined)
        scrollRatio = 0;

    //상위 이미지들 위치
    for (let i = 0; i < data.length; i++) {
        let selector = parentSelector(i)

        if (i == idx) {
            let selctors = []
            state[selector] = {
                left: sw / 2,
                top: sh / 2,
                scale: 1.5
            }
            selctors.push(selector)
            //서브 이미지들 위치

            let scrollHeight = 0; //총 스크롤 높이 계산용 값.
            for (let j = 0; j < data[i].children.length; j++) {
                let selector = childSelector(i, j)
                selctors.push(selector)
                let height = $(selector).height()
                let width = $(selector).width()
                let subImg = data[i].children[j];
                let left = (sw / 2) + ((j % 2) * -width);
                let top = scrollHeight;
                state[selector] = {
                    left,
                    top: top + sh,
                    opacity: 1
                }
                scrollHeight = scrollHeight + height; //Math.max()


                if (j == data[i].children.length - 1) {
                    //scrollHeight += 500;
                    //NEXT버튼 위치
                    selector = nextBtnSelector(i);
                    element = $(selector);
                    width = $(selector).width()
                    state[selector] = {
                        top: scrollHeight + height + 100,
                        left: sw * 0.5 - width * 0.5,
                        opacity: 1
                    }
                    selctors.push(selector)
                }
            }
            scrollHeight += 500;
            for (let k in selctors) {
                let selector = selctors[k];
                let randomOffset = Math.sin(k * Math.PI / 3) * 200;
                state[selector].top -= (scrollHeight + randomOffset) * scrollRatio;
            }
        } else {
            // 메인 이미지
            let targeMainPos = $(parentSelector(idx)).position();
            let otherMainPos = $(selector).position()
            let dir = i - idx
            let newLeft = sw * 0.5 + dir * sw
            console.log(i, otherMainPos.left - targeMainPos.left)
            state[selector] = {
                left: newLeft,
                scale: 1
            }
            //서브 이미지들 위치
            for (let j = 0; j < data[i].children.length; j++) {
                let selector = childSelector(i, j)
                let subImg = data[i].children[j];
                state[selector] = {
                    top: '100vh',
                    opacity: 0
                }
            }
        }
    }


    return state;
}

function buildScene() {
    for (let i = 0; i < data.length; i++) {
        let item = data[i];

        let tag = `<img src='${item.src}' class='top-img' data-idx='${i}'>`;
        $('#top-img-layer').append(tag);

        for (let j in item.children) {
            let subItem = item.children[j];
            let tag = `<img src='${subItem.src}' class='sub-img' data-parent='${i}' data-idx='${j}'>`;
            $('#sub-img-layer').append(tag);
        }

        let nextIdx = (i + 1) % data.length;
        let itemNext = data[nextIdx];
        let nextBtnTag =
            `<img src='${itemNext.src}' class='next-btn' data-parent='${i}' data-next-idx='${nextIdx}'>`;
        $('#sub-img-layer').append(nextBtnTag);
    }

    return $('img');
}

function makeTween(state, duration) {
    let tl = new TimelineMax()
    for (let selector in state) {
        if (selector == 'name') continue;
        let eleState = state[selector];
        if (duration > 0)
            tl.to(selector, duration, eleState, 0);
        else
            tl.set(selector, eleState, 0);
    }
    return tl;
}

function transition(seq) {
    /*
        seq = [
            {state:state, duration:1}
        ]
    */
    let tlSeq = new TimelineMax()
    for (let stateConfig of seq) {
        let state = stateConfig['state']
        let duration = 'duration' in stateConfig ? stateConfig['duration'] : 1;
        let tl = makeTween(state, duration)
        tlSeq.add(tl)
        stateStack.push({
            state,
            tl
        })
    }
    return tlSeq;
}

function popState() {
    let last = stateStack.pop()
    last.tl.reverse()
}

function currentStateName() {
    return stateStack[stateStack.length - 1].state.name
}

function lastTimeline() {
    return stateStack[stateStack.length - 1].tl
}

function playing() {
    return stateStack[stateStack.length - 1].tl.isActive()
}

let imgLoaded = 0;
let selectedIdx = 0;
let scrolldown = 0; //0~1
let locked = false;

function lock() {
    locked = true;
}

function unlock() {
    locked = false;
}

buildScene().on('load', function () {

    imgLoaded++
    if ($('img').length > imgLoaded)
        return;

    console.log("All image loaded!!!");


    transition([{
        state: state_initial(selectedIdx)
    }]);

    $('body').on("mousewheel", function (evt) {

        if (!!locked)
            return;

        let dir = evt.originalEvent.deltaY / Math.abs(evt.originalEvent.deltaY) //휠 방향

        if (currentStateName() == 'init') {
            if (playing())
                return;
            selectedIdx += dir
            selectedIdx = Math.max(Math.min(data.length - 1, selectedIdx), 0)
            transition([{
                state: state_initial(selectedIdx)
            }]);
        } else if (currentStateName() == 'detail') {
            scrolldown += dir * 0.05;
            scrolldown = Math.max(Math.min(1, scrolldown), 0);
            transition([{
                state: state_scroll(selectedIdx, scrolldown)
            }])
        }
    })



    $('.next-btn').on("click", function (evt) {

        if (!!locked)
            return;

        let targetData = $(evt.currentTarget).data();
        let parentIdx = targetData.parent;
        let idx = targetData.nextIdx;
        let tl = transition([{
            state: state_scroll(parentIdx)
        }, {
            state: state_initial(parentIdx)
        }, {
            state: state_initial(idx)
        }, {
            state: state_scroll(idx, -0.1)
        }])
        tl.eventCallback("onStart", lock)
        tl.eventCallback("onComplete", unlock)
        scrolldown = 0;
        selectedIdx = idx;
    })

    $('.top-img').on("click", function (evt) {

        if (!!locked)
            return;

        console.log("click")
        let idx = $(evt.currentTarget).data().idx;

        if (currentStateName() == 'detail') {
            if (scrolldown < 0.1)
                transition([{
                    state: state_initial(idx)
                }]);
            else
                transition([{
                    state: state_scroll(idx)
                }, {
                    state: state_initial(idx)
                }]);
        } else {
            selectedIdx = idx;
            transition([{
                state: state_scroll(selectedIdx, -0.1)
            }])
        }

    })

    listenResizeEnd(function () {

        sw = window.innerWidth;
        sh = window.innerHeight;

        if (currentStateName() == 'detail') {
            transition([{
                    state: state_initial(selectedIdx),
                    duration: 0
                },
                {
                    state: state_scroll(selectedIdx, scrolldown)
                }
            ])
        } else {
            transition([{
                state: state_initial(selectedIdx)
            }]);
        }



    })
})