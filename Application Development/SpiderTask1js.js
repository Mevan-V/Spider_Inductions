function getAngle(radians) {
    return Math.cos(radians) * 90;
}

function RotateNeedle(angle){
    Needle.style.transform = 'rotate(' + angle + 'deg)';
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function HammerHit(){
    hammer.style.animationName = 'hit';
    hammer.style.animationIterationCount = '1';
    hammer.style.animationDuration = '1.2s';
    hammer.style.animationTimingFunction = 'ease-out';
    await delay(1200);
    hammer.style.transform = 'rotate(135deg)';
    hammer.style.animationName = 'hit2';
    hammer.style.animationIterationCount = '1';
    hammer.style.animationDuration = '0.5s';
    hammer.style.animationTimingFunction = 'ease-in';
    await delay(500);
    hammer.style.transform = 'rotate(0deg)';
}

function NormalHammer(){
    hammer.style.animationName = 'shm';
    hammer.style.animationDuration = '2s';
    hammer.style.animationTimingFunction = 'ease-in-out';
    hammer.style.animationIterationCount = 'infinite';
    stop_button.disabled = false;
    stop_button.style.visibility = 'visible';
}

function GetScore(angle){
    if ((angle >= -0.5) && (angle <= 0.5)){     //Because getting exact 90deg is borderline impossible
        return 100;
    }else if (angle > 0.5){
        return (Math.E**(-angle/35) * 100).toFixed(1);  //Exponential decreasing function
    }else{
        return (Math.E**(angle/35) * 100).toFixed(1);
    }
}

async function ShowScore(current_radians){
    await delay(1200 + 500);
    final_angle = getAngle(current_radians);
    let final_score = GetScore(final_angle);
    let fill_score = 0;
    score_text.style.visibility = 'visible';
    score_text.innerHTML = 'Your Score is<br>0!';
    for (let i = 0; i < 10; i++){       //Slowly increases the final score from 0
        await delay(50);
        fill_score += final_score / 10;
        score_text.innerHTML = 'Your Score is<br>' + String(fill_score.toFixed(1)) + '!';
    }
    if (final_score == 100){
        score_text.innerHTML = 'Your Score is<br>Perfect ' + String(fill_score.toFixed(1)) + '!';
    }
    retry_button.disabled = false;
    retry_button.style.visibility = 'visible';
}

let spaceEvent = new KeyboardEvent("keydown", {
  key: " ",
  code: "Space",
  keyCode: 32,
  which: 32,
  bubbles: true
});

const Needle = document.getElementById('meter_needle');
if (Needle){

    let current_radians = 0.0;
    let angle_change_speed = 0.015;
    let final_angle = 0;
    let hittable = true;
    let clickable = true;
    const score_text = document.getElementById('score_text');
    const retry_button = document.getElementById('retry_button');
    const hammer = document.getElementById('hammer');
    const stop_button = document.getElementById('stop_button');

    setInterval(() => {
        RotateNeedle(getAngle(current_radians));
        current_radians += angle_change_speed;
    }, 0.01);

    document.addEventListener('keydown', function(event){
        if ((event.key == ' ') && (hittable)){
            angle_change_speed = 0;
            hittable = false;
            stop_button.disabled = true;
            stop_button.style.visibility = 'hidden';
            ShowScore(current_radians);
            HammerHit();
        }
    });

    retry_button.addEventListener('click', function(){
        angle_change_speed = 0.015;
        hittable = true;
        score_text.innerHTML = '';
        score_text.style.visibility = 'hidden';
        retry_button.disabled = true;
        retry_button.style.visibility = 'hidden';
        NormalHammer();
    });

    stop_button.addEventListener('click', function(){
        if ((clickable) && (hittable)){
            angle_change_speed = 0;
            hittable = false;
            stop_button.disabled = true;
            stop_button.style.visibility = 'hidden';
            ShowScore(current_radians);
            HammerHit();
        }
    });
}

else{
    console.log('Element Not Found!');
}