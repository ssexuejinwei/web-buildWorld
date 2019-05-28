/*
    该脚本用于初始化场景中需要用到的控制器(改变物体，场景变化等),摄像机，渲染器等
    场景Gui的控制面板初始化操作绑定
    基平面切换和构建，天空包围盒的切换和构建
    以及保存，导入，渲染整个场景
 */
var sceneUrl ="scene/scene.json";
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//detector是一个探测器，引用了detector.js，用来探测webgl的支持情况

var container,voxel;
var camera, scene, renderer;
var plane;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial,rollOverGeo;
var cubeGeo, cubeMaterial;
var orbitControl,rotcontrols,transformControls,scaleControl;
var objects = [];
var addobjects = [];
var LevelDefine = [0,9000000,10000000];
init();

//初始化
function init(){

    container = document.createElement( 'div' );//使用createElement创建一个div，就是整个页面
    document.body.appendChild( container );//添加子节点

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );//设置透视投影的相机
    camera.position.set( 500, 100, 1300 );//设置相机坐标
    camera.lookAt( new THREE.Vector3() );//设置视野的中心坐标

    scene = new THREE.Scene();//设置场景,场景是一个三维空间，用Scene类声明一个对象scene

    raycaster = new THREE.Raycaster();//创建光线
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry( 5000, 5000 );//创建用于放置其他对象的超大平面
    geometry.rotateX( - Math.PI / 2 );
    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );
    objects.push( plane );
    // 创建环境光为灰色
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );
    //创建平行光为白色
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    preModel();//预加载模型和贴图
    loadGround('default');
    loadSky('default');//构建天空包围盒
    initGui();//初始用于选择操作的控制面版

    renderer = new THREE.WebGLRenderer( { antialias: true} );//生成渲染器对象，锯齿效果为true
    renderer.setClearColor( 0xE0FFFF );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //与场景交互的轨道控制器
    orbitControl = new THREE.OrbitControls( camera, renderer.domElement );

    //物体对象的控制器
    rotcontrols = new THREE.TransformControls(camera,renderer.domElement);
    rotcontrols.addEventListener( 'change', render );
    rotcontrols.setMode("rotate");
    scene.add(rotcontrols);

    // transformControls = new THREE.TransformControls(camera,renderer.domElement);
    // transformControls.addEventListener( 'change', render );
    // transformControls.setMode("translate");
    // scene.add(transformControls);
    //
    // scaleControl = new THREE.TransformControls(camera,renderer.domElement);
    // scaleControl.addEventListener( 'change', render );
    // scaleControl.setMode("scale");
    // scene.add(scaleControl);

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );//鼠标移动事件
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );//鼠标点击事件
    document.addEventListener( 'keydown', onDocumentKeyDown, false );//对shift按键的控制
    document.addEventListener( 'keyup', onDocumentKeyUp, false );//对shift按键的控制
    window.addEventListener( 'resize', onWindowResize, false );//窗口改变事件
    render();//渲染
}

/*
    渲染基平面
 */
