import CanvasParameters from "canvas-parameters";

const canvas = document.getElementById("c1") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles: Particle[] = [];
let hue = 0;

const settings = {
	countOnClick: 2,
	moveSpeed: 1,
	size: 10,
	maxDistance: 100,
	generateAutomaticly: true,
	decreaseSize: 0.01,
};

const mouse: { x?: number; y?: number } = {
	x: undefined,
	y: undefined,
};

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

canvas.addEventListener("click", (event) => {
	mouse.x = event.x;
	mouse.y = event.y;
	for (let i = 0; i < settings.countOnClick; i++) {
		particles.push(new Particle());
	}
});

canvas.addEventListener("mousemove", (event) => {
	mouse.x = event.x;
	mouse.y = event.y;
	for (let i = 0; i < settings.countOnClick; i++) {
		particles.push(new Particle());
	}
});

class Particle {
	x: number;
	y: number;
	size: number;
	/** from -1.5 to 1.5 */
	speedX: number;
	/** from -1.5 to 1.5 */
	speedY: number;
	color: string;
	constructor() {
		if (!mouse.x || !mouse.y) throw new Error("no x or y coordinate");
		this.x = mouse.x;
		this.y = mouse.y;
		this.size = Math.random() * settings.size + 1;
		this.speedX = Math.random() * settings.moveSpeed - settings.moveSpeed / 2;
		this.speedY = Math.random() * settings.moveSpeed - settings.moveSpeed / 2;
		this.color = `hsl(${hue}, 100%, 50%)`;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.size > 0.2) this.size -= settings.decreaseSize;
	}

	draw() {
		if (!ctx) return console.error("ctx is not defined");

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

function handleParticles() {
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
		for (let j = i; j < particles.length; j++) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < settings.maxDistance) {
				if (!ctx) return console.error("ctx is not defined");
				ctx.beginPath();
				ctx.strokeStyle = particles[i].color;
				ctx.lineWidth = 0.1;
				ctx.moveTo(particles[i].x, particles[i].y);
				ctx.lineTo(particles[j].x, particles[j].y);
				ctx.stroke();
				ctx.closePath();
			}
		}

		if (particles[i].size <= 0.3) {
			particles.splice(i, 1);
			i--;
		}
	}
}

function animate() {
	if (!ctx) return console.error("ctx is not defined");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	handleParticles();

	hue += 0.5;
	requestAnimationFrame(animate);
}

if (settings.generateAutomaticly) {
	setInterval(() => {
		if (!settings.generateAutomaticly) {
			return;
		}
		mouse.x = window.innerWidth * Math.random();
		mouse.y = window.innerHeight * Math.random();
		for (let i = 0; i < settings.countOnClick; i++) {
			particles.push(new Particle());
		}
	}, 100);
}

animate();

new CanvasParameters(
	[
		{
			type: "range",
			min: "1",
			max: "10",
			value: settings.countOnClick,
			onChange: (value) => {
				settings.countOnClick = value;
			},
			placeholder: "Количество шаров в клик / тик",
			name: "countOnClick",
		},
		{
			type: "range",
			min: "1",
			max: "10",
			value: settings.moveSpeed,
			onChange: (value) => {
				settings.moveSpeed = value;
			},
			placeholder: "Скорость перемещения шаров",
			name: "moveSpeed",
		},
		{
			type: "range",
			min: "1",
			max: "20",
			value: settings.size,
			onChange: (value) => {
				settings.size = value;
			},
			placeholder: "Максимальный размер шаров",
			name: "size",
		},
		{
			type: "range",
			min: "1",
			max: "200",
			value: settings.maxDistance,
			onChange: (value) => {
				settings.maxDistance = value;
			},
			placeholder: "Длина линии разрыва",
			name: "maxDistance",
		},
		{
			type: "range",
			min: "0.01",
			max: "0.1",
			step: "0.01",
			value: settings.decreaseSize,
			onChange: (value) => {
				settings.decreaseSize = value;
			},
			placeholder: "Скорость уменьшения шаров",
			name: "decreaseSize",
		},
		{
			type: "checkbox",
			value: "",
			checked: settings.generateAutomaticly,
			onChange: () => {
				settings.generateAutomaticly = !settings.generateAutomaticly;
			},
			placeholder: "Создавать автоматически",
			name: "generateAutomaticly",
		},
	],
	{
		helpText: [
			"Водите мышкой или кликайте",
			"Двойной клик что бы включить выключить настройки",
		],
	},
);

// maxDistance: 1,
// generateAutomaticly: true,
