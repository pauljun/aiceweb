import React, { Component } from 'react';
import IconFont from '../../../../../components/IconFont'
import './index.scss';

export default class DragContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height || 200
    };
    this.defaultHeight = this.props.height || 200;
    this.minHeight = this.props.minHeight || 150;
    this.maxHeight = this.props.maxHeight || 400;
  }
  isDrag = false;
  position = {
    start: null,
    end: null
  };
  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = event => {
    if (this.isDrag) {
      this.position.end = event.pageY;
      let height = this.defaultHeight;
      height = height + (this.position.start - this.position.end);
      if (height < this.minHeight) {
        height = this.minHeight;
      }
      if (height > this.maxHeight) {
        height = this.maxHeight;
      }
      this.setState({ height });
    }
  };
  onMouseUp = event => {
    this.isDrag = false;
    this.defaultHeight = this.state.height;
  };
  onMouseDown(event) {
    this.isDrag = true;
    this.position.start = event.pageY;
    console.log(event.pageX, event.pageY);
  }
  render() {
    const { className, disabled } = this.props;
    return (
      <div
        className={`dragContent ${className ? className : ''}`}
        style={{
          width: this.props.width ? this.props.width : '100%',
          height: this.state.height
        }}
      >
        {this.props.children}
        <span
          onMouseUp={(event) => !disabled && this.onMouseUp(event)}
          onMouseDown={(event) => !disabled && this.onMouseDown(event)}
          className={`toggle ${disabled?'disable':''}`}
        ><IconFont type="icon-Drug_Main"></IconFont></span>
      </div>
    );
  }
}
