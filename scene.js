/*
    该脚本用于基平面上随机对象的生成
 */
function randomGrass(){
    var x = -50, z = -50, y = 0;
    var normalrock = new NormalRock();
    normalrock.init();
    normalrock.instance(x*50+25,y*50+25,z*50+25);
    scene.add(normalrock.mesh);
    objects.push(normalrock.mesh);
    for(var i = 0 ; i <4000 ; i++){
        var mesh = normalrock.mesh.clone();
        var random = Math.floor(Math.random() * 3 + 1);
        x+=random;
        if(x >  48 -y){
            z++;
            if(z > -33 -y){
                x = y+1 - 50;z = y+1 - 50; y++;
            }
            else{
                x = y + random - 50;
            }
        }
        mesh.position.set(x*50+25,y*50+25,z*50+25);
        scene.add(mesh);
        objects.push(mesh);
    }
}
function randomDesert(){
    var geo = new THREE.BoxBufferGeometry(50,50,50);
    var material1 = new THREE.MeshPhongMaterial( {
        map: sand_stoneImg } );
    var material2 = new THREE.MeshPhongMaterial( {
        map: sandstone_bottomImg } );
    var material3 = new THREE.MeshPhongMaterial( {
        map: sandstone_topImg } );
    var material4 = new THREE.MeshPhongMaterial( {
        map: sand_stonenormalImg} );
    var materials = [material4, material4, material3, material2,material1,material4];
    var material = new THREE.MeshFaceMaterial(materials);
    var sandstone = new THREE.Mesh(geo,material);

    var redsandgeo = new THREE.BoxGeometry(50,50,50);
    var redsandmaterial = new THREE.MeshPhongMaterial({map:dessertImg});
    var redsand = new THREE.Mesh(redsandgeo,redsandmaterial);
    var pyramidgeo = new THREE.Geometry();
    var x = 0, z = -48, y = 0;
    for(var i = 0 ; i <18400 ; i++){
        var mesh = redsand.clone();
        x++;
        if(x >  48 -y){
            z++;
            if(z > -3 -y){
                x = y+ 2;z = y+1 - 48; y++;
            }
            else{
                x = y + 1;
            }
        }
        mesh.position.set(x*50+25,y*50+25,z*50+25);
        mesh.updateMatrix();
        pyramidgeo.merge(mesh.geometry,mesh.matrix);
    }
    var pyramid = new THREE.Mesh(pyramidgeo,redsandmaterial);
    scene.add(pyramid);
    objects.push(pyramid);

    for(var j = 0 ; j <50 ; j++){
        x = -51; z = -50; y = 0;
        var sandpile = [];
        for(var i = 0 ; i <15 ; i++){
            var mesh = sandstone.clone();
            var random = Math.floor(Math.random() * 3 + 1);
            x+=random;
            if(x >  -45 -y){
                z++;
                if(z > -45 -y){
                    x = y+1 - 50;z = y+1 - 50; y++;
                }
                else{
                    x = y +random  - 50;
                }
            }
            mesh.position.set(x*50+25,y*50+25,z*50+25);
            sandpile.push(mesh);
            objects.push(mesh);
        }
        x = Math.floor(Math.random() * 40 + 1) * 50;
        z = Math.floor(Math.random() * 60 + 1) * 50;
        for(var i = 0 ;i<sandpile.length;i++){
            sandpile[i].position.x += x;
            sandpile[i].position.z += z;
            scene.add(sandpile[i]);
        }
    }
    var desertgeo = new THREE.PlaneBufferGeometry( 50,  50 );
    desertgeo.rotateX(-Math.PI/2);
    var desertmaterial = new THREE.MeshLambertMaterial( {  map: grassImg } );
    var desertmesh = new THREE.Mesh(desertgeo,desertmaterial);
    x = 50;z=49;
    for(var i=0;i<1000;i++) {
        var clone = desertmesh.clone();
        clone.position.set(x * 50 , 1, z * 50 + 25);
        x--;
        if(x==10){x=50;z--;}
        scene.add(clone);
        objects.push(clone);
    }
    var rivergeo = new THREE.PlaneBufferGeometry( 50,  50 );
    rivergeo.rotateX(-Math.PI/2);
    var rivermaterial = new THREE.MeshLambertMaterial( {  map: waterImg } );
    var rivermesh = new THREE.Mesh(rivergeo,rivermaterial);
    x = -50;z=20;
    for(var i=0;i<400;i++) {
        var clone = rivermesh.clone();
        clone.position.set(x * 50 + 25, 3, z * 50 + 25);
        x++;
        if(x==50){x=-50;z++;}
        scene.add(clone);
        objects.push(clone);
    }
}
function randomPolar(){
    var geo = new THREE.BoxBufferGeometry(50,50,50);
    var material1 = new THREE.MeshPhongMaterial( {
        map: mycelium_sideImg } );
    var material2 = new THREE.MeshPhongMaterial( {
        map: mycelium_topImg } );
    var materials = [material1, material1, material2, material2,material1,material1];
    var sandstone = new THREE.Mesh(geo,materials);
    for(var j = 0 ; j <50 ; j++){
        var x = -51, z = -50, y = 0;
        var sandpile = [];
        for(var i = 0 ; i <30 ; i++){
            var mesh = sandstone.clone();
            var random = Math.floor(Math.random() * 3 + 1);
            x+=random;
            if(x >  -40 -y){
                z++;
                if(z > -40 -y){
                    x = y+1 - 50;z = y+1 - 50; y++;
                }
                else{
                    x = y +random  - 50;
                }
            }
            mesh.position.set(x*50+25,y*50+25,z*50+25);
            sandpile.push(mesh);
            objects.push(mesh);
        }
        x = Math.floor(Math.random() * 80 + 1) * 50;
        z = Math.floor(Math.random() * 80 + 1) * 50;
        for(var i = 0 ;i<sandpile.length;i++){
            sandpile[i].position.x += x;
            sandpile[i].position.z += z;
            scene.add(sandpile[i]);
        }
    }
}
function randomOutdoor(){
    river();
    var geo = new THREE.PlaneBufferGeometry( 50,  50 );
    geo.rotateX(-Math.PI/2);
    var material = new THREE.MeshLambertMaterial( {  map: farmland_dryImg } );
    var mesh = new THREE.Mesh(geo,material);
    var x = -47,z=-45;
    var length = -32;
    var originx = -47;
    for(var j = 0;j<5;j++) {
        for (var i = 0; i < 300; i++) {
            var clone = mesh.clone();
            clone.position.set(x * 50 + 25, 3, z * 50 + 25);
            x++;
            if (x == length) {
                x = originx;
                z++;
            }
            scene.add(clone);
            objects.push(clone);
        }
        x+=20;z=-45;length+=20;
        originx = originx + 20;
    }
    var stonegeo = new THREE.BoxBufferGeometry(50,50,50);
    var stonematerial = new THREE.MeshPhongMaterial( {
        map: stonewallImg } );
    var stone = new THREE.Mesh(stonegeo,stonematerial);
    x = -50;z=-23;
    for(var i = 0 ;i <100;i++,x++){
        var clone = stone.clone();
        clone.position.set(x * 50 + 25, 25, z * 50 + 25);
        scene.add(clone);
        objects.push(clone);
    }

}
function randomValley(){
    var x = -50, z = -50, y = 0;
    var geo = new THREE.BoxBufferGeometry(50,50,50);
    var material = new THREE.MeshPhongMaterial( {
        map: mossywallImg } );
    var sandstone = new THREE.Mesh(geo,material);
    for(var i = 0 ; i <2000 ; i++){
        var mesh = sandstone.clone();
        var random = Math.floor(Math.random() * 5 + 1);
        x+=random;
        if(x >  48 -y){
            z++;
            if(z > -35 -y){
                x = y+1 - 50;z = y+1 - 50; y++;
            }
            else{
                x = y + random - 50;
            }
        }
        mesh.position.set(x*50+25,y*50+25,z*50+25);
        scene.add(mesh);
        objects.push(mesh);
    }
    x = -50;z=49;y=0;
    for(var i = 0 ; i <2000 ; i++){
        var mesh = sandstone.clone();
        var random = Math.floor(Math.random() * 5 + 1);
        x+=random;
        if(x >  48 -y){
            z--;
            if(z < 35 + y){
                x = y+1 - 50;z = -y - 1 + 50; y++;
            }
            else{
                x = y + random - 50;
            }
        }
        mesh.position.set(x*50+25,y*50+25,z*50+25);
        scene.add(mesh);
        objects.push(mesh);
    }
    x = -50;z=49;y=0;
    for(var i = 0 ; i <2000 ; i++){
        var mesh = sandstone.clone();
        var random = Math.floor(Math.random() * 5 + 1);
        x+=random;
        if(x >  48 -y){
            z--;
            if(z < 35 + y){
                x = y+1 - 50;z = -y - 1 + 50; y++;
            }
            else{
                x = y + random - 50;
            }
        }
        mesh.position.set(z*50+25,y*50+25,x*50+25);
        scene.add(mesh);
        objects.push(mesh);
    }
    x = -50; z = -50; y = 0;
    for(var i = 0 ; i <2000 ; i++){
        var mesh = sandstone.clone();
        var random = Math.floor(Math.random() * 5 + 1);
        x+=random;
        if(x >  48 -y){
            z++;
            if(z > -35 -y){
                x = y+1 - 50;z = y+1 - 50; y++;
            }
            else{
                x = y + random - 50;
            }
        }
        mesh.position.set(z*50+25,y*50+25,x*50+25);
        scene.add(mesh);
        objects.push(mesh);
    }
}
function river(){
    var geo = new THREE.PlaneBufferGeometry( 50,  50 );
    geo.rotateX(-Math.PI/2);
    var material = new THREE.MeshLambertMaterial( {  map: waterImg } );
    var mesh = new THREE.Mesh(geo,material);
    var x = -50,z=-20;
    for(var i=0;i<400;i++) {
        var clone = mesh.clone();
        clone.position.set(x * 50 + 25, 3, z * 50 + 25);
        x++;
        if(x==50){x=-50;z++;}
        scene.add(clone);
        objects.push(clone);
    }
    x =40;z=-16;
    for(var i=0;i<264;i++) {
        var clone = mesh.clone();
        clone.position.set(x * 50 + 25, 3, z * 50 + 25);
        x++;
        if(x==44){x=40;z++;}
        scene.add(clone);
        objects.push(clone);
    }
}
function NormalRock(){
    this.mesh = null;
}
NormalRock.prototype = {
    update:function () {
        this.mesh.visible = this.visible;
    },
    init:function () {

    },
    instance:function (x,y,z) {
        var mesh = initRock.clone();
        mesh.position.set(x,y,z);
        this.mesh = mesh;

    }
};
