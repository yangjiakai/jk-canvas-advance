console.clear();

var twodWebGL = new WTCGL(
document.querySelector('canvas#webgl'),
document.querySelector('script#vertexShader').textContent,
document.querySelector('script#fragmentShader').textContent,
window.innerWidth,
window.innerHeight,
2);

twodWebGL.startTime = -100 + Math.random() * 50;


// twodWebGL.addUniform('xscale', WTCGL.TYPE_FLOAT, 0.5);

window.addEventListener('resize', function () {
  twodWebGL.resize(window.innerWidth, window.innerHeight);
});
twodWebGL.resize(window.innerWidth, window.innerHeight);






// track mouse move
var mousepos = [0, 0];
var u_mousepos = twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
window.addEventListener('pointermove', function (e) {
  var ratio = window.innerHeight / window.innerWidth;
  if (window.innerHeight > window.innerWidth) {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1 * ratio;
  } else {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;
  }
  twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
});









// Load all our textures. We only initiate the instance once all images are loaded.
var textures = [
{
  name: 'noise',
  url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png',
  type: WTCGL.IMAGETYPE_TILE,
  img: null },

{
  name: 'environment',
  url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/environment2.jpg',
  type: WTCGL.IMAGETYPE_TILE,
  img: null }];


var loadImage = function loadImage(imageObject) {
  var img = document.createElement('img');
  img.crossOrigin = "anonymous";

  return new Promise(function (resolve, reject) {
    img.addEventListener('load', function (e) {
      imageObject.img = img;
      resolve(imageObject);
    });
    img.addEventListener('error', function (e) {
      reject(e);
    });
    img.src = imageObject.url;
  });
};
var loadTextures = function loadTextures(textures) {
  return new Promise(function (resolve, reject) {
    var loadTexture = function loadTexture(pointer) {
      if (pointer >= textures.length || pointer > 10) {
        resolve(textures);
        return;
      };
      var imageObject = textures[pointer];

      var p = loadImage(imageObject);
      p.then(
      function (result) {
        twodWebGL.addTexture(result.name, result.type, result.img);
      },
      function (error) {
        console.log('error', error);
      }).finally(function (e) {
        loadTexture(pointer + 1);
      });
    };
    loadTexture(0);
  });

};

loadTextures(textures).then(
function (result) {
  twodWebGL.initTextures();
  // twodWebGL.render();
  twodWebGL.running = true;
},
function (error) {
  console.log('error');
});