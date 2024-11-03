var card1 = document.querySelector(".card1");
var card2 = document.querySelector(".card2");
var card3 = document.querySelector(".card3");

var isFlipped1 = false;
var isFlipped2 = false;
var isFlipped3 = false;

card1.addEventListener('click', () => {
    // Redirect to manual dictionary page
    window.location.href = '/manual-dictionary';
});
card3.addEventListener('click', () => {
    // Redirect to manual dictionary page
    window.location.href = '/tts';
});
card1.addEventListener("mousemove", function() {
    if (!isFlipped1) {
        anime({
            targets: document.querySelector(".card1"),
            rotateY: "180deg",
            easing: 'easeInOutSine',
            duration: 250,
        });
        isFlipped1 = true;
    }
});

card1.addEventListener("mouseleave", function() {
    if (isFlipped1) {
        anime({
            targets: document.querySelector(".card1"),
            rotateY: "0deg",
            easing: 'easeInOutSine',
            duration: 400,
        });
        isFlipped1 = false;
    }
});

card2.addEventListener("mousemove", function() {
    if (!isFlipped2) {
        anime({
            targets: document.querySelector(".card2"),
            rotateY: "180deg",
            easing: 'easeInOutSine',
            duration: 250,
        });
        isFlipped2 = true;
    }
});

card2.addEventListener("mouseleave", function() {
    if (isFlipped2) {
        anime({
            targets: document.querySelector(".card2"),
            rotateY: "0deg",
            easing: 'easeInOutSine',
            duration: 400,
        });
        isFlipped2 = false;
    }
});

card3.addEventListener("mousemove", function() {
    if (!isFlipped3) {
        anime({
            targets: document.querySelector(".card3"),
            rotateY: "180deg",
            easing: 'easeInOutSine',
            duration: 250,
        });
        isFlipped3 = true;
    }
});

card3.addEventListener("mouseleave", function() {
    if (isFlipped3) {
        anime({
            targets: document.querySelector(".card3"),
            rotateY: "0deg",
            easing: 'easeInOutSine',
            duration: 400,
        });
        isFlipped3 = false;
    }
});
