'use client';
import Globe from 'react-globe.gl';
import { useEffect, useRef } from 'react';

interface CityData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
}

export default function GlobeComponent() {
  const globeRef = useRef<any>();
  const myCity: CityData[] = [
    {
      lat: 28.4595,
      lng: 77.0266,
      size: 1.2,
      color: "red",
      label: "Gurgaon"
    }
  ];

  useEffect(() => {
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 1;

    const timeoutId = setTimeout(() => {
      globeRef.current?.pointOfView(
        { lat: myCity[0].lat, lng: myCity[0].lng, altitude: 2.5 },
        3000
      );
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full h-[400px] relative">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0, 0, 0, 0)"
        pointsData={myCity}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.02}
        pointRadius="size"
        pointLabel="label"
        width={400}
        height={400}
      />
    </div>
  );
}
