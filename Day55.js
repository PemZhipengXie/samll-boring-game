/*
Coding Challenge #5: Space Invaders in JavaScript with p5.js
https://www.youtube.com/watch?v=biN3v3ef-Y0
practice
*/

var gif1;
var gif2;
var ship;
var ratio;
var ratio2;
var ratio3;

var gotHitSound;
var shootSound;
var winSound;
var lostSound;
var boom1Sound;
var boom2Sound;



var flowers = [];
var drops = [];
var smallFlowers = [];
var bigbangs = [];

var col = [];

var score = 0;


function preload() {
    gif1 = loadGif('win.gif');
    gif2 = loadGif('lost.gif');

    gotHitSound = loadSound('gothit.mp3');
    shootSound = loadSound('shoot.mp3');
    winSound = loadSound('win.mp3');
    lostSound = loadSound('lost.mp3');
    boom1Sound = loadSound('boom1.mp3');
    boom2Sound = loadSound('boom2.mp3');
}

function setup() {


    createCanvas(700, 700);
    ship = new Ship();

    //    drops = new Drop(width/2,height/2);
    for (var i = 0; i < 6; i++) {
        flowers[i] = new Flower(i * 80 + 160, 100);
    }

}




function draw() {


    background(23, 35, 55);

    noStroke();
    fill(255, 90);
    textFont("Arial"); //font
    textSize(20); //size
    textAlign(LEFT, CENTER);
    text('DAY 055', width - 95, 35);

    textSize(18); //size
    text("#CODING365", 25, 35);

    textSize(14); //size
    text("Created by", 25, height - 50);
    textSize(16); //size
    text("Pem Zhipeng Xie", 25, height - 30);

    textSize(16); //size
    text("15 DEC 2017", width - 125, height - 30);
    //    stroke(255);


    noStroke();
    textSize(20);
    fill(74, 224, 242);
    text("YOUR SCORE:   " + score, width - 200, height - 60);

    ratio = map(cos(frameCount / 60), 0, 1, PI / 4, 2 * PI);
    ratio2 = map(noise(frameCount / 60), -1, 1, 0, 0.70);
    ratio3 = 0.3 //map(-sin(frameCount / 30 ), -1, 1, 0, 0.30);


    ship.show();
    ship.move();
    ship.bon();

    for (var i = 0; i < drops.length; i++) {
        drops[i].show();
        drops[i].move();


        for (var j = 0; j < flowers.length; j++) {
            if (drops[i].hits(flowers[j])) {
                score++;
                console.log("BOOM!");
                flowers[j].grow();
                flowers[j].boom();
                gotHitSound.play();
                drops[i].disappear();
            }
        }
        for (var j = 0; j < smallFlowers.length; j++) {
            if (drops[i].hits(smallFlowers[j])) {
                score++;
                console.log("BOOM!");
                smallFlowers[j].grow();
                smallFlowers[j].boom();
                gotHitSound.play();
                drops[i].disappear();
            }
        }
    }



    for (var i = 0; i < smallFlowers.length; i++) {
        smallFlowers[i].show();
        smallFlowers[i].move();
    }



    for (var i = 0; i < flowers.length; i++) {
        flowers[i].show();
        flowers[i].move();
        flowers[i].bon();
    }

    for (var i = 0; i < bigbangs.length; i++) {
        bigbangs[i].show();
        bigbangs[i].move();
        //        bigbangs[i].bon();
    }



    for (var i = drops.length - 1; i > 0; i--) {
        if (drops[i].toDelete) {
            drops.splice(i, 1);
        }
    }

    //    for (var i = bigbangs.length - 1; i > 0; i--) {
    ////        if (bigbangs[i].y > width) {
    ////            bigbangs.splice(i, 1);
    ////        }
    //    }

    for (var i = flowers.length - 1; i > -1; i--) {
        if (flowers[i].r > 50) {
            smallFlowers.push(new SmallFlower(flowers[i].x, flowers[i].y));
            score += 3;
            boom1Sound.play();



            flowers.splice(i, 1);
            console.log(i);
        }
    }

    for (var i = smallFlowers.length - 1; i > -1; i--) {

        if (smallFlowers[i].y > height) {
            ship.Lost();


            if (ship.s <= 80) {
                //                        lostSound.playMode('restart'); 
                lostSound.play();
            }
        }

        if (smallFlowers[i].r > 30) {
            bigbangs.push(new bigbang(smallFlowers[i].x, smallFlowers[i].y, 300));
            ship.xspeed += 3;
            score += 5;
            boom2Sound.play();

            smallFlowers.splice(i, 1);
            console.log(i);
        }
    }

    if (flowers.length == 0 && smallFlowers.length == 0 && bigbangs.length) {
        ship.Win();

        if (ship.s <= 80) {
            //            winSound.playMode('restart');
            winSound.play();
        }
    }
}



