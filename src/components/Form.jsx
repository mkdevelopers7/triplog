// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
// import DatePicker
// import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useURLPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodeError, setGeocodeError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat & !lng) return;
      async function fetchCityData() {
        try {
          setIsLoadingGeocode(true);
          setGeocodeError("");
          // const res = await fetch(
          //   `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          // );
          // const res = await fetch(
          //   `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lng}`
          // );
          const res = await fetch(
            `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lng}&key=bdc_d29e50f4199e443e9848a86e01d05488`
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error(
              "That does not seem to be a country. Please select somewhere else"
            );
          setCityName(data.city || data.loaclity || "");
          setCountry(data.countryName);

          // setEmoji(convertToEmoji(data.countryCode));
          setEmoji(data.countryCode);
        } catch (err) {
          setGeocodeError(err.message);
        } finally {
          setIsLoadingGeocode(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  if (isLoadingGeocode) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by clicking anywhere on the map" />;
  if (geocodeError) return <Message message={geocodeError} />;

  async function handleSubmit(e) {
    e.preventDefault();
    // const  = Number(lat);
    // const lngNum = Number(lng);
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: Number(lat), lng: Number(lng) },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />

        {/* <DatePicker
          id="date"
          selected={date}
          onChange={(e) => setDate(e.target.value)}
        /> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
