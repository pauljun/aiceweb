import React from 'react';
export default class CircleComponent extends React.Component {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
		this.ctx = null;
		this.animate = null;
	}
	endValue = 0;
	animate = null;
	width = 100;
	height = 100;
	lineWidth = 10;
	hasText = true;
  componentDidMount() {
    this.init(this.props)
  }
  componentWillReceiveProps(nextProps){
    if(this.props.value !== nextProps.value){
      this.init(nextProps)
    }
  }
  init(props){
    let { width, height, lineWidth, hasText, startRGB, endRGB } = props;
    this.width = width || 100;
    this.height = height || 100;
    this.lineWidth = lineWidth || 10;
    this.hasText = hasText || true;
    this.startRGB = startRGB || '247,163,25';
    this.endRGB = endRGB || '255,94,119';
    this.renderCircle();
  }
	componentWillUnmount() {
		window.cancelAnimationFrame(this.animate);
		this.canvas = null;
		this.ctx = null;
	}
	renderCircle() {
		let canvas = this.canvas.current;
		this.ctx = canvas.getContext('2d');
		this.ctx.canvas.width = this.width;
		this.ctx.canvas.height = this.height;
		this.animate = window.requestAnimationFrame(this.drawOutCircle.bind(this));
	}

	drawOutCircle(timestamp) {
		let { hasText } = this.props;
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.drawInCircle();

		//绘制根据百分比变动的环
		this.ctx.beginPath();
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineCap = 'round';
		let linearGradient = this.ctx.createLinearGradient(this.width, this.width / 2, 0, this.height);
		linearGradient.addColorStop(
			0,
			// `rgba(${this.startRGB},${(this.props.value -
			//   (this.props.value - this.endValue)) /
			//   this.props.value})`
			`rgba(${this.startRGB},1`
		);
		linearGradient.addColorStop(
			1,
			// `rgba(${this.endRGB},${(this.props.value -
			//   (this.props.value - this.endValue)) /
			//   this.props.value})`
			`rgba(${this.endRGB},1`
		);
		this.ctx.strokeStyle = linearGradient;
		//设置开始处为0点钟方向（-90*Math.PI/180）
		//x为百分比值（0-100）
		this.ctx.arc(
			this.width / 2,
			this.height / 2,
			this.width / 2 - this.lineWidth,
			-90 * Math.PI / 180,
			(this.endValue * 3.6 - 90) * Math.PI / 180
		);

		this.ctx.stroke();

		//showdom
		this.ctx.beginPath();
		// this.ctx.strokeStyle = linearGradient;
		//设置开始处为0点钟方向（-90*Math.PI/180）
		//x为百分比值（0-100）
		let angle = (this.endValue * 3.6 - 90) * Math.PI;

		let x = this.width / 2 + (this.width / 2 - this.lineWidth) * Math.cos(angle / 180);
		let y = this.height / 2 + (this.height / 2 - this.lineWidth) * Math.sin(angle / 180);
		this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgba(255,255,255,1)'
		this.ctx.fill();

		//绘制中间的文字
		if (hasText) {
			this.drawText();
		}
		this.ctx.font = `bold ${9 * this.width / 100}px Arial`;
		this.ctx.fillStyle = '#fff';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(hasText ? '相似度' : '', this.width / 2, this.height / 2 + 10 * this.width / 100);
		if (this.endValue < this.props.value) {
			this.endValue += 2;
			if (this.endValue > this.props.value) {
				this.endValue = this.props.value;
			}
			this.animate = window.requestAnimationFrame(this.drawOutCircle.bind(this));
		}
	}

	drawInCircle() {
		//起始一条路径
		this.ctx.beginPath();
		//设置当前线条的宽度
		this.ctx.lineWidth = this.lineWidth; //10px
		// this.ctx.shadowBlur = 6;
		// this.ctx.shadowColor = '#0A0A0D';
		//设置笔触的颜色
		this.ctx.strokeStyle = '#d7dbe6';
		//arc()方法创建弧/曲线（用于创建圆或部分圆）arc(圆心x,圆心y,半径,开始角度,结束角度)
		this.ctx.arc(this.width / 2, this.height / 2, this.width / 2 - this.lineWidth, 0, 2 * Math.PI);
		//绘制已定义的路径
		this.ctx.stroke();

		// shawdom
		// this.ctx.beginPath()
		// this.ctx.lineWidth = 10 //10px
		// //设置笔触的颜色
		// this.ctx.strokeStyle = 'rgb(54,62,93)'
		// //arc()方法创建弧/曲线（用于创建圆或部分圆）arc(圆心x,圆心y,半径,开始角度,结束角度)
		// this.ctx.arc(
		//     this.width / 2,
		//     this.height / 2,
		//     this.width / 2 - 5,
		//     0,
		//     360
		// )
		// //绘制已定义的路径
		// this.ctx.stroke()
	}

	drawText() {
		this.ctx.font = `bold ${(this.endValue === 100 ? 20 : 24) * this.width / 100}px Arial`;
		this.ctx.fillStyle = '#eee';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(this.endValue, this.width / 2, this.height / 2 - 10 * this.width / 100);

		this.ctx.font = `bold ${10 * this.width / 100}px Arial`;
		this.ctx.fillStyle = '#eee';
		this.ctx.textBaseline = 'hanging';
		this.ctx.textAlign = 'center';
		// this.ctx.fillText(
		//     '%',
		//     this.width / 2 + 18 * this.width / 100,
		//     this.height / 2 + 10 * this.width / 100
		// )
	}
	render() {
		return <canvas ref={this.canvas} />;
	}
}
