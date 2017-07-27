setTimeout(function() { window.scrollTo(0, 1) }, 100);

var camera, scene, renderer, bufferTexture, planeScene, planeCamera;
var mesh, planeMesh;
var lastx, lasty;

init();
animate();

function init()
{
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
  scene = new THREE.Scene();
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var texture = new THREE.TextureLoader().load( 'images/rock.jpg');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  var material = new THREE.MeshBasicMaterial({map: texture});
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

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
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = "viewport";
	document.body.appendChild( renderer.domElement );
  document.ontouchmove = function(e){
    e.preventDefault();
  }
  document.ontouchstart = function(e){
    e.preventDefault();
  }
	//
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'touchmove', onTouchMove, false );
	window.addEventListener( 'touchstart', onTouchStart, false );

}

function onMouseMove(event)
{
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		camera.rotation.y -= movementX * 0.002;
		camera.rotation.x -= movementY * 0.002;
}

function onTouchMove(e)
{
  e.preventDefault();

  var touchobj = e.changedTouches[0] // reference first touch point for this event
  var x = parseInt(touchobj.clientX);
  var y = parseInt(touchobj.clienty);
  var dx = x - lastx;
  var dy = y - lasty;

	camera.rotation.y -= dx * 0.002;
	camera.rotation.x -= dy * 0.002;

  lastx = x;
  lasty = y;
}

function onTouchStart(e)
{
  e.preventDefault();
}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;
  renderer.render(scene, camera, bufferTexture);
	renderer.render(planeScene, planeCamera);
}
