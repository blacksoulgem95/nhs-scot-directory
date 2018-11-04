import React, {Component} from 'react';
import MapComponent from "./MapComponent";
import {geolocated} from "react-geolocated";

class App extends Component {
    state = {
        center: {lat: -34.397, lng: 150.644},
        loading: true
    };

    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        if (this.props.coords) {
            this.setState({
                center: {lat: this.props.coords.latitude || -34.397, lng: this.props.coords.longitude || 150.644},
                loading: false
            });
        } else if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
            setTimeout(this.componentDidMount, 250);
        } else this.setState({loading: false});
    }

    render() {
        return (
            <div id="content" className="content">
                {this.state.loading ? <h1>Tracking your location...</h1> : <MapComponent
                    center={this.state.center}
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `100vh`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}/>}
            </div>
        );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(App);
