import { useState, useEffect, useRef } from "react";
import styles from "../styles/listCategory.module.scss";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const ListCategory = ({ categories, defaultCategory, onCategoryChange }) => {
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!category) {
      setCategory(defaultCategory || "all");
    }
  }, [category, defaultCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onCategorySelected = (categoryKey) => {
    setCategory(categoryKey);
    setIsOpen(false);
    if (onCategoryChange) onCategoryChange(categoryKey);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedCategory = categories.find((cat) => cat.key === category);

  return (
    <div className={styles.categoryWrapper} ref={dropdownRef}>
      <label className={styles.categoryLabel}>
        Filter by category
      </label>
      <div className={styles.categoryBox}>
        <button
          className={styles.categoryButton}
          onClick={toggleDropdown}
          type="button"
        >
          <span>{selectedCategory?.name || "Select category"}</span>
          {isOpen ? (
            <FiChevronUp className={styles.icon} />
          ) : (
            <FiChevronDown className={styles.icon} />
          )}
        </button>
        {isOpen && (
          <div className={styles.dropdown}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.dropdownItem} ${
                  cat.key === category ? styles.selected : ""
                }`}
                onClick={() => onCategorySelected(cat.key)}
                type="button"
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
