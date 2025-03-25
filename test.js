const submit = document.querySelector('#submit');
const circle = document.querySelector('#circle');
circle.style.opacity = 1;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let landed = false;

function changeHeading() {
    let heading = document.querySelector('#heading');
    heading.innerHTML = 'This has been changed!';
}

function readContent() {
    const textBox = document.querySelector('#myTextbox');
    alert(textBox.value);
}

function positionleft() {
    let position = circle.getBoundingClientRect();
    let positionLeft = position.left;
    return positionLeft;
}

function positionTop() {
    let position = circle.getBoundingClientRect();
    let positionTop = position.top;
    return positionTop;
}

function gravity() {
    let windowHeight = window.innerHeight;
    let posTop = positionTop();
    if (posTop+110 < windowHeight){
        circle.style.top = posTop + 5 + 'px';
    }else{
        landed = true;
    }
}

function keyUp(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === ' '){
        if (landed === true){
            upPressed = true;
            setTimeout(function() {
                upPressed = false;
                landed = false;
            }, 60)
        }

    }
}

setInterval(function() {
    let positionLeft = positionleft();
    let posTop = positionTop();
    if(upPressed) {
        console.log(posTop)
        circle.style.top = posTop - 20 + 'px';
    }else if(leftPressed) {
        positionLeft = positionLeft - 2
        circle.style.left = positionLeft + 'px';
    }else if(rightPressed) {
        positionLeft = positionLeft + 2
        circle.style.left = positionLeft + 'px';
    } console.log(posTop)
    
}, 1);



document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


let timer = setInterval(gravity, 10)
heading.addEventListener('click', changeHeading);
submit.addEventListener('click', readContent);