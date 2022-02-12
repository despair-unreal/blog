import * as THREE from '../build/three.module.js';
import {
	GLTFLoader
} from '../jsm/GLTFLoader.js';
import {
	OrbitControls
} from '../jsm/OrbitControls.js';
import {
	EffectComposer
} from '../jsm/postprocessing/EffectComposer.js';
import {
	RenderPass
} from '../jsm/postprocessing/RenderPass.js';
import {
	ShaderPass
} from '../jsm/postprocessing/ShaderPass.js';
import {
	UnrealBloomPass
} from '../jsm/postprocessing/UnrealBloomPass.js';

//创建场景
var scene, camera, renderer; //场景 摄像机 渲染器
scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
//透视摄像机：fov 长宽比 近截面 远截面
camera = new THREE.PerspectiveCamera(30.00, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1.520, 0.363, 3.355);

//webGL渲染器
renderer = new THREE.WebGLRenderer({
	antialias: true
});
//像素比
renderer.setPixelRatio(window.devicePixelRatio);
//色调映射
renderer.toneMapping = THREE.ReinhardToneMapping;
//曝光度
renderer.toneMappingExposure = 2;
//物理光照
renderer.physicallyCorrectLights = true;
//设置渲染器的渲染范围
renderer.setSize(window.innerWidth, window.innerHeight);
//设置渲染器阴影
//renderer.shadowMap.enabled = true;
//把渲染器添加到div里面去
document.getElementById("container").appendChild(renderer.domElement);

//后期处理
//创建通道
//在指定的场景和相机的基础上渲染出一个新场景
const renderScene = new RenderPass(scene, camera);
//眩光通道-形成高亮虚幻的效果
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.renderToScreen = true;
bloomPass.threshold = 0;
bloomPass.strength = 0.35;
bloomPass.radius = 0;
//创建 效果组合器
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//renderer.autoClear = false;

//添加环境光
//半球光
const hemLight = new THREE.HemisphereLight(0x080820, 0xffeeb1, 0.7);
hemLight.position.set(0, 1.933, 0);
scene.add(hemLight);
//点光源
const pointLight = new THREE.PointLight(0xFF725C, 5, 100, 0.5);
pointLight.position.set(0.048, 0.225, 0.922);
//阴影
pointLight.castShadow = true;
pointLight.shadow.bias = -0.0001;
pointLight.shadow.mapSize.width = 10000;
pointLight.shadow.mapSize.height = 10000;
scene.add(pointLight);

/*//平面光
const directionalLight = new THREE.DirectionalLight( 0xFFC66B, 1);
directionalLight.add( fire );
directionalLight.castShadow = true;
scene.add( directionalLight );*/

var controls = new OrbitControls(camera, renderer.domElement);

//创建一个立方体
//创建一个立方体对象
/*const geometry = new THREE.BoxGeometry();
//材质
const material = new THREE.MeshBasicMaterial({color:0xffffff});
//增加一个网格，为这个网格添加几何体以及材质
const cube = new THREE.Mesh(geometry,material);
//把这个网格添加到场景里
scene.add(cube);*/

var mixers = [];
function modelLoading(){
	const loader = new GLTFLoader();
	loader.load('models/space_ame_camping_-_amelia_watson_hololive/scene.gltf', function(gltf) {
		var container = document.getElementById("container");
		$("#loading").animate({
			opacity:0
		},function(){
			container.style.opacity="1";
		});
		
		// 添加动画
		var mixer = new THREE.AnimationMixer(gltf.scene);
		mixer.clipAction(gltf.animations[0]).setDuration(8).play();
		mixers.push(mixer);
		
		//光
		var Icosphere_20 = gltf.scene.children[0].children[0].children[0].children[1];
		var fire = Icosphere_20.children[0];
		fire.material.opacity = 0.7;
		
		animate();
	
		scene.add(gltf.scene);
		//const bulbGeometry = Icosphere_20.children[0].geometry;
		/*var bulbMat = new THREE.MeshStandardMaterial( {
			emissive: 0xffffee,
			emissiveIntensity: 1,
			transparent:true,
			opacity:0.7
		} );
		var fire = new THREE.Mesh( bulbGeometry, bulbMat );
		fire.scale.set(0.1,0.1,0.1);
		fire.position.set( -0.352, 1.125, 0.726 );
		const pointLight = new THREE.PointLight( 0xffa95c, 5, 100, 1 );
		pointLight.position.set( -0.336, 0.082, 0.689 );
		//pointLight.add( fire );
		pointLight.castShadow = true;
		scene.add( pointLight );*/
	
		/*//接受阴影
		gltf.scene.traverse((n)=>{
			if(n.isMesh){
				n.castShadow = true;
				n.receiveShadow = true;
				if(n.material.map)
					n.material.map.anisotropy = 100;
			}
		});*/
	}, function(xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	}, function(error) {
		console.error(error);
	});
}


//把摄像机稍微向外推动
camera.position.z = 5;

var clock = new THREE.Clock();

function animate() {
	//循环调用animate函数
	requestAnimationFrame(animate);

	//使这个立方体旋转
	/*cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;*/

	// 重复播放动画
	var delta = clock.getDelta();
	for (var i = 0; i < mixers.length; i++) {
		mixers[i].update(delta);
	}
	//渲染
	controls.update();
	//renderer.render(scene, camera);
	bloomComposer.render();

}

export{
	modelLoading
}
