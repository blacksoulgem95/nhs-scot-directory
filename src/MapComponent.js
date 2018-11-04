import React from "react";
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps"
import firebase from "firebase/app";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";

class MapComponent extends React.Component {
    state = {
        loading: true
    };

    async componentDidMount() {
        const snap = await this.getDocumentNearBy(this.props.center.lat, this.props.center.lng, 5, firebase.firestore());
        const docs = [];
        snap.forEach(doc => {
            docs.push(doc.data());
        });
        console.log(docs);
        this.setState({docs: docs, loading: false});
    }

    getDocumentNearBy(latitude, longitude, distance, db) {

        console.log(latitude, longitude, distance);
        // ~1 mile of lat and lon in degrees
        let lat = 0.0144927536231884;
        let lon = 0.0181818181818182;

        let lowerLat = latitude - (lat * distance);
        let lowerLon = longitude - (lon * distance);

        let greaterLat = latitude + (lat * distance);
        let greaterLon = longitude + (lon * distance);

        let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
        let greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);

        console.log(lesserGeopoint, greaterGeopoint);
        let docRef = db.collection("doctors");
        let query = docRef.where("geopoint", ">=", lesserGeopoint).where("geopoint", "<=", greaterGeopoint);

        return query.get();

    }

    render() {
        if (this.state.loading) return <h1>loading...</h1>;
        console.log("center is", this.props.center);
        return (
            <div id="containerElement">
                <div id="mapElement">
                    <GoogleMap
                        defaultZoom={15}
                        defaultCenter={{lat: this.props.center.lat, lng: this.props.center.lng}}
                    >
                        {this.state.docs.map(d => {
                            console.log("adding mark for", d);
                            return (<Marker
                                position={{lat: d.geopoint._lat, lng: d.geopoint._long}}/>)
                        })}
                        {this.state.docs.map(d => {
                            console.log("adding mark for", d);
                            return (<MarkerWithLabel
                                position={{lat: d.geopoint._lat, lng: d.geopoint._long}}
                                labelAnchor={new window.google.maps.Point(0, 0)}
                                labelClass="marker-label"
                            >
                                <div>
                                    <p>{d.GPPracticeName}</p>
                                    <p>{d.AddressLine1}<br/>
                                        {d.AddressLine2}<br/>
                                        {d.AddressLine3}<br/>
                                        {d.AddressLine4}<br/>
                                        {d.Postcode}
                                    </p>
                                    <p>P. {d.TelephoneNumber}</p>
                                </div>
                            </MarkerWithLabel>)
                        })}
                        <Marker position={{lat: this.props.center.lat, lng: this.props.center.lng}}/>
                        <MarkerWithLabel position={{lat: this.props.center.lat, lng: this.props.center.lng}}
                                         labelClass="marker-label">
                            <p>Your position</p>
                        </MarkerWithLabel>
                    </GoogleMap>
                </div>
            </div>
        );
    }
}

export default withGoogleMap(MapComponent);