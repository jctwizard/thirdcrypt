setTimeout(function() { window.scrollTo(0, 1) }, 100);

var camera, scene, renderer, bufferTexture, planeScene, planeCamera;
var planeMesh, enemyCube;
var lastx = null, lasty = null;
var keys = [];
var moveSpeed = 1, sprintSpeed = 3, enemyMoveSpeed = 0.5;
var lastTime = Date.now();

init();
animate();

function init()
{
	camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);

  scene = new THREE.Scene();

	var geometry = new THREE.BoxBufferGeometry(1, 2, 1);
  var texture = new THREE.TextureLoader().load('images/rock.jpg');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  var material = new THREE.MeshBasicMaterial({map: texture});

	blocks = {};

	var block = new THREE.Mesh(geometry, material)
	block.position.x = 2;
	scene.add(block);

	block = new THREE.Mesh(geometry, material)
	block.position.x = -2;
	scene.add(block);

	block = new THREE.Mesh(geometry, material)
	block.position.z = 2;
	scene.add(block);

	block = new THREE.Mesh(geometry, material)
	block.position.z = -2;
	scene.add(block);

	enemyCube = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25), new THREE.MeshBasicMaterial())
	scene.add(enemyCube);

  bufferTexture = new THREE.WebGLRenderTarget( 64, 64, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter});

  planeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
  planeCamera.position.z = 1;
  planeScene = new THREE.Scene();
  var plane = new THREE.PlaneGeometry(2, 2);
  var planeMaterial = new THREE.MeshBasicMaterial({map:bufferTexture})
  planeMesh = new THREE.Mesh(plane, planeMaterial);
  planeScene.add( planeMesh );

  // Create the texture that will store our result
  renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );

	if (window.innerWidth > window.innerHeight)
	{
		renderer.setSize(window.innerHeight, window.innerHeight);
	}
	else
	{
		renderer.setSize(window.innerWidth, window.innerWidth);
	}

  renderer.domElement.id = "viewport";
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('touchmove', onTouchMove, false);
	window.addEventListener('touchstart', onTouchStart, false);
	window.addEventListener('touchend', onTouchEnd, false);
	window.addEventListener('touchcancel', onTouchEnd, false);
	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false);

	document.body.onclick = function() { document.body.requestPointerLock(); };
}

function onMouseMove(event)
{
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		camera.rotation.y -= movementX * 0.002;
}

function onTouchMove(e)
{
  e.preventDefault();

  var touchobj = e.changedTouches[0] // reference first touch point for this event
  var x = parseInt(touchobj.clientX);
  var y = parseInt(touchobj.clientY);

  if (lastx == null)
  {
    lastx = x;
    lasty = y;
  }

  var dx = x - lastx;
  var dy = y - lasty;

	camera.rotation.y -= dx * 0.02;
	camera.rotation.x -= dy * 0.02;

  //document.getElementById("debug").innerHTML = "x: " + x.toString() + ", y: " + y.toString() + ", dx: " + dx.toString() + ", dy: " + dy.toString();

  lastx = x;
  lasty = y;
}

function onTouchStart(e)
{
  var touchobj = e.changedTouches[0] // reference first touch point for this event
  lastx = parseInt(touchobj.clientX);
  lasty = parseInt(touchobj.clientY);

  e.preventDefault();
}

function onTouchEnd(e)
{
  var touchobj = e.changedTouches[0] // reference first touch point for this event
  lastx = null;
  lasty = null;

  e.preventDefault();
}

function onKeyDown(e)
{
	keys[e.keyCode] = true;
}

function onKeyUp(e)
{
	keys[e.keyCode] = false;
}

function onWindowResize()
{
	if (window.innerWidth > window.innerHeight)
	{
		renderer.setSize(window.innerHeight, window.innerHeight);
	}
	else
	{
		renderer.setSize(window.innerWidth, window.innerWidth);
	}
}

function animate()
{
	var nowTime = Date.now();
	var deltaTime = nowTime - lastTime;

	requestAnimationFrame(animate);

	var localForward = new THREE.Vector3(0, 0, -1);
	var worldForward = localForward.applyMatrix4(camera.matrixWorld);
	var cameraForward = worldForward.sub(camera.position).normalize();

	var localRight = new THREE.Vector3(1, 0, 0);
	var worldRight = localRight.applyMatrix4(camera.matrixWorld);
	var cameraRight = worldRight.sub(camera.position).normalize();

	var currentMoveSpeed = moveSpeed;

	if (keys["16"])
	{
		currentMoveSpeed = sprintSpeed;
	}

	// a
	if (keys["65"])
	{
		camera.position.x += cameraRight.x * -currentMoveSpeed * (deltaTime / 1000);
		camera.position.z += cameraRight.z * -currentMoveSpeed * (deltaTime / 1000);
	}

	// d
	if (keys["68"])
	{
		camera.position.x += cameraRight.x * currentMoveSpeed * (deltaTime / 1000);
		camera.position.z += cameraRight.z * currentMoveSpeed * (deltaTime / 1000);
	}

	// s
	if (keys["83"])
	{
		camera.position.x += cameraForward.x * -currentMoveSpeed * (deltaTime / 1000);
		camera.position.z += cameraForward.z * -currentMoveSpeed * (deltaTime / 1000);
	}

	// w
	if (keys["87"])
	{
		camera.position.x += cameraForward.x * currentMoveSpeed * (deltaTime / 1000);
		camera.position.z += cameraForward.z * currentMoveSpeed * (deltaTime / 1000);
	}

	enemyCube.position.x += (camera.position.x - enemyCube.position.x) * enemyMoveSpeed * (deltaTime / 1000);
	enemyCube.position.z += (camera.position.z - enemyCube.position.z) * enemyMoveSpeed * (deltaTime / 1000);

  renderer.render(scene, camera, bufferTexture);
	renderer.render(planeScene, planeCamera);

	lastTime = nowTime;
}
