const navbar_sketch = (p) => {
	let bg_color;

	p.setup = () => {
		const nb = document.getElementById('navsketch');
		p.createCanvas(nb.offsetWidth, nb.offsetHeight);
		
		bg_color = p.color('#020202');
		acc_color = p.color('#EAF0CE');
		bor_color = p.color('#BEFFC7');

		p.background(bg_color);
	};

	p.windowResize = () => {
		const hd = document.getElementById('navsketch');
		p.resizeCanvas(hd.offsetWidth, hd.offsetHeight);
	};

	p.draw = () => {
		if (p.inCanvas()) {
			p.stroke(bor_color);
			p.point(p.mouseX, p.mouseY);
		}
	};

	p.inCanvas = () => {
		return (p.mouseX >= 0 && p.mouseX < p.width && p.mouseY >= 0 && p.mouseY < p.height);
	};
}

new p5(navbar_sketch, 'navsketch');
