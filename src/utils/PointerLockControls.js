import {
	Euler,
	EventDispatcher,
	Vector3
} from 'three';

const _euler = new Euler(0, 0, 0, 'YXZ');
const _vector = new Vector3();

const _PI_2 = Math.PI / 2;

class PointerLockControls extends EventDispatcher {

	constructor(camera, domElement) {
		super();
		this.camera = camera;
		this.domElement = domElement;
		this.isLocked = false;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveTop = false;
		this.moveBottom = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.shift = 1

		this.velocity = new Vector3();
		this.direction = new Vector3();
		this.prevTime = performance.now();
		this.minPolarAngle = 0; 
		this.maxPolarAngle = Math.PI; 

		this.pointerSpeed = 1.0;
		this._onMouseMove = onMouseMove.bind(this);
		this._contextmenu = onContextmenu.bind(this);
		this._onMouseUp = onMouseUp.bind(this);
		this._onKeyDown = onKeyDown.bind(this);
		this._onKeyUp = onKeyUp.bind(this);
		this._update = update.bind(this);
		this.connect();
	}

	connect() {
		this.domElement.ownerDocument.addEventListener('mousemove', this._onMouseMove);
		this.domElement.ownerDocument.addEventListener('contextmenu', this._contextmenu);
		this.domElement.ownerDocument.addEventListener('mouseup', this._onMouseUp);
		this.domElement.ownerDocument.addEventListener('keydown', this._onKeyDown);
		this.domElement.ownerDocument.addEventListener('keyup', this._onKeyUp);
	}

	disconnect() {
		this.domElement.ownerDocument.removeEventListener('mousemove', this._onMouseMove);
		this.domElement.ownerDocument.removeEventListener('contextmenu', this._contextmenu);
		this.domElement.ownerDocument.removeEventListener('mouseup', this._onMouseUp);
		this.domElement.ownerDocument.removeEventListener('keydown', this._onKeyDown);
		this.domElement.ownerDocument.removeEventListener('keyup', this._onKeyUp);
	}

	dispose() {
		this.disconnect();
	}

	forward(distance) {
		const camera = this.camera;
		_vector.setFromMatrixColumn(camera.matrix, 0);
		_vector.crossVectors(camera.up, _vector);
		camera.position.addScaledVector(_vector, distance);
	}

	right(distance) {
		const camera = this.camera;
		_vector.setFromMatrixColumn(camera.matrix, 0);
		camera.position.addScaledVector(_vector, distance);
	}
}

function onMouseMove(event) {
	if (this.isLocked === false) return;
	const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	const camera = this.camera;
	_euler.setFromQuaternion(camera.quaternion);
	_euler.y -= movementX * 0.002 * this.pointerSpeed;
	_euler.x -= movementY * 0.002 * this.pointerSpeed;
	_euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x));
	camera.quaternion.setFromEuler(_euler);
	this.dispatchEvent({ type: 'change' });
}

function onKeyDown(event) {
	if (!this.isLocked) return

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			this.moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			this.moveLeft = true;
			break;

		case 'KeyQ':
			this.moveTop = true;
			// this.moveBottom = true;
			break;

		case 'KeyE':
			// this.moveTop = true;
			this.moveBottom = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			this.moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			this.moveRight = true;
			break;

		case 'ShiftLeft':
		case 'ShiftRight':
			this.shift = 5;
			break;
	}
}

function onKeyUp(event) {
	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			this.moveForward = false;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			this.moveLeft = false;
			break;

		case 'KeyQ':
			this.moveTop = false;
			// this.moveBottom = false;
			break;
		
		case 'KeyE':
			// this.moveTop = false;
			this.moveBottom = false;
			break;
		
		case 'ArrowDown':
		case 'KeyS':
			this.moveBackward = false;
			break;

		case 'ArrowRight':
		case 'KeyD':
			this.moveRight = false;
			break;
		case 'ShiftLeft':
		case 'ShiftRight':
			this.shift = 1;
			break;
	}
}

function onContextmenu(event) {
	event.preventDefault();
	if (event.ctrlKey && event.button === 0) return
	if (!this.isLocked) {
		this.domElement.requestPointerLock = this.domElement.requestPointerLock || this.domElement.mozRequestPointerLock || this.domElement.webkitRequestPointerLock;
		console.log(this.domElement.requestPointerLock);
		if (this.domElement.requestPointerLock) {
			this.domElement.requestPointerLock();
			this.isLocked = true;
		} else {

		}
	}
	console.log('右键按下');
}

function onMouseUp(event) {
	if (event.button === 2) {
		console.log('右抬起');
		this.isLocked = false;
		this.domElement.ownerDocument.exitPointerLock();
	}
}

function update() {
	const time = performance.now();
	if (this.isLocked === true) {
		const delta = (time - this.prevTime) / 1000;
		this.velocity.x -= this.velocity.x * 10 * delta;
		this.velocity.y -= this.velocity.y * 10 * delta;
		this.velocity.z -= this.velocity.z * 10 * delta;
		this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
		this.direction.y = Number(this.moveTop) - Number(this.moveBottom);
		this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
		if (this.direction.z) this.velocity.z -= this.direction.z * 2 * delta * this.shift;
		if (this.direction.x) this.velocity.x -= this.direction.x * 2 * delta * this.shift;
		if (this.direction.y) this.velocity.y -= this.direction.y * 2 * delta * this.shift;

		this.right(- this.velocity.x);
		this.forward(- this.velocity.z);
		this.camera.position.y += this.velocity.y
	}
	this.prevTime = time;
}
export { PointerLockControls };
