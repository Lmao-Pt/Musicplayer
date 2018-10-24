var playList= [{id:2,url: 'source/test3.mp3',bgUrl: 'bgImg/003.jpg',lrc: "source/test3.lrc"},{id:3,url: 'source/test2.mp3',bgUrl: 'bgImg/002.jpg',lrc: "source/test2.lrc"},{id:4,url:'source/test4.mp3',bgUrl: 'bgImg/004.jpg',lrc: "source/test4.lrc"},{id:5,url:'source/test5.mp3',bgUrl: 'bgImg/005.jpg',lrc: "source/test5.lrc"}],
    curIndex= 0,
    curDur_show= 0,
    curDur= 0,
    count=0,
    deg= 0,
    flag=1,
    audio= document.getElementById('play1'),
    fillBar= document.getElementsByClassName('fill')[0],
    bgImg= document.getElementsByClassName('music_pic')[0],
    lryUi= document.getElementsByClassName("music_lry")[0],
    curDur_box= document.getElementsByClassName("now")[0],
    music_dur= document.getElementsByClassName('dur')[0],
    onOff_img= document.getElementById('onOff_img'),
    mySource= document.getElementById('mySource'),
    lrs_ul= document.getElementsByClassName("lrs_ul")[0],
    lrc_li= document.getElementsByClassName("lrc_li"),
    lryBtn= document.getElementsByClassName("lry")[0],
    imgBtn= document.getElementsByClassName("img")[0];
// mySource.setAttribute('src',playList[curIndex].url);
// bgImg.setAttribute('src',playList[curIndex].bgUrl);
// window.onload=audio.load();
// audio.oncanplay=function(){
//     show_dur();
// };

//歌词滚动
console.log(lrs_ul.childNodes);
// lrs_ul.addEventListener("click",function (ev) {
//     var target= ev.target;
//     if(target.nodeName==="LI"){
//         var offset= target.offsetTop;
//         console.log(offset,target.innerText);
//         lrs_ul.style.marginTop= offset + "px" ;
//     }
// });

//获取歌词
function getLrc(url) {
    var xhr= new XMLHttpRequest();
    xhr.open("GET",url);
    xhr.onreadystatechange= function () {
        if(xhr.readyState===4&& xhr.status===200){
            //console.log(xhr.responseText.split(/[\n]/g));
            //console.log(xhr.responseText.match(/\d+:\d+/g));
            arrLrc= xhr.responseText.split(/[\n]/g);
            console.log(arrLrc);
            for(let i=0;i<arrLrc.length;i++){
               // lrs_ul.innerHTML+= "<li class='lrc'>"+ arrLrc[i].replace((/\[.*?\]/g),"") +"</li>";
                lrs_ul.innerHTML+= `<li class="lrc_li" data-time=${arrLrc[i].match(/\d+:\d+/g)}>${arrLrc[i].replace((/\[.*?\]/g),"")}</li>`

            }
        }
    };
    xhr.send();
}
//匹配歌词与当前播放时间
audio.ontimeupdate=function(){
    var time= transTime(audio.currentTime);

    for(let i=0;i<lrc_li.length;i++){
        if(time=== lrc_li[i].dataset.time){
            lrc_li[i-1].classList.remove("focus");
            lrc_li[i].classList.add("focus");
            if( i>7&&((lrc_li.length-i)>8) ){
                lrs_ul.style.marginTop= -30* (i-7) + 'px';
                console.log(lrc_li[i].innerText);
            }
        }
    }

};

//切换封面和歌词
imgBtn.onmousedown=function () {
    console.log("img is hidden");
    bgImg.style.display= "block";
    lryUi.style.display= "none";
    console.log("u can c lry now");
};
lryBtn.onmousedown=function () {
    console.log("lry is hidden");
    bgImg.style.display= "none";
    lryUi.style.display= "block";
    console.log("u can c img now");
};

audio.oncanplay=function(){
    show_dur();
};
window.onload= initPlayer();

//初始化图片以及音乐
function initPlayer() {
    lrs_ul.innerHTML="";
    lrs_ul.style.marginTop= 0;
    var lrcUrl= playList[curIndex].lrc;
    getLrc(lrcUrl);
    audio.load();
    mySource.setAttribute('src',playList[curIndex].url);
    bgImg.setAttribute('src',playList[curIndex].bgUrl);
}
//图片自旋转
function rotate() {
    curDeg= deg;
    timer=setInterval(function () {
        bgImg.style.transform= "rotate("+deg+"deg)";
        deg+=0.1;
        if(deg===360){
            deg=0;
        }
    },20);
}
function stopRotate() {
    clearInterval(timer);
    flag=0;
}
function resetImg() {
    onOff_img.src="icon_svg/播放.svg";
    count!==0&&stopRotate();
    count=1;
    deg=0;
    bgImg.style.transform="rotate(0)";
}
//修改时间格式
function transTime(num,length) {
    var time= Math.ceil(num),
        sec= time%60,
        transSec=(Array(length).join('0') + sec).slice(-length);
    var transTime= `${parseInt(time/3600)}${parseInt(time/60)}:${transSec}`;

    return  transTime;
}
//显示递增时间
function show_timing() {
    setInterval(function () {
        curDur_box.innerText=transTime(audio.currentTime,2)
        //curDur_box.innerText= time;
    },1000)
}
function fillBarChange() {
    setInterval(function () {
        fillBar.style.width= `${(audio.currentTime/audio.duration)*340}px`;
    },50)
}
//显示总时长
function show_dur() {
    var dur= Math.ceil(audio.duration);
    var dur_show= transTime(dur,2);
    music_dur.innerText= dur_show;
    curDur= Math.ceil(audio.duration);
}
show_timing();
fillBarChange();


//显示当前播放时长
function playMusic() {
    //onoff.classList.add("off");
    if(audio.paused){
        audio.play();
        rotate();
    }else{
        audio.pause();
        stopRotate();
    }
}
//上一首/下一首
function preOne(){
    curIndex===0 ? curIndex=(playList.length-1):--curIndex;
    initPlayer();
    audio.play();
    resetImg();
    rotate();
}
function nextOne(){
    curIndex===playList.length-1 ? curIndex=0:++curIndex;
    initPlayer();
    audio.play();
    resetImg();
    rotate();
}
//切换播放暂停图标
onOff_img.onmouseup=function () {
    count%2===0? onOff_img.src="icon_svg/播放.svg":onOff_img.src="icon_svg/暂停.svg";
    count++;
};

//进度条拖动拖动
function adjust(e){
    var bar=e.target;
    var x=e.offsetX;
    console.log("x=" + x);
    audio.currentTime=""+parseInt((x*audio.duration)/340)+"";
    console.log("curTime=" +audio.currentTime);
}

