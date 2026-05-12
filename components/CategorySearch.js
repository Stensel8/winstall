import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "../styles/search.module.scss";

function CategorySearch({ onFilter, label, placeholder }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (input === undefined || input === null) return;

    const timer = setTimeout(() => {
      if (onFilter) onFilter(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, onFilter]);

  return (
    <div>
      <label htmlFor="category-search" className={styles.searchLabel}>
        {label || "Search for apps"}
      </label>
      <div className={styles.searchBox}>
        <div className={styles.searchInner}>
          <FiSearch />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            id="category-search"
            value={input}
            autoComplete="off"
            placeholder={placeholder || "Search for apps here"}
          />
        </div>
      </div>
    </div>
  );
}

export default CategorySearch;