var Ground;
function loadGround(ground) {
    //add ground
    scene.remove(Ground);
    if(ground == 'default') {
        var texture2 = grassImg;
        randomGrass();
        river();
    }
    else if(ground == 'desert'){
        var texture2 = sandImg;
        randomDesert();
    }
    else if(ground == 'polar'){
        var texture2 = snowImg;
        randomPolar();
    }
    else if(ground == 'outdoor'){
        var texture2 = clayImg;
        randomOutdoor();
    }
    else if(ground == 'valley' || ground == 'grass'){
        var texture2 = grassImg;
        if(ground == 'valley')
            randomValley();
    }
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(50,50);
    if(ground != 'grass') {
        var newplane = new THREE.PlaneGeometry(5000, 5000);
    }
    else{
        var newplane = new THREE.PlaneGeometry(10000, 10000);
        scene.remove(plane);
        var geometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
        geometry.rotateX( - Math.PI / 2 );
        plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        scene.add( plane );
    }
    newplane.rotateX(-Math.PI/2);
    Ground = new THREE.Mesh(newplane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
    scene.add(Ground);
}

/*
    渲染天空包围盒子
 */
var skyBox;
function loadSky(sky) {
    scene.remove(skyBox);
    if(sky == 'desert') {
        var path = "textures/skybox/";//设置路径
        var directions = ["px", "nx", "py", "ny", "pz", "nz"];//获取对象
        var format = ".jpg";//格式
        var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    }
    else if(sky == 'default'){
        var path = "textures/skybox/";//设置路径
        var directions = ["riverside_west","riverside_east",  "riverside_up", "riverside_down" ,"riverside_south","riverside_north" ];//获取对象
        var format = ".BMP";//格式
        var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    }
    else if(sky == 'polar'){
        var path = "textures/skybox/";//设置路径
        var directions = ["posx" ,"negx",  "posy", "negy", "posz","negz"];//获取对象
        var format = ".jpg";//格式
        var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    }
    else if(sky == 'outdoor'){
        var path = "textures/skybox/";//设置路径
        var directions = [ "outposx" ,"outnegx", "outposy", "outnegy", "outposz","outnegz"];//获取对象
        var format = ".jpg";//格式
        var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    }
    else if(sky == 'valley'){
        var path = "textures/skybox/";//设置路径
        var directions =["lostvalley_west","lostvalley_east",  "lostvalley_up", "lostvalley_down" ,"lostvalley_south","lostvalley_north" ];
        var format = ".png";//格式
        var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    }
    else{
        var path = "textures/skybox/";//设置路径
        var directions =["lostvalley_west","lostvalley_east",  "lostvalley_up", "lostvalley_down" ,"lostvalley_south","lostvalley_north" ];
        var format = ".png";//格式
        var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
    }
    //设置盒子材质
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( path + directions[i] + format ),//将图片纹理贴上
            side: THREE.BackSide/*镜像翻转，如果设置镜像翻转，那么只会看到黑漆漆的一片，因为你身处在盒子的内部，所以一定要设置镜像翻转。*/
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    skyBox = new THREE.Mesh( skyGeometry, skyMaterial );//创建一个完整的天空盒，填入几何模型和材质的参数
    skyBox.position.y = 1000;
    scene.add( skyBox );
}


/*
    游戏控制面板的参数
 */
var optimize = false;
function initGui(){

    //立方体对象的控制面板
    var cubecontrols = new function (){
        this.brick = function (){
            cubeBuild('brick');

        };
        this.nether_brick = function (){
            cubeBuild('nether_brick');
        };
        this.bookshelf = function (){
            cubeBuild('bookshelf');
        };
        this.normal = function (){
            cubeBuild('normal');
        };
        this.mycelium = function (){
            cubeBuild('mycelium');
        };
        this.obsidian = function (){
            cubeBuild('obsidian');
        };
        this.netherrack = function (){
            cubeBuild('netherrack');
        };
        this.stonewall = function (){
            cubeBuild('stonewall');
        };
        this.mossywall = function (){
            cubeBuild('mossywall');
        };
        this.endstone = function (){
            cubeBuild('endstone');
        };
        this.gravel = function (){
            cubeBuild('gravel');
        };
        this.dessert = function (){
            cubeBuild('dessert');
        };
        this.sand_stone = function (){
            cubeBuild('sand_stone');
        };
        this.granite = function (){
            cubeBuild('granite');
        };
        this.dirt = function (){
            cubeBuild('dirt');
        };
        this.ice = function (){
            cubeBuild('ice');
        };
        this.hay = function (){
            cubeBuild('hay');
        };
        this.hardened_clay = function (){
            cubeBuild('hardened_clay');
        };

    };


    //岩石物体的控制面板
    var colorcubecontrols = new function (){
        this.hardened_clay_stained_black = function (){
            cubeBuild('hardened_clay_stained_black');
        };
        this.hardened_clay_stained_blue = function (){
            cubeBuild('hardened_clay_stained_blue');
        };
        this.hardened_clay_stained_brown = function (){
            cubeBuild('hardened_clay_stained_brown');
        };
        this.hardened_clay_stained_cyan = function (){
            cubeBuild('hardened_clay_stained_cyan');
        };
        this.hardened_clay_stained_gray = function (){
            cubeBuild('hardened_clay_stained_gray');
        };
        this.hardened_clay_stained_green = function (){
            cubeBuild('hardened_clay_stained_green');
        };
        this.hardened_clay_stained_light_blue = function (){
            cubeBuild('hardened_clay_stained_light_blue');
        };
        this.hardened_clay_stained_lime = function (){
            cubeBuild('hardened_clay_stained_lime');
        };
        this.hardened_clay_stained_orange = function (){
            cubeBuild('hardened_clay_stained_orange');
        };
        this.hardened_clay_stained_pink = function (){
            cubeBuild('hardened_clay_stained_pink');
        };
        this.hardened_clay_stained_purple = function (){
            cubeBuild('hardened_clay_stained_purple');
        };
        this.hardened_clay_stained_white = function (){
            cubeBuild('hardened_clay_stained_white');
        };
        this.hardened_clay_stained_yellow = function (){
            cubeBuild('hardened_clay_stained_yellow');
        };
        this.hardened_clay_stained_silver = function (){
            cubeBuild('hardened_clay_stained_silver');
        };
        this.hardened_clay_stained_red = function (){
            cubeBuild('hardened_clay_stained_red');
        };
    };

    //平地的控制面板
    var planecontrols = new function (){
        this.cobblestone = function (){
            planeBuild('cobblestone');
        };
        this.water = function (){
            planeBuild('water');
        };
        this.woodfloor = function (){
            planeBuild('woodfloor');
        };
        this.grass = function (){
            planeBuild('grass');
        };
        this.farmland_dry = function (){
            planeBuild('farmland_dry');
        };
        this.farmland_wet = function (){
            planeBuild('farmland_wet');
        };
        this.red_sand = function (){
            planeBuild('red_sand');
        };
        this.sand = function (){
            planeBuild('sand');
        };
        this.snow = function (){
            planeBuild('snow');
        };
        this.clay = function (){
            planeBuild('clay');
        };
    };

    //树模型和蛋糕模型的控制面板
    var modelcontrols = new function (){
        this.tree1 = function (){
            loadModel('tree1')
        };
        this.tree2 = function (){
            loadModel('tree2')
        };
        this.tree3 = function (){
            loadModel('tree3')
        };
        this.tree4 = function (){
            loadModel('tree4')
        };
        this.cake = function (){
            cylinderBuild('cake')
        };
    };

    //窗户和们模型的控制面板
    var upplanecontrols = new function (){
        this.daywindow = function (){
            upplaneBuild('daywindow')
        };
        this.irondoor = function (){
            upplaneBuild('irondoor')
        };
    };

    //场景切换的控制面板,加载基平面和天空包围盒
    var scenecontrols = new function (){
        this.optimize = false;

        this.exportScene = function () {
            // localStorage.clear();
            // var sceneJson = JSON.stringify(scene.toJSON());
            // localStorage.setItem('scene', sceneJson);
            var sceneJson = JSON.stringify(scene.toJSON());
            var blob = new Blob([JSON.stringify(sceneJson)], { type: "" });
            saveAs(blob, "scene.json");
            alert("导出场景成功");
        };
        this.importScene = function () {
            $.ajax({
                type: 'GET',
                url: sceneUrl,
                async: false,
                success: function (data) {
                    if(data){
                        // scene.remove.apply(scene, scene.children);
                        var loadedGeometry = JSON.parse(data);
                        var loader = new THREE.ObjectLoader();

                        scene = loader.parse(loadedGeometry);
                        alert("加载场景成功");
                    }
                }
            });

            // var json = localStorage.getItem("scene");
            //
            // if (json) {
            //     var loadedGeometry = JSON.parse(json);
            //     var loader = new THREE.ObjectLoader();
            //
            //     scene = loader.parse(loadedGeometry);
            // }
        };
        this.delete = function (){
            for(var i=0 ; i <objects.length;i++){
                scene.remove(addobjects[i]);
            }
            addobjects = [];
        };
        this.defaultScene = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('default');
            loadSky('default');
        };
        this.desert = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('desert');
            loadSky('desert');
        };
        this.polar = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('polar');
            loadSky('polar');
        };
        this.outdoor = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('outdoor');
            loadSky('outdoor');
        };
        this.valley = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('valley');
            loadSky('valley');
        };
        this.grass = function () {
            for(var i=0 ; i <objects.length;i++){
                scene.remove(objects[i]);
            }
            objects = [];
            objects.push(plane);
            loadGround('grass');
            loadSky('dd');
        }
    };

    // 添加物体的控制
    var modelControls = new function () {
        this.bindModel = function () {
            unBindMouse = false;
        };
        this.unblindModel =function () {
             unblind();
        };
        this.direction = function (){
            direction()
        };
        this.scale =function () {
            scale();
        };
        this.translate =function () {
            position();
        }
    };
    var gui = new dat.GUI();

    var modelcontrolFolder = gui.addFolder( '物体控制' );
    var sceneFolder = gui.addFolder( '场景控制' );
    var upplaneFolder = gui.addFolder( '窗户和门' );
    var modelFolder = gui.addFolder( '树和蛋糕' );
    var planeFolder = gui.addFolder('地表');
    var colorFolder = gui.addFolder('多色岩石');
    var cubeFolder = gui.addFolder('立方体模型');

    //添加物体控制
    modelcontrolFolder.add(modelControls, 'direction', false).name("旋转");
    modelcontrolFolder.add(modelControls, "scale").name("缩放");
    modelcontrolFolder.add(modelControls, "translate").name("平移");
    modelcontrolFolder.add(modelControls, "unblindModel").name("解绑物体");
    modelcontrolFolder.add(modelControls, "bindModel").name("绑定物体");

    //添加场景控制
    sceneFolder.add(scenecontrols, 'optimize', false).name("开启渲染优化").onChange(changeOpti );
    sceneFolder.add(scenecontrols, "exportScene").name("导出场景");
    sceneFolder.add(scenecontrols, "importScene").name("导入场景");
    sceneFolder.add(scenecontrols, "delete").name("清空画面");
    sceneFolder.add(scenecontrols, "defaultScene").name("默认场景");
    sceneFolder.add(scenecontrols, "desert").name("沙漠");
    sceneFolder.add(scenecontrols, "polar").name("极地");
    sceneFolder.add(scenecontrols, "outdoor").name("户外");
    sceneFolder.add(scenecontrols, "valley").name("山谷");
    sceneFolder.add(scenecontrols, "grass").name("草原");

    upplaneFolder.add(upplanecontrols, "daywindow").name("窗户");
    upplaneFolder.add(upplanecontrols, "irondoor").name("门");

    modelFolder.add(modelcontrols,"cake").name("蛋糕");
    modelFolder.add(modelcontrols,"tree1").name("第一种树");
    modelFolder.add(modelcontrols,"tree2").name("第二种树");
    modelFolder.add(modelcontrols,"tree3").name("第三种树");
    modelFolder.add(modelcontrols,"tree4").name("第四种树");

    planeFolder.add(planecontrols, 'cobblestone').name("石面");
    planeFolder.add(planecontrols, 'water').name("水");
    planeFolder.add(planecontrols, 'woodfloor').name("木地板");
    planeFolder.add(planecontrols, 'grass').name("草地");
    planeFolder.add(planecontrols, 'farmland_dry').name("耕地");
    planeFolder.add(planecontrols, 'farmland_wet').name("黑土");
    planeFolder.add(planecontrols, 'red_sand').name("红沙");
    planeFolder.add(planecontrols, 'sand').name("沙地");
    planeFolder.add(planecontrols, 'snow').name("雪地");
    planeFolder.add(planecontrols, 'clay').name("黏土");

    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_black').name("岩石(黑色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_blue').name("岩石(蓝色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_brown').name("岩石(棕色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_cyan').name("岩石(蓝绿色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_gray').name("岩石(灰色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_green').name("岩石(绿色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_light_blue').name("岩石(淡蓝色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_lime').name("岩石(亮绿色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_orange').name("岩石(橘色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_pink').name("岩石(粉色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_purple').name("岩石(紫色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_red').name("岩石(红色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_white').name("岩石(白色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_yellow').name("岩石(黄色)");
    colorFolder.add(colorcubecontrols, 'hardened_clay_stained_silver').name("岩石(银色)");

    cubeFolder.add(cubecontrols,'brick').name("砖墙");
    cubeFolder.add(cubecontrols,'nether_brick').name("旧砖墙");
    cubeFolder.add(cubecontrols,'bookshelf').name("书架");
    cubeFolder.add(cubecontrols,'normal').name("岩石(有植被)");
    cubeFolder.add(cubecontrols,'mycelium').name("岩石(真菌覆盖)");
    cubeFolder.add(cubecontrols,'obsidian').name("黑曜石");
    cubeFolder.add(cubecontrols,'netherrack').name("地狱石");
    cubeFolder.add(cubecontrols,'stonewall').name("石墙");
    cubeFolder.add(cubecontrols,'mossywall').name("苔藓墙");
    cubeFolder.add(cubecontrols,'endstone').name("白石");
    cubeFolder.add(cubecontrols,'gravel').name("砾石");
    cubeFolder.add(cubecontrols,'dessert').name("黄石");
    cubeFolder.add(cubecontrols,'sand_stone').name("沙石");
    cubeFolder.add(cubecontrols,'granite').name("花岗岩");
    cubeFolder.add(cubecontrols,'dirt').name("岩层");
    cubeFolder.add(cubecontrols,'ice').name("冰块");
    cubeFolder.add(cubecontrols,'hay').name("干草堆");
    cubeFolder.add(cubecontrols,'hardened_clay').name("硬化黏土");

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
function changeOpti(){
    if(optimize == true) {
        optimize = false;
        for(var i = 0 ;i <objects.length;i++){
            objects[i].visible = true;
        }
    }
    else
        optimize = true;
}
/*
    根据光线相交，获取点击物体的属性
 */
function onDocumentMouseMove( event ) {
    event.preventDefault();//取消事件的默认动作
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
    render();
}
var changeDirection = false;
var changePosition = false;
var changeScale = false;
var unBindMouse = false;
function direction(){
    changeDirection = true;
}
function position() {
    changePosition = true;
}
function scale() {
    changeScale = true;
}
function unblind(){
    mouseFollow();
    unBindMouse = true;
}
var selected;
function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        // delete cube
        if ( isShiftDown ) {
            if ( intersect.object != plane ) {
                scene.remove( intersect.object );
                objects.splice( objects.indexOf( intersect.object ), 1 );
            }
            // create cube
        }
        else if(changeDirection) {
            if ( intersect.object != plane ) {
                for (var i = objects.length - 1; i >= 0; i--)
                    if (intersects[0].object == objects[i]) {
                        selected = objects[i];
                        rotcontrols.setMode('rotate');
                        rotcontrols.attach(selected);
                    }
            }
            else{
                rotcontrols.detach(selected);
            }
            changeDirection = false;
        }
        else if(changePosition){
            if ( intersect.object != plane ) {
                for (var i = objects.length - 1; i >= 0; i--)
                    if (intersects[0].object == objects[i]) {
                        selected = objects[i];
                        rotcontrols.setMode('translate');
                        rotcontrols.attach(selected);
                    }
            }
            else{
                rotcontrols.detach(selected);
            }
            changePosition = false;
        }
        else if(changeScale){
            if ( intersect.object != plane ) {
                for (var i = objects.length - 1; i >= 0; i--)
                    if (intersects[0].object == objects[i]) {
                        selected = objects[i];
                        rotcontrols.setMode('scale')
                        rotcontrols.attach(selected);
                    }
            }
            else{
                rotcontrols.detach(selected);
            }
            changeScale = false;
        }
        else if (unBindMouse) {
            // unBindMouse = false;
        }
        else {
            if(cubeGeo.type != "BufferGeometry" ) {
                voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                if(cubeGeo.type == "PlaneBufferGeometry")
                    voxel.position.y=3;
            }
            else{
                voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50);
                voxel.scale.set(50,50,50);
            }
            scene.add(voxel);
            objects.push(voxel);
            addobjects.push(voxel);
        }
        render();
    }
}

function onDocumentKeyDown( event ) {
    switch( event.keyCode ) {
        case 16: isShiftDown = true; break;
    }
}
function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; break;
        case 68: unblind(); break;
    }
}

//优化渲染速度
function elimination(){
    //想法是 遮挡的物体 不进行渲染
    var cameraMatrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    for(var j=0,jl=objects.length;j<jl;j++) {
        var point = new THREE.Vector3(objects[j].position.x,objects[j].position.y,objects[j].position.z);
        var z = point.applyMatrix4(cameraMatrix).z;
        var dist = objects[j].position.clone();
        dist.sub(camera.position);
        dist = dist.x * dist.x + dist.y * dist.y + dist.z * dist.z ;
        var le = 0;
        for (var i = 0, il = LevelDefine.length; i < il; i++) {
            if (dist > LevelDefine[i])le++;
            else break;
        }
        objects[j].visible = (j % le == 0);
        if(objects[j].visible == true)
            objects[j].visible = z <= 1;
    }
}

//渲染场景主函数
function render() {
    if(optimize == true)
        elimination();
    orbitControl.update();
    renderer.clear();
    renderer.render( scene, camera );

}
