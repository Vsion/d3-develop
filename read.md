椭圆弧使用A字母来标示，具体参数如下：

A rx ry x-axis-rotation large-arc-flag sweep-flag x y
分别表示：

A - 椭圆弧

rx - x轴半径

ry - y轴半径

x-axis-rotation - x轴旋转

large-arc-flag - 选择大弧度(1),或者小弧度(0)

sweep-flag - 表示弧线的方向，0表示从起点到终点沿逆时针画弧，1表示从起点到终点沿顺时针画弧

x - x轴坐标

y - y轴坐标

相关代码如下：

<svg width="400" height="500">

  <!-- 椭圆弧曲线参数：A rx ry x-axis-rotation large-arc-flag sweep-flag x y  -->

  <path d="M100 100 A 30 50 1 0 0 200 150 z" fill="#080" stroke="#8f8" stroke-width="5" opacity="0.5"/>

  <path d="M100 100 A 30,50 0 0,1 200,150 z" fill="#088" stroke="cyan" stroke-width="5" opacity="0.5"/>

  <path d="M100 100 A300,30 0 0,0 200,150 " fill="#880" stroke="yellow" stroke-width="5" opacity="0.5" />

  <path d="M100 100 A300,30 0 0,1 200,150 " fill="#800" stroke-width="5" opacity="0.5"/>

</svg>