    function vertold(beta){
    
    // beta = Math.round(beta);
    var top=parseInt(bubble.style.top);

    if (top >= 0 && top <= h-60) {
        topVal = Math.round(top+(0.1*beta));
        // console.log('topVal : '+topVal);
        bubble.style.top = topVal+'px';

    }else if(top < 0){
        bubble.style.top = '0px';

    }else if(beta > 0){
        var offset = h-60;
        // console.log('offset : '+offset);
        bubble.style.top = offset+'px';
    }
}

var bubble = document.getElementById('bubble');
bubble.style.top = '20px';
bubble.style.left = '0px';
var w = parseInt(window.innerWidth), h = parseInt(window.innerHeight);

function vert(beta){
    // console.log(beta);

    var tTop = parseInt(bubble.style.top);
    var ease = 1;

    if (tTop < 10*h/100) {
        ease = tTop/h*10;
    }else if(tTop > 90*h/100){
        ease = 1-(tTop/h*10);
    }else if(tTop>h){
        ease=0;
    }
    console.log(ease);

    topVal = Math.round(tTop+(ease*beta));
    bubble.style.top = topVal+'px';
    
}

window.addEventListener("deviceorientation", function(event) {

        vert(event.beta);
        // horz(event.gamma);
        document.getElementById('position').innerHTML = 'alpha : '+Math.round(event.alpha)+'<br> beta : '+Math.round(event.beta)+'<br> gamma : '+Math.round(event.gamma);

  }, true);

// window.addEventListener("devicemotion", function(event) {
//     console.log();
//     document.getElementById('position').innerText = 'z : '+event.acceleration.z+' y : '+event.acceleration.y;
    
// }, true);