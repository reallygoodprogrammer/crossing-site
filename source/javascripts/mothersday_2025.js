let max_flower_counter = 8;
let max_flower_step = 5;
let flowers_chance = 0.1;
let flowers = [];

let edge_counter_max = 200;
let edge_disp = 50;
let edge_points;
let edges = [];

let col_1 = "#B8E2C8";
let col_2 = "#AA7DCE";
let col_3 = "#F5D7E3";
let col_4 = "#F4A5AE";
let col_5 = "#A8577E";

let bee_col_1 = "#eef204";
let bee_col_2 = "#000000";
let bee_size = 4;
let bee_change = 0.005;
let bees = [];

var bg_color;

class Flower {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;

		this.counter = 0;
		this.step = max_flower_step;
		let r = random(0,1);
		if (r < 0.33) {
			this.col = color(col_5);
		} else if (r < 0.66) {
			this.col = color(col_4);
		} else {
			this.col = color(col_3);
		}
	}

	update() {
		if (this.counter >= max_flower_counter) {
			this.counter = 0;
			this.step -= 1;
			if (this.step == 0) {
				return false;
			}
		} else {
			this.counter += 1;
		}
		return true;
	}

	display() {
		let w = this.size / (this.step + 1);
		let halfw = this.size / 2;
		let s = this.size / this.step;
		stroke(this.col);
		noFill();
		for (let i = 0; i < this.step; i++) {
			let off = ((i+1) * w) - halfw;
			for (let j = 0; j < i*4; j++) {
				let r = (j / (i*4)) * TWO_PI;
				let xcos = cos(r) * s;
				let ysin = sin(r) * s;
				ellipse(
					this.x + xcos, 
					this.y + ysin, 
					s, s
				);
			}
		}
	}
}

class Bee {
	constructor(type) {
		this.counter = random(0,100000);
		this.yoff = random(0,10000);
		this.size = 5;

		if (type == 0) {
			this.min = createVector(0, 0);
			this.max = createVector(0.2, 1);
		} else {
			this.min = createVector(0.8, 0);
			this.max = createVector(1, 1);
		}
	}

	update() {
		this.counter += bee_change;
		this.x = map(noise(this.counter), 0, 1, this.min.x * width, this.max.x * width);
		this.y = map(noise(this.counter + this.yoff), 0, 1, this.min.y * height, this.max.y * height);
	}

	display() {
		let col1, col2;
		if (random(0,1) > 0.85) {
			col1 = color(bee_col_1);
			col2 = color(bee_col_2);
		} else {
			col1 = color(bee_col_2);
			col2 = color(bee_col_1);
		}

		noStroke();
		fill(col1);
		rect(this.x, this.y, bee_size, bee_size);
		rect(this.x+bee_size, this.y+bee_size, bee_size, bee_size);
		fill(col2);
		rect(this.x+bee_size, this.y, bee_size, bee_size);
		rect(this.x, this.y+bee_size, bee_size, bee_size);
	}
}

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('canvasId');
	bg_color = color(col_1);
	bg_color.setAlpha(64);

	for (let i = 0; i < 6; i++) {
		bees.push(new Bee(i%2));
	}
}


function draw() {
	background(bg_color);
	makeFlowers();
	makeBees();
}

function makeBees() {
	for (let i = 0 ; i < bees.length; i++) {
		bees[i].update();
		bees[i].display();
	}
}

function makeFlowers() {
	if (random(0,1) < flowers_chance) {
		flowers.push(new Flower(random(0,width), random(0,height), random(50,100)));
	}

	for (let i = flowers.length-1; i >= 0; i--) {
		if (!flowers[i].update()) {
			flowers.pop(i);
		} else {
			flowers[i].display();
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
