const navbar_sketch = (p) => {
	let bg_color;
	let particles;
	let maxParticles;

	let chance = 0.9;

	class Particle {
		constructor(x, y, down) {
			this.x = x;
			this.y = y;
			this.counter = 0;
			this.max = 40;
			this.begCol = p.color('#BEFFC7');
			this.begCol.setAlpha(0);
			this.endCol = p.color('#FFFFFF');
			this.minRange = 1;
			this.maxRange = 3;
		}

		display() {
			p.stroke(p.colorMap(this.counter / this.max, 0, 1, this.begCol, this.endCol));				
			p.point(this.x, this.y);
			this.y -= p.random(this.minRange, this.maxRange);

			this.counter += 1;
			return (this.counter >= this.max);
		}
	}

	p.setup = () => {
		const nb = document.getElementById('navsketch');
		p.createCanvas(nb.offsetWidth, nb.offsetHeight);
		
		bg_color = p.color('#020202');
		bg_color.setAlpha(32);


		particles = [];
		maxParticles = 30;

		p.background(bg_color);

	};

	p.windowResize = () => {
		const hd = document.getElementById('navsketch');
		p.resizeCanvas(hd.offsetWidth, hd.offsetHeight);
	};

	p.draw = () => {
		p.background(bg_color);
		if (particles.length < maxParticles && p.random(0,1) < chance) {
			particles.push(new Particle(p.random(0,p.width), p.random(0,p.height)));
		}
		for (let i = particles.length - 1; i >= 0; i--) {
			if (particles[i].display()) {
				particles.splice(i, 1);
			}
		}
	};

	p.inCanvas = () => {
		return (p.mouseX >= 0 && p.mouseX < p.width && p.mouseY >= 0 && p.mouseY < p.height);
	};

	p.colorMap = (val, lmin, lmax, cmin, cmax) => {
		return p.color(
			p.map(val, lmin, lmax, p.red(cmin), p.red(cmax)),
			p.map(val, lmin, lmax, p.green(cmin), p.green(cmax)),
			p.map(val, lmin, lmax, p.blue(cmin), p.blue(cmax)),
			p.map(val, lmin, lmax, p.alpha(cmin), p.alpha(cmax))
		);
	}
}

new p5(navbar_sketch, 'navsketch');
