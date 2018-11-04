import React, {Component} from 'react';
import MapComponent from "./MapComponent";
import AdSense from 'react-adsense';
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
        if (this.state.loading) return <h1>Loading</h1>;
        return (
            <div id="layout" className="grid">
                <div id="ad-left" className="ad-left">
                    <AdSense.Google
                        client='ca-pub-6556679459228558'
                        slot='1330208099'
                    />
                </div>
                <div id="content" className="content">
                    {this.state.loading ? null : <MapComponent
                        center={this.state.center}
                        loadingElement={<div style={{height: `100%`}}/>}
                        containerElement={<div style={{height: `100vh`}}/>}
                        mapElement={<div style={{height: `100%`}}/>}/>}
                </div>
                <div id="ad-right" className="ad-right">
                    <AdSense.Google
                        client='ca-pub-6556679459228558'
                        slot='3843447529'
                    />
                </div>
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
