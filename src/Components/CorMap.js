import React, { Component } from "react";
import MapGL, { Source, Layer, GeolocateControl } from "react-map-gl";
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';
import './CorMap.css'


const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZmFyaXNheml6MTIiLCJhIjoiY2s3cXM3NzBvMDVrZjNlcDRlM2s1N2R3aiJ9.lBO4VnTnXaP9ZpZcJndkIA";

export default class Map extends Component {
  state = {
    hoveredFeature: null,
    viewport: {
      width: 400,
      height: 400,
      latitude: 51,
      longitude: -0.37,
      zoom: 4
    },
    GeoJSONCaseAndMapData: []
  };

  componentDidMount() {
      fetch('https://cortrack.herokuapp.com/getSessionInfo', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
        }).then(resp => resp.json()).then(GeoJSONCaseAndMapData => this.setState({GeoJSONCaseAndMapData}))
        .catch(err => {
            console.log(err);
        });
  }

  _onHover = event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features&& features[0]._vectorTileFeature.properties.Confirmed? features[0]._vectorTileFeature.properties : undefined

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
    console.log(hoveredFeature)
  };
  
  _renderTooltip() {
    const {hoveredFeature, x, y} = this.state;

    return (
      hoveredFeature && (
        <div className="tooltip" style={{left: x, top: y}}>
          <div>Country/Region: {hoveredFeature.CountryRegion}</div>
          {hoveredFeature.ProvinceState !== ""&&<div>Province/State: {hoveredFeature.ProvinceState}</div>}
          <div>Confirmed Cases: {hoveredFeature.Confirmed}</div>
          <div>Deaths: {hoveredFeature.Death}</div>
          <div>Recoveries: {hoveredFeature.Recovered}</div>
        </div>
      )
    );
  }


  render() {

    const geolocateStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      margin: 10
    };

    return (
      <MapGL
        {...this.state.viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={viewport => this.setState({ viewport })}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onHover={this._onHover}
      >
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{enableHighAccuracy: false}}
          trackUserLocation={true}
        />
        <Source cluster={true} clusterMaxZoom={14} clusterRadius={100} type="geojson" data={"https://cortrack.herokuapp.com/getSessionInfo"}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        {this._renderTooltip()}
      </MapGL>
    );
  }
}
