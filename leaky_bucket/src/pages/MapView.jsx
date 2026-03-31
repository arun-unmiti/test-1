import React from "react";
import { MapContainer, TileLayer, Marker, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapView() {

    const center = [17.385, 78.4867];

    const polygon = [
        [17.3855, 78.486],
        [17.3865, 78.487],
        [17.387, 78.489],
        [17.386, 78.490],
        [17.3855, 78.488]
    ];

    const markerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35]
    });

    return (
        <>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="card tbl">
                        <div className="card-body">
                            <div style={{ height: "300px", width: "100%" }}>
                                <MapContainer center={center} zoom={16} style={{ height: "100%", width: "100%" }}>

                                    <TileLayer
                                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    />

                                    {/* Polygon */}
                                    <Polygon
                                        positions={polygon}
                                        pathOptions={{
                                            color: "red",
                                            fillColor: "red",
                                            fillOpacity: 0.5
                                        }}
                                    />

                                    {/* Marker with Tooltip */}
                                    <Marker position={[17.3865, 78.488]} icon={markerIcon}>
                                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                                            Activity Area
                                        </Tooltip>
                                    </Marker>

                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default MapView;