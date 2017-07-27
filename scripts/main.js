setTimeout(function() { window.scrollTo(0, 1) }, 100);

var camera, scene, renderer, bufferTexture, planeScene, planeCamera;
var mesh, planeMesh;

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
	//
	window.addEventListener( 'resize', onWindowResize, false );

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
