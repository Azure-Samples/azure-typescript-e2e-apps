import React, { useState, useEffect } from "react";
import "./App.css";

import TriviaGame from "./components/TriviaGame";
import GeoLocation from "./components/GeoLocation";
import fetchGame from "./lib/api-game";
import fetchLocation from "./lib/api-location";
import { randomizeObjects } from "./lib/utils";

function App() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setGameData] = useState(null);
  const [locationNames, setLocationNames] = useState({
    city: "",
    state: "",
    county: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position);
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchLocation(location?.coords.latitude, location?.coords.longitude).then(
        (locationData) => {
          setLocationNames({
            city: locationData.city,
            state: locationData.state,
            county: locationData.county,
          });
        }
      );
    }
  }, [location]);

  useEffect(() => {
    if (
      !data &&
      locationNames &&
      (locationNames.city || locationNames.county || locationNames.state)
    ) {
      fetchGame({
        location: `${locationNames.city}, ${locationNames.county}, ${locationNames.state}`,
      }).then((game) => {
        console.log(game);

        // randomize questions and answers
        game.questions.forEach((question) => {
          question.answers = randomizeObjects(question.answers);
        });

        game.questions = randomizeObjects(game.questions);

        setIsLoading(false);
        setGameData(game);
      });
    }
  }, [
    data,
    locationNames,
    locationNames?.city,
    locationNames?.county,
    locationNames?.state,
  ]);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {location && (
        <GeoLocation location={location} locationNames={locationNames} />
      )}
      {!isLoading && data && <TriviaGame game={data} reset={setGameData} />}
    </>
  );
}

export default App;
