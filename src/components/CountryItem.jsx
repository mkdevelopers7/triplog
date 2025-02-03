import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}
      <span>
        {<img src={`https://flagsapi.com/${country.emoji}/flat/48.png`}></img>}
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
