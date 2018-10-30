import React, { Component } from 'react';
import logo from './logo.svg';
import SubMenu from "./SubMenu";
import Menu from "./Menu";
import Content from "./Content";

class App extends Component {
  render() {
    return (
        <div id="layout" className="content pure-g">
          <Menu/>
          <SubMenu/>
          <Content/>
        </div>
    );
  }
}

export default App;
