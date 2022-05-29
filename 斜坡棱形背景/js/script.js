toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var vm = new Vue({
  el : '#app',
  data : {
    hueAdjust : 0,
    angleAdjust: 0,
  },
  methods : {
     setVar(vName, newVal){
        document.querySelector(':root').style.setProperty(vName, newVal)
     },
    copyCSS(){
      let gradientString = this.getCurrentGradient();
      
      let copyBox = document.querySelector('#copyBox');
      copyBox.style['display'] = 'block';
      copyBox.innerHTML = gradientString;
      selectText('copyBox')
      document.execCommand('copy');
      copyBox.style['display'] = 'none';
      toastr.success('CSS已复制到剪贴板')
    },
    spin(){
      let intervalID = window.setInterval(this.rotateAll, 10);
      
      // The random stop time determines how long it spins for
      window.setTimeout(function(){
        clearInterval(intervalID)
      }, getRandomIntRange(1000,3000))
    },
    rotateAll(){
      this.angleAdjust += 1
      this.angleAdjust = this.angleAdjust % 360;
    },
    randomize(){
      for(var i=1; i<10;i++){
        this.setVar(`--angle-${i}`, getRandomInt(360) + 'deg');
      }
    },
    getCurrentGradient(){
      let element = document.querySelector('.gradient-box')
      let styles = window.getComputedStyle(element);
      let gradientString = styles.getPropertyValue('background-image');
      return gradientString;
    } 
  },
  watch : {
     hueAdjust : function(newVal, oldVal){
       this.setVar('--hue-adjust', newVal);
     },
    angleAdjust : function(newVal, oldVal){
      this.setVar('--angle', newVal + 'deg')
    }
  },
})

// https://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
function selectText(node) {
    node = document.getElementById(node);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("不支持的浏览器");
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntRange(min, max) {
  return Math.floor(Math.random() * Math.floor(max-min)) + min;
}