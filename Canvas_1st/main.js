window.onload = function () {
  /* 初始化 */
  // 获取canvas
  let canvas = document.querySelector('#canvas')
  // 设置尺寸
  canvas.height = "800"
  canvas.width = "1200"
  //上下文
  let context = canvas.getContext('2d')

  /* 绘制直线 */
  // 开始
  context.beginPath()
  // 确定开始位置
  context.moveTo(600,100)
  // 确定绘制路径
  context.lineTo(600, 700)
  context.lineTo(600, 500)
  context.lineTo(600, 100)
  // 结束
  context.closePath()
  // 确定画笔粗细
  context.lineWidth = 5
  //确认画笔样式
  context.strokeStyle = "#cca"
  // 执行线条绘制函数
  context.stroke()
  // 设置填充颜色
  context.fillStyle = " rgb(2,100,30)"
  // 执行填充函数
  context.fill();


  /*   七巧板 */
  const brand = [{
    color:'#A3ACCC',
    point1: {
      x: 0,
      y: 0
    },
    point2: {
      x: 250,
      y: 250
    },
    point3: {
      x: 500,
      y: 0
    }
  }, {
    color:'#4D5C99',
    point1: {
      x: 500,
      y: 0
    },
    point2: {
      x: 250,
      y: 250
    },
    point3: {
      x: 500,
      y: 500
    }
  }, {
    color:'#FFC7A6',
    point1: {
      x: 500,
      y: 500
    },
    point2: {
      x: 250,
      y: 250
    },
    point3: {
      x: 0,
      y: 500
    }
  }, {
    color:'#CCACA3',
    point1: {
      x: 0,
      y: 500
    },
    point2: {
      x: 250,
      y: 250
    },
    point3: {
      x: 0,
      y: 0
    }
  }]

  for (let i = 0; i < brand.length; i++) {
    draw(brand[i],context)
  }

  //绘制弧
  context.moveTo(700,300)
  context.arc(700,300,100,0,Math.PI)
  context.stroke()

  //封闭弧线
  for (let j= 0; j< 10; j++) {
    context.beginPath()
    context.arc(10+j*120,700,50,0,Math.PI*2*(j+1)/10)
    context.closePath()
    context.stroke()
  }

  //非封闭弧线
  for (let j= 0; j< 10; j++) {
    context.beginPath()
    context.arc(10+j*120,550,50,0,Math.PI*2*(j+1)/10)
    context.stroke()
  }

}

function draw (part,ctx){
  ctx.beginPath()
  ctx.moveTo(part.point1.x,part.point1.y)
  ctx.lineTo(part.point2.x,part.point2.y)
  ctx.lineTo(part.point3.x,part.point3.y)
  ctx.closePath()
  ctx.fillStyle = part.color
  ctx.fill();
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 3
  ctx.stroke()
}