let bg_c, txt_c, acc_c, blk_c;
let rows, cols, wres, hres;

let rawText;
let baseData, currentData;

let frameCount;
let frameCountMax = 25;

function preload() {
	rawText = loadStrings('/files/header_ascii.txt');
}

function setup() {
	const hd = document.getElementById('header-data');
	let canvas = createCanvas(hd.offsetWidth, hd.offsetHeight);
	canvas.parent('header-data');

	bg_c = color('#72705B');
	txt_c = color('#FCEFEF');
	acc_c = color('#BEFFC7');
	blk_c = color('#020202');

	rows = rawText.length - 1;
	cols = rawText[0].length;
	wres = width / cols;
	hres = height / (rows + 1);

	frameCount = 0;

	baseData = rawText.map(r => r.split(''));
	currentData = baseData.map(r => [...r]);
}

function windowResized() {
	const hd = document.getElementById('header-data');
	resizeCanvas(hd.offsetWidth, hd.offsetHeight);
	wres = width / cols;
	hres = height / (rows + 1);
}

function inCanvas() {
	if (mouseX < 0 || mouseX >= width) {
		return false;
	}
	if (mouseY < 0 || mouseY >= height) {
		return false;
	}
	return true;
}

function mouseClicked() {
	if (!inCanvas()) {
		return false;
	}
	console.log("clicked");
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			let r = random(0,1);
			if (r < 0.25) {
				currentData[y][x] = 'X';
			} else if (r < 0.5) {
				currentData[y][x] = 'O';
			}
		}
	}
	frameCount = ceil(frameCountMax / 2);
}

function notAlphaNum(c) {
	if (c == 'O' || c == 'X') {
		return true;
	}
	return !(/^[a-z0-9]$/i.test(c));
}

function draw() {
	background(bg_c);
	textSize(10);
	textFont('Courier New');
	textStyle(BOLD);

	if (frameCount > frameCountMax) {
		updateSparkles();
		frameCount = 0;
	}

	if (inCanvas()) {
		let x = floor((mouseX / width) * cols);
		let y = floor((mouseY / height) * rows);
		currentData[y][x] = 'O';
		if (x < cols - 1) {
			currentData[y][x+1] = 'O';
			if (y < rows - 1) {
				currentData[y+1][x+1] = 'O';
				currentData[y+1][x] = 'O';
			}
		} else if (y < rows - 1) {
			currentData[y+1][x] = 'O';
		}
	}

	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			if (currentData[y][x] == 'O') {
				fill(acc_c);
			} else if (currentData[y][x] == 'X') {
				fill(blk_c);
			} else {
				fill(txt_c);
			}
			text(currentData[y][x], wres * x, (12 + hres * y));
		}
	}
	frameCount++;
}

function updateSparkles() {
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			if (notAlphaNum(currentData[y][x])) {
				if (currentData[y][x] == 'O') {
					currentData[y][x] = 'X';
				} else if (random(0,1) < 0.03) {
					currentData[y][x] = '▓';
				} else {
					currentData[y][x] = baseData[y][x];
				}
			}
		}
	}
}
