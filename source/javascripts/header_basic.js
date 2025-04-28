const header_sketch = (p) => {
	let catMovement = 16;
	class Cat {
		constructor(frames, rows, cols, wres, hres) {
			this.frames = frames;
			this.frameWidth = frames[0][0].length;
			this.frameHeight = frames[0].length;
			this.ratio = 2.0;

			// for counting states
			this.step = 0;
			this.sitCounter = 0;
			this.walkLimit = 4;

			// for calculating distances
			this.maxWidth = cols * this.ratio;
			this.wRes = wres / this.ratio;
			this.hRes = hres / this.ratio;
			this.jumpCol = p.color('#E38C9B');
			this.col = p.color('#5DFDCB');
			this.x = -this.frameWidth;
			this.y = (this.frameHeight * this.ratio) - 3;

			// for counting frames
			this.counter = 0;
			this.rate = 6;

			// for counting jump frame
			this.jump = false;
			this.jumpCount = 0;
			this.jumpMax = 15;
		}

		update() {
			if (this.jump) {
				this.x += p.random(-0.5,0.5);
				this.step = 4;
				this.jumpCount += 1;
				if (this.jumpCount > this.jumpMax) {
					this.jumpCount = 0;
					this.jump = false;
					this.step = 0;
					this.sitCounter = 0;
				}
			} else if (this.counter >= this.rate) {
				this.step += 1;
				if (this.sitCounter >= this.walkLimit) {
					this.step = 3;
					this.sitCounter = - 50;
					this.x += catMovement;
				} else if (this.step >= 3) {
					if (this.sitCounter >= 0) {
						this.step = 0;
						this.x += catMovement;
					} else {
						this.step = 3;
					}
					this.sitCounter += 1;
				} else {
					this.x += catMovement;
				}
				if (this.x > this.maxWidth) {
					this.sitCounter = 1;
					this.x = -this.frameWidth;
				}
				this.counter = 0;
			} else {
				this.counter += 1;
			}
		}

		display() {
			if (this.jump) {
				p.fill(this.jumpCol);
			} else {
				p.fill(this.col);
			}
			for (let i = 0; i < this.frameWidth; i++) {
				for (let j = 0; j < this.frameHeight; j++) {
					let xloc = (this.x + i) * this.wRes;
					let yloc = (this.y + j) * this.hRes;
					p.text(
						this.frames[this.step][j][i],
						xloc, yloc
					);
				}
			}
		}
	}

	let bg_c, txt_c, acc_c, blk_c, shd_c;
	let rows, cols, wres, hres;

	let rawText;
	let baseData, currentData;

	let frameCount;
	let frameCountMax = 35;

	let xcol, ycol;
	let colChange = 0.01;
	let colDist = 0.1;

	let cat;

	p.preload = () => {
		rawText = p.loadStrings('/files/header_ascii.txt');
		catFrameOne = p.loadStrings('/files/cat_ascii_one.txt');
		catFrameTwo = p.loadStrings('/files/cat_ascii_two.txt');
		catFrameThree = p.loadStrings('/files/cat_ascii_three.txt');
		catFrameFour = p.loadStrings('/files/cat_ascii_four.txt');
		catFrameFive = p.loadStrings('/files/cat_ascii_five.txt');
	};

	p.setup = () => {
		const hd = document.getElementById('header-data');
		p.createCanvas(hd.offsetWidth, hd.offsetHeight);

		blk_c = p.color('#72705B');
		txt_c = p.color('#FFFFFF');
		shd_c = p.color('#000000');
		acc_c = p.color('#BEFFC7');
		bg_c = p.color('#020202');
		bg_c.setAlpha(64);

		rows = rawText.length - 2;
		cols = rawText[0].length;
		wres = p.width / cols;
		hres = p.height / (rows + 1);

		frameCount = 0;

		baseData = rawText.map(r => r.split(''));
		currentData = baseData.map(r => [...r]);

		cat = new Cat(
			[catFrameOne, catFrameTwo, catFrameThree, catFrameFour, catFrameFive], 
			rows, cols, wres, hres
		);

		xcol = p.random(0,10000);
		ycol = p.random(0,10000);
	};

	p.windowResized = () => {
		const hd = document.getElementById('header-data');
		p.resizeCanvas(hd.offsetWidth, hd.offsetHeight);
		wres = p.width / cols;
		hres = p.height / (rows + 1);
	};

	p.inCanvas = () => {
		if (p.mouseX < 0 || p.mouseX >= p.width) {
			return false;
		}
		if (p.mouseY < 0 || p.mouseY >= p.height) {
			return false;
		}
		return true;
	};

	p.mouseClicked = () => {
		if (!p.inCanvas()) {
			return;
		}

		cat.jump = true;

		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				let r = p.random(0,1);
				if (r < 0.25) {
					currentData[y][x] = '-';
				} else if (r < 0.5) {
					currentData[y][x] = '.';
				}
			}
		}
		frameCount = p.ceil(frameCountMax / 2);
	};

	p.notAlphaNum = (c) => {
		if (c == '.' || c == '-') {
			return true;
		}
		return !(/^[a-z0-9]$/i.test(c));
	};

	p.draw = () => {
		p.background(bg_c);

		p.stroke(blk_c);
		p.line(0,0,0,p.height);
		p.line(p.width,0,p.width,p.height);
		p.noStroke();

		p.textSize(8);
		p.textFont('Courier New');
		p.textStyle(p.BOLD);

		if (frameCount > frameCountMax) {
			p.updateSparkles();
			frameCount = 0;
		}

		if (p.inCanvas()) {
			let x = p.floor((p.mouseX / p.width) * cols);
			let y = p.floor((p.mouseY / p.height) * rows);
			currentData[y][x] = '-';
			if (x < cols - 1) {
				currentData[y][x+1] = '-';
				if (y < rows - 1) {
					currentData[y+1][x+1] = '-';
					currentData[y+1][x] = '-';
				}
			} else if (y < rows - 1) {
				currentData[y+1][x] = '-';
			}
		}

		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if ((currentData[y][x] == '.' || currentData[y][x] == '-') && p.random(0,1) > 0.5) {
						p.fill(acc_c);
				} else {
					let mColor = p.mappedColor(
						xcol + (x * colDist), 
						ycol + (y * colDist), 
						txt_c, shd_c
					);
					p.fill(mColor);
				}
				p.text(currentData[y][x], (wres * x), (12 + hres * y));
				p.fill(blk_c);
				p.text(currentData[y][x], (wres * x), ((12 + hres * y) - 5));
			}
		}
		cat.update();
		cat.display();
		frameCount++;
		xcol += colChange;
		ycol += colChange;
	};

	p.updateSparkles = () => {
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if (p.notAlphaNum(currentData[y][x])) {
					if (currentData[y][x] == '-') {
						currentData[y][x] = '.';
					} else if (p.random(0,1) < 0.03) {
						currentData[y][x] = '▓';
					} else {
						currentData[y][x] = baseData[y][x];
					}
				}
			}
		}
	};

	p.mappedColor = (x, y, front, back) => {
		let m = p.noise(x, y);
		return p.color(
			p.map(m, 0, 1, p.red(back), p.red(front)),
			p.map(m, 0, 1, p.green(back), p.green(front)),
			p.map(m, 0, 1, p.blue(back), p.blue(front))
		);
	};
};

new p5(header_sketch, 'header-data');
