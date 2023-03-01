import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Modal from "./components/Modal/Modal";
import NewItem from "./components/NewItem/NewItem";
import { getCurrentTime, timeZoneList } from "./utils/utils";

function App() {
  const limitCard = 4;
  const [localTime, setLocalTime] = useState({
    state: { loading: true, error: false },
    latitude: null,
    longitude: null,
    timeZone: null,
    cityName: null,
  });
  const [worldClockArr, setWorldClockArr] = useState([]); // {timeZone: "Asia/...", cityName: "", shortLabel:'' }
  const [citiesAndTimeZone, setCitiesAndTimeZone] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  function closeModal() {
    setIsOpenModal(false);
  }

  function openModal() {
    setIsOpenModal(true);
  }

  function handleAddWorldClock(value) {
    setWorldClockArr((state) => [...state, value]);
  }

  function removeAClock(timeZone) {
    setWorldClockArr((state) =>
      state.filter((city) => city.timeZone !== timeZone)
    );
  }

  useEffect(function getLocalTime() {
    const apiKey = "0d06189cb8b24cb5b987a684a2710743";

    // get current position
    fetch("https://api.bigdatacloud.net/data/reverse-geocode-client")
      .then((response) => response.json())
      .then((result) => {
        const { city, latitude, longitude } = result;

        // get time & city name
        fetch(
          `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&lat=${latitude}&long=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            setLocalTime((state) => ({
              ...state,
              cityName: city,
              latitude,
              longitude,
              timeZone: data.timezone,
              state: { loading: false, error: false },
            }));
          });
      });
  }, []);

  useEffect(
    function updateLocalTime() {
      let id = null;
      // update after 1 minute
      if (localTime.timeZone) {
        id = setInterval(() => {
          setLocalTime((state) => ({ ...state }));
        }, 60 * 1000);
      }

      //DOC: When exactly does React clean up an effect? React performs the cleanup when the component unmounts. However, as we learned earlier, effects run for every render and not just once. This is why React also cleans up effects from the previous render before running the effects next time.
      return () => clearInterval(id);
    },
    [localTime.timeZone]
  );

  useEffect(
    function updateWorldClock() {
      let id = null;
      // update after 1 minute
      if (worldClockArr.length) {
        id = setInterval(() => {
          setWorldClockArr((state) => [...state]);
        }, 60 * 1000);
      }

      return () => clearInterval(id);
    },
    [worldClockArr]
  );

  useEffect(function getListCitiesWithTimeZone() {
    const data = timeZoneList.map((timeZone) => {
      const city = timeZone.split("/");
      const cityName = city[1].replace("_", " ");

      return {
        cityName,
        timeZone,
      };
    });

    setCitiesAndTimeZone(data);
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center max-w-7xl mx-auto">
        {localTime.state.loading ? (
          <span className="animate-spin h-10 w-10 mr-3 rounded-full border-4 border-solid border-r-transparent border-blue-400"></span>
        ) : (
          <div className="flex-grow">
            <div className="text-center pb-10">
              <div className="font-medium text-xl mb-2">
                {localTime.cityName}
              </div>
              <time className="block text-5xl">
                {getCurrentTime(localTime.timeZone)}
              </time>
            </div>
            <div className="grid grid-cols-4 auto-rows-[1fr] gap-5 p-5">
              {worldClockArr.map(
                ({ cityName, shortLabel, timeZone }, index) => (
                  <Card
                    key={index}
                    cityName={cityName}
                    shortLabel={shortLabel}
                    timeZone={timeZone}
                    localTime={localTime}
                    removeAClock={removeAClock}
                  />
                )
              )}
              {worldClockArr.length < limitCard && (
                <NewItem openModal={openModal} closeModal={closeModal} />
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        closeModal={closeModal}
        isOpenModal={isOpenModal}
        //
        worldClockArr={worldClockArr}
        handleAddWorldClock={handleAddWorldClock}
        //
        citiesAndTimeZone={citiesAndTimeZone}
      />
    </>
  );
}

export default App;
