const header_sketch = (p) => {
	let bg_c, txt_c, acc_c, blk_c;
	let rows, cols, wres, hres;

	let rawText;
	let baseData, currentData;

	let frameCount;
	let frameCountMax = 15;

	p.preload = () => {
		rawText = p.loadStrings('/files/header_ascii.txt');
	};

	p.setup = () => {
		const hd = document.getElementById('header-data');
		p.createCanvas(hd.offsetWidth, hd.offsetHeight);

		blk_c = p.color('#72705B');
		txt_c = p.color('#FCEFEF');
		acc_c = p.color('#BEFFC7');
		bg_c = p.color('#020202');

		rows = rawText.length - 1;
		cols = rawText[0].length;
		wres = p.width / cols;
		hres = p.height / (rows + 1);

		frameCount = 0;

		baseData = rawText.map(r => r.split(''));
		currentData = baseData.map(r => [...r]);
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
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				let r = p.random(0,1);
				if (r < 0.25) {
					currentData[y][x] = '*';
				} else if (r < 0.5) {
					currentData[y][x] = '.';
				}
			}
		}
		frameCount = p.ceil(frameCountMax / 2);
	};

	p.notAlphaNum = (c) => {
		if (c == '.' || c == '*') {
			return true;
		}
		return !(/^[a-z0-9]$/i.test(c));
	};

	p.draw = () => {
		p.background(bg_c);
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
			currentData[y][x] = '.';
			if (x < cols - 1) {
				currentData[y][x+1] = '.';
				if (y < rows - 1) {
					currentData[y+1][x+1] = '.';
					currentData[y+1][x] = '.';
				}
			} else if (y < rows - 1) {
				currentData[y+1][x] = '.';
			}
		}

		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if (currentData[y][x] == '.' && p.random(0,1) > 0.5) {
					p.fill(acc_c);
				} else if (currentData[y][x] == '*') {
					p.fill(blk_c);
				} else {
					p.fill(txt_c);
				}
				p.text(currentData[y][x], wres * x, (12 + hres * y));
				p.fill(blk_c);
				p.text(currentData[y][x], (wres * x), ((12 + hres * y) - 5));
			}
		}
		frameCount++;
	};

	p.updateSparkles = () => {
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if (p.notAlphaNum(currentData[y][x])) {
					if (currentData[y][x] == '.') {
						currentData[y][x] = '*';
					} else if (p.random(0,1) < 0.03) {
						currentData[y][x] = '▓';
					} else {
						currentData[y][x] = baseData[y][x];
					}
				}
			}
		}
	};
};

new p5(header_sketch, 'header-data');
