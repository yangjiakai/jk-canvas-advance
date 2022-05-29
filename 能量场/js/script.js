BABYLON.Effect.ShadersStore.fooVertexShader = `
precision highp float;

// Attributes
attribute vec3 position; // local space 
attribute vec4 color; // diffuse
attribute vec3 normal;  // use to calc lighting

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;

// Varying
varying vec4 vColor;
varying vec3 vPositionW;
varying vec3 vNormalW;

// 0. ... 0.99999999999999
float random (in float x) {
    return fract(sin(x)*(10000.0 + time * 0.001));
}

void main(void) {
    vec3 pos = position + normal * random(position.x + position.y + position.z);
    gl_Position = worldViewProjection * vec4(pos, 1.0);

    vColor = color;
    vPositionW = vec3(world * vec4(pos, 1.));
    vNormalW = normalize(vec3(world * vec4(normal, 1.)));
}`;

BABYLON.Effect.ShadersStore.fooFragmentShader = `
precision highp float;

varying vec4 vColor;
varying vec3 vPositionW;
varying vec3 vNormalW;

uniform mat4 world;
uniform vec3 light0pos;
uniform vec4 light0diffuse;

#define PI2 1.5707963267948966

void main(void) {
    vec3 lightDir = normalize(light0pos - vPositionW);
    float lightIntensity = pow(max(0.0, dot(vNormalW, lightDir)) / PI2, 1.0);
    gl_FragColor = (1.0 - lightIntensity) * vColor + lightIntensity * light0diffuse;
    gl_FragColor.a = vColor.a;
}
 `;

const engine = new BABYLON.Engine(elCanvas, true);
const scene = (() => {

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    //// mesh
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {
        diameter: 5,
        segments: 64,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    const normals = sphere.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    const colors = [];
    for (let i = 0; i < normals.length; i += 3) {
        colors.push(0, 0, Math.random(), 0.1);
    }
    sphere.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);

    //// material
    const mat1 = new BABYLON.ShaderMaterial('mat1', scene, { vertex: 'foo', fragment: 'foo' }, {
        attributes: ['position', 'normal', 'color'],
        uniforms: ['worldViewProjection', 'world']
    });
    mat1.alpha = 0.9;
    mat1.alphaMode = BABYLON.Engine.ALPHA_ADD;
    mat1.backFaceCulling = false;
    scene.registerBeforeRender(() => {
        mat1.setFloat('time', performance.now());
        mat1.setVector3('light0pos', light0.position);
        mat1.setVector4('light0diffuse', new BABYLON.Vector4(light0.diffuse.r, light0.diffuse.g, light0.diffuse.b, 1.0));
    });
    sphere.material = mat1;

    const camera = new BABYLON.ArcRotateCamera('camera0', -Math.PI / 2, Math.PI / 2, 4, sphere, scene);
    camera.attachControl(elCanvas);
    camera.wheelPrecision = 100;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 5;

    const light0 = new BABYLON.PointLight('light0', new BABYLON.Vector3(5, 5, 5), scene);
    light0.diffuse = new BABYLON.Color3(1, 0, 0);

    // anim
    const anim = new BABYLON.Animation('anim', 'radius', 15, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    anim.setKeys([
        { frame:0, value: 3},
        { frame:30, value: 5},
        { frame:60, value: 3}
    ]);
    camera.animations.push(anim);
    scene.beginAnimation(camera, 0, 60, true);
  
    return scene;
})();
engine.runRenderLoop(() => {
    scene.render();
});
addEventListener('resize', () => {
    engine.resize();
});