import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  //selectDestination,
  selectOrigin,
  setOrigin,
  //setTravelTimeInformation,
} from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useNavigation } from "@react-navigation/core";

const Map = () => {
  const origin = useSelector(selectOrigin);
  //const destination = useSelector(selectDestination);
  const [apiResults, setApiResults] = useState([]);
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  // const tempResults = async () => {
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json
  //   ?keyword=parking
  //   &location=-33.8670522%2C151.1957362
  //   &radius=1000
  //   &key=${GOOGLE_MAPS_APIKEY}`
  //   ).then(async (res) => {
  //     console.log(await res.json());
  //   });
  // };
  //console.log(tempResults);
  useEffect(() => {
    if (!origin) return;
    //Zoom & fit to markers
    mapRef.current.fitToSuppliedMarkers(["origin"], {
      edgePadding: { top: 5, right: 5, bottom: 5, left: 5 },
      animated: true,
    });
  }, [origin]);

  useEffect(() => {
    //   //if (!origin || !destination) return;
    if (!origin) return;
    const getApiResults = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=parking&location=${origin.location.lat}%2C${origin.location.lng}&radius=2500&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let markers = [];
          data.results.forEach((element) => {
            let result = {
              latitude: element.geometry.location.lat,
              longitude: element.geometry.location.lng,
              name: element.name,
              address: element.vicinity,
            };
            markers.push(result);
            //console.log(element.geometry.location.lat);
          });
          setApiResults(markers);
          //console.log(markers);
          //dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        });
    };
    getApiResults();
  }, [origin, GOOGLE_MAPS_APIKEY]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="standard"
      zoom="zoom"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <MapView.Circle
        center={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        radius={300}
        strokeWidth={1}
        strokeColor={"#1a66ff"}
        fillColor={"rgba(230,238,255,0.5)"}
      />

      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
          onCalloutPress={() => {
            //
          }}
          onPress={(markerPress, id) => {
            //console.log(id);
            //console.log(markerPress);
          }}
        />
      )}
      {apiResults.map((result) => {
        //console.log(result);
        return (
          <Marker
            coordinate={{
              latitude: result.latitude,
              longitude: result.longitude,
            }}
            title={result.name}
            description={result.address}
            onPress={() => {
              navigation.navigate("NavigateCard", {
                latitude: result.latitude,
                longitude: result.longitude,
                name: result.name,
                address: result.address,
              });
            }}
          >
            <Icon name="car" type="font-awesome" color="green" size={25} />
          </Marker>
        );
      })}

      {/* {origin && destination && (
        <MapViewDirections
          lineDashPattern={[0]}
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
        />
      )} 
       {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )} */}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
