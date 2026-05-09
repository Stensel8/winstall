import styles from "../styles/home.module.scss";

import categoryAppsList from "../data/categoryApps.json";

import CategorySearch from "../components/CategorySearch";
import { ListCategory } from "../components/ListCategory";
import Categories from "../components/Categories";
import MetaTags from "../components/MetaTags";

import Footer from "../components/Footer";
import Error from "../components/Error";
import { useState } from "react";

const categoryNames = {
  "all": "All",
  "browser": "Web Browsers",
  "communication": "Communication",
  "social_media": "Social Media",
  "productivity": "Productivity",
  "documents": "Office & Documents",
  "collaboration": "Meeting & Collaboration",
  "cloud_storage": "Cloud Storage & Sync",
  "development": "Developer Tools",
  "entertainment": "Media & Entertainment",
  "utilities": "Utilities"
};

function ExpressSetup({ error }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  if (error) {
    return <Error title="Oops!" subtitle={error} />;
  }

  // Prepare categories list for ListCategory component
  const categoriesList = [
    { key: "all", name: categoryNames["all"] },
    ...Object.entries(categoryAppsList)
      .filter(([key, apps]) => Array.isArray(apps) && apps.length > 0)
      .map(([key, apps]) => ({
        key,
        name: categoryNames[key] || key
      }))
  ];

  return (
    <div>
      <MetaTags title="Pick the apps you want - winstall" path="/express" />
      <div className={styles.intro}>
        <div className="illu-box">
          <div>
            <h1>Pick the apps you want</h1>
            <p className={styles.lead}>Here are the most popular apps, you can pick and install them instantly.</p>
            <div className={styles.searchFilters}>
              <CategorySearch
                onFilter={(q) => setSearchInput(q)}
                label="Search for apps"
                placeholder={"Enter you search term here"}
              />
              <ListCategory
                categories={categoriesList}
                defaultCategory="all"
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
          <div className="art">
              <img
                src="/assets/logo.svg"
                draggable={false}
                alt="winstall logo"
              />
            </div>
        </div>
      </div>

      {Object.entries(categoryAppsList).map(([key, apps]) => {
        if (!Array.isArray(apps) || apps.length === 0) return null;

        // Filter by selected category
        if (selectedCategory !== "all" && key !== selectedCategory) return null;

        // Filter apps by search input
        let filteredApps = apps;
        if (searchInput && searchInput.trim()) {
          const searchTerm = searchInput.toLowerCase().trim();
          filteredApps = apps.filter(app =>
            app.name && app.name.toLowerCase().includes(searchTerm)
          );
        }

        // Skip categories with no matching apps
        if (filteredApps.length === 0) return null;

        const categoryName = categoryNames[key] || key;

        return (
          <Categories
            key={key}
            apps={filteredApps}
            category={categoryName}
          />
        );
      })}

      <Footer />
    </div>
  );
}

export async function getStaticProps(){
  return {
    props: {}
  };
}

export default ExpressSetup;
