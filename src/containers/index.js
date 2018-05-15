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
  }
  state = {
    loading: false,
    fileIndex: 0,
  }
  componentDidMount() {
    this.positions = [];
    const map = util.generateScene();
    this.container.current.appendChild(map.renderer.domElement);
    const animate = () => {
      requestAnimationFrame(animate);
      map.renderer.render(map.scene, map.camera);
    };
    animate();
    // this.socket.on('start', () => { this.setState({ loading: true }); });
    this.socket.on('position', (positionArr) => {
      this.positions = this.positions.concat(positionArr);
    });
    this.socket.on('end', () => {
      this.setState({ loading: false });
      if (this.lastPointCloud) {
        console.log('remove point cloud');
        map.scene.remove(this.lastPointCloud);
      }
      const data = this.positions;
      this.positions = [];
      console.log(data.length);
      this.lastPointCloud = util.generatePointCloud(data);
      map.scene.add(this.lastPointCloud);
      this.nextShot();
    });
  }
  nextShot = () => {
    let newIndex = this.state.fileIndex + 1;
    if (newIndex > 153) { newIndex = 0; }
    this.setState({ fileIndex: newIndex, loading: true });
    this.socket.emit('getPosition', newIndex);
  }
  render() {
    return (
      <div>
        <button disabled={this.state.loading} onClick={this.nextShot}>next shot</button>
        <div ref={this.container} />
      </div>
    );
  }
}
