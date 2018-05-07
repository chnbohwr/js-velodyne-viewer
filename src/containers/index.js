import React, { Component } from 'react';
import * as util from '../utils/map';
import data from '../point_cloud_1.json';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }
  componentDidMount() {
    const map = util.generateScene();
    console.log(data.length);
    const pointCloud = util.generatePointCloud(data);
    map.scene.add(pointCloud);
    this.container.current.appendChild(map.renderer.domElement);
    const animate = () => {
      requestAnimationFrame(animate);
      map.renderer.render(map.scene, map.camera);
    };
    animate();
  }
  render() {
    return (
      <div ref={this.container} />
    );
  }
}
