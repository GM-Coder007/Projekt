import React from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import getColor from "../colors";

export interface ISection {
  start: [number, number];
  end: [number, number];
  quality: number;
}

interface QualityMapProps {
  sections: ISection[];
}

const QualityMap: React.FC<QualityMapProps> = ({ sections }) => {
  return (
    <MapContainer
      center={[46.55917562552739, 15.638073505305133]}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sections.map((section, index) => (
        <Polyline
          key={index}
          pathOptions={{ color: getColor(section.quality) }}
          positions={[section.start, section.end]}
          weight={5}
        />
      ))}
    </MapContainer>
  );
};

export default QualityMap;
