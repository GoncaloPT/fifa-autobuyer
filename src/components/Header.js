import React, { Component, PropTypes } from 'react';
import RetinaImage from 'react-retina-image';
import util from '../utils/Util';
import electron from 'electron';
const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
import classNames from 'classnames';

class Header extends Component {
  static propTypes = {
    hideLogin: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      updateAvailable: false,
      username: null
    };
  }
  componentDidMount() {
    document.addEventListener('keyup', this.handleDocumentKeyUp, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
  }

  handleDocumentKeyUp(e) {
    if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
      remote.getCurrentWindow().setFullScreen(false);
      this.forceUpdate();
    }
  }
  handleClose() {
    if (util.isWindows()) {
      remote.getCurrentWindow().close();
    } else {
      remote.getCurrentWindow().hide();
    }
  }
  handleMinimize() {
    remote.getCurrentWindow().minimize();
  }
  handleFullscreen() {
    if (util.isWindows()) {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
      } else {
        remote.getCurrentWindow().maximize();
      }
      this.setState({
        fullscreen: remote.getCurrentWindow().isMaximized()
      });
    } else {
      remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
      this.setState({
        fullscreen: remote.getCurrentWindow().isFullScreen()
      });
    }
  }
  handleFullscreenHover() {
    this.update();
  }
  handleUserClick(e) {
    const menu = new Menu();

    menu.append(new MenuItem({ label: 'Sign Out', click: this.handleLogoutClick.bind(this) }));
    menu.popup(
      remote.getCurrentWindow(),
      e.currentTarget.offsetLeft,
      e.currentTarget.offsetTop + e.currentTarget.clientHeight + 10
    );
  }
  handleLogoutClick() {
    this.context.router.push('/');
  }
  renderLogo() {
    return (
      <div className="logo">
        <RetinaImage src="logo.png" />
      </div>
    );
  }
  renderWindowButtons() {
    let buttons;
    if (util.isWindows()) {
      const fullscreenClass = classNames({
        'windows-button': true,
        'button-fullscreenclose': this.state.fullscreen,
        'button-fullscreen': !this.state.fullscreen,
        enabled: true
      });
      buttons = (
        <div className="windows-buttons">
        <div className="windows-button button-minimize enabled" onClick={this.handleMinimize.bind(this)}>
          <div className="icon"></div>
        </div>
        <div className={fullscreenClass} onClick={this.handleFullscreen.bind(this)}>
          <div className="icon"></div>
        </div>
        <div className="windows-button button-close enabled" onClick={this.handleClose.bind(this)}></div>
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
        <div className="button button-close enabled" onClick={this.handleClose.bind(this)}></div>
        <div className="button button-minimize enabled" onClick={this.handleMinimize.bind(this)}></div>
        <div className="button button-fullscreen enabled" onClick={this.handleFullscreen.bind(this)}></div>
        </div>
      );
    }
    return buttons;
  }
  renderDashboardHeader() {
    const headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows() ? this.renderLogo() : this.renderWindowButtons()}
          <div className="login-wrapper">
            <div className="login no-drag" onClick={this.handleUserClick.bind(this)}>
              <span className="icon icon-user"></span>
                <span className="text">
                  hunterjm@gmail.com
                </span>
                <RetinaImage src="userdropdown.png" />
            </div>
          </div>
        </div>
        <div className="right-header">
          {util.isWindows() ? this.renderWindowButtons() : this.renderLogo()}
        </div>
      </div>
    );
  }
  renderBasicHeader() {
    const headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows() ? null : this.renderWindowButtons()}
        </div>
        <div className="right-header">
          {util.isWindows() ? this.renderWindowButtons() : null}
        </div>
      </div>
    );
  }
  render() {
    if (this.props.hideLogin) {
      return this.renderBasicHeader();
    }
    return this.renderDashboardHeader();
  }
}

Header.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Header;