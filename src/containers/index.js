import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import * as util from '../utils/map';
// import data from '../point_cloud_1.json';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.positions = [];
    this.socket = openSocket('http://localhost:6999');
    this.fileIndex = 0;
    this.geometry = util.generateGeometry();
  }
  componentDidMount() {
    const map = util.generateScene();
    this.container.current.appendChild(map.renderer.domElement);
    const animate = () => {
      requestAnimationFrame(animate);
      map.renderer.render(map.scene, map.camera);
    };
    const socketEnd = () => {
      if (this.lastPointCloud) {
        map.scene.remove(this.lastPointCloud);
      }
      this.lastPointCloud = util.generatePointCloud(this.geometry);
      this.geometry.dispose();
      this.geometry = util.generateGeometry();
      map.scene.add(this.lastPointCloud);
      console.timeEnd('===hyman====');
      if (!this.pause) {
        this.nextShot();
      }
    };
    const socketPosition = (positionArr) => {
      const vectArray = util.transferArrayBufferToVect(positionArr);
      util.pushDataToGeometry(this.geometry, vectArray);
    };
    animate();
    // this.socket.on('start', () => { this.setState({ loading: true }); });
    this.socket.on('position', socketPosition);
    this.socket.on('end', socketEnd);
  }
  nextShot = () => {
    console.time('===hyman====');
    let newIndex = this.fileIndex + 1;
    if (newIndex > 153) { newIndex = 0; }
    this.pause = false;
    this.fileIndex = newIndex;
    this.socket.emit('getPosition', newIndex);
  }
  togglePause = () => {
    this.pause = true;
  }
  render() {
    return (
      <div>
        <button onClick={this.nextShot}>play</button>
        <button onClick={this.togglePause}>pause</button>
        <div ref={this.container} />
      </div>
    );
  }
}
