import React from 'react';
import { isFullscreen, fullscreen, exitFullscreen } from '../../utils/FullScreen';
import IconFont from '../IconFont';
import './index.scss';

export default class FullScreenLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullScreen: false
    };
  }

  componentDidMount() {
    document.addEventListener('MSFullscreenChange', this.changeFullScreen);
    document.addEventListener('mozfullscreenchange', this.changeFullScreen);
    document.addEventListener('webkitfullscreenchange', this.changeFullScreen);
    document.addEventListener('webkitfullscreenchange', this.fullscreenchange);
  }
  componentWillUnmount() {
    document.removeEventListener('MSFullscreenChange', this.changeFullScreen);
    document.removeEventListener('mozfullscreenchange', this.changeFullScreen);
    document.removeEventListener(
      'webkitfullscreenchange',
      this.changeFullScreen
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.fullscreenchange
    );
  }
  timer = null;
  changeFullScreen = () => {
    const { getContainer } = this.props;
    const container = getContainer();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const { isFullScreen } = this.state;
      if (isFullscreen() !== container) {
        isFullScreen && this.setState({ isFullScreen: false });
      } else {
        !isFullScreen && this.setState({ isFullScreen: true });
      }
    }, 100);
  };
  fullScreen() {
    const { getContainer } = this.props;
    const container = getContainer();
    if (isFullscreen() === container) {
      exitFullscreen();
      this.setState({ isFullScreen: false });
    } else {
      fullscreen(container);
      this.setState({ isFullScreen: true });
    }
  }

  render() {
    const { isFullScreen } = this.state;
    const { children, className } = this.props;
    return (
      <div
        className={`tools-screen-layer ${className ? className : ''}`}
        onClick={this.fullScreen.bind(this)}
      >
        {children ? (
          children(isFullScreen)
        ) : (
          <React.Fragment>
            <IconFont
              type={!isFullScreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
              theme="outlined"
            />
            {!isFullScreen ? '全屏' : '窗口'}
          </React.Fragment>
        )}
      </div>
    );
  }
}