function keyPressed() {

    if (key === ' ') {
        var drop = new Drop(ship.x, height - 60); //goood!!
        drops.push(drop);
        score -= 0.5;
        shootSound.play();

    }




    if (keyCode === RIGHT_ARROW) {
        ship.setDir(1);
    } else if (keyCode === LEFT_ARROW) {
        ship.setDir(-1);
    }
}


//ship 
function Ship() {
    this.s = 0;
    this.x = width / 2;
    this.xdir = 0;
    this.xspeed = 5;
    this.show = function () {
        fill(255);
        rectMode(CENTER);
        rect(this.x, height - 20, 20, 60);
    }

    this.setDir = function (dir) {
        this.xdir = dir;
    }

    this.move = function () {
        this.x += this.xdir * this.xspeed;
    }

    this.bon = function () {
        if (this.x > width || this.x < 0) {
            this.xdir *= -1;
        }
    }


    this.Win = function () {
        //        this.o = o;
        textSize(35); //size
        textAlign(CENTER);


        text("YOU WIN", width / 2, height / 2 - 80);

        textSize(50);
        text(score, width / 2, height / 2 - 120);


        imageMode(CENTER)
        if (gif1.loaded()) {

            image(gif1, width / 2, height / 2 + 80, 200, 270);
        }
        gif1.play();
        this.s += 1;
    }



    this.Lost = function () {
        //        this.o = o;
        //size
        textAlign(CENTER);

        textSize(35);
        text("YOU LOST", width / 2, height / 2 - 80);
        textSize(50);
        text(score, width / 2, height / 2 - 120);
        imageMode(CENTER)
        if (gif2.loaded()) {
            image(gif2, width / 2, height / 2 + 80, 200, 270);
        }
        gif2.play()
        this.s += 1;




    }
}





//flower
function Flower(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
    
    c1 = color(74, 224, 242);
    c2 = color(233, 2, 146);
    c3 = color(226, 230, 54);
    c4 = color(150, 4, 191);
    this.go = false;


    this.boom = function () {
        fill(c1);
        ellipse(this.x, this.y, this.r * 3, this.r * 3);

    }

    this.move = function () {
        this.xSpeed = random(-0.5,0.5);
        this.x += this.xSpeed;
        

    }

    this.bon = function () {
        if (this.x < 0 || this.x > width) {
            this.xSpeed *= -1;
        }
    }

    this.show = function () {
        noStroke();
        fill(255, 0, 200);

        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    this.grow = function () {
        this.r += 2;
    }

}

function SmallFlower(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.ySpeed = 1;
    c1 = color(74, 224, 242);
    c2 = color(233, 2, 146);
    c3 = color(226, 230, 54);
    c4 = color(150, 4, 191);
    //    this.go = false;


    this.boom = function () {
        fill(c2);
        ellipse(this.x, this.y, this.r * 3, this.r * 3);

    }


    this.show = function () {
        noStroke();
        fill(c3);

        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    this.grow = function () {
        this.r += 4;
    }

    this.move = function () {
        this.x += random(-3, 3);
        this.y += this.ySpeed;
    }

}

function bigbang(x, y, n) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.yspeed = 6;
    this.xspeed = random(-2, 3);

    this.show = function () {
        push();
        translate(this.x, this.y);
        //    scale(mouseX/90);
        push()
        for (i = 0; i < 12; i++) {

            recursion(this.n);
            rotate(PI / 6);
        }
        pop();
        pop();
    }

    this.move = function () {
        this.y += this.yspeed;
        this.x += this.xspeed;

        if (this.x >= width || this.x <= 0) {
            this.xspeed *= -1;
        }

        if (this.y >= height || this.y <= 0) {
            this.yspeed *= -1;
        }
    }
}



//Drop
function Drop(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.toDelete = false;

    this.show = function () {
        noStroke();
        fill(150, 0, 200);

        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    this.move = function () {
        this.y -= 12;
    }


    this.hits = function (flower) {
        var d = dist(this.x, this.y, flower.x, flower.y);
        if (d < this.r + flower.r) {
            return true;
        } else {
            return false;
        }
    }

    this.disappear = function () {
        this.toDelete = true;
    }

}

//start

function recursion(r) {
    //blendMode(OVERLAY);
    blendMode(SCREEN);
    // blendMode(REPLACE);
    // blendMode(BURN);


    r2 = r * ratio3;
    r = r * ratio2;


    push();

    strokeWeight(0.5);

    line()
    noStroke();

    fill(226, 230, 54);
    var v1 = r2 / 2;

    ellipse(r, r, 4, 4);
    ellipse(-r, -r, r / 25, r / 25);
    pop();



    if (r > 30) {
        push();
        translate(60, 0);
        rotate(ratio);
        recursion(r);
        pop();

        push();
        translate(60, 0);
        rotate(-ratio);
        recursion(r);
        pop();
    }
}