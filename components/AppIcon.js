import styles from "../styles/singleApp.module.scss";
import popularAppsList from "../data/popularApps.json";
import categoryAppsList from "../data/categoryApps.json";
import { useState, useEffect } from "react";

const AppIcon = ({id, name, icon, iconUrl, iconPng}) => {
    const [apiBase, setApiBase] = useState('');

    //console.log("AppIcon props:", {id, name, icon, iconUrl, iconPng});

    // if the app is listed in popularApps or categoryApps, use the image specified there
    const targetApp =
      Object.values(popularAppsList).find((app) => app._id === id) ||
      Object.values(categoryAppsList).flat().find((app) => app._id === id);
    if (targetApp) {
      //console.log("Found app in popular/category lists:", targetApp);
      return (
        <AppPicture
          name={name}
          srcSetPng={`/assets/apps/fallback/${targetApp.img.replace("webp", "png")}`}
          srcSetWebp={`/assets/apps/${targetApp.img}`}
        />
      );
    }

    // Use pre-rendered URLs from ISR (priority before icon check)
    if (iconUrl && iconPng) {
        return (
          <AppPicture
            name={name}
            srcSetPng={iconPng}
            srcSetWebp={iconUrl}
          />
        );
    }

    // If no icon field, return generic icon
    if(!icon) {
        return (
          <img
              src="/generic-app-icon.svg"
              alt="Package icon"
              // Specify the size to avoid Cumulative Layout Shift:
              width="25"
              height="25"
            />
        );
    }

    // If icon is external URL
    if (icon.startsWith("http")) {
      return (
        <img
          src={icon}
          draggable={false}
          alt={`Logo for ${name}`}
          loading="lazy"
          decoding="async"
          // Specify the size to avoid Cumulative Layout Shift:
          width="25"
          height="25"
        />
      );
    }

    // For API-hosted icons, remove .png extension
    icon = icon.replace(".png", "")

    return (
      <AppPicture
        name={name}
        srcSetPng={`${process.env.NEXT_PUBLIC_WINSTALL_API_BASE}/icons/${icon}.png`}
        srcSetWebp={`${process.env.NEXT_PUBLIC_WINSTALL_API_BASE}/icons/next/${icon}.webp`}
      />
    );
}

const AppPicture = ({ name, srcSetPng, srcSetWebp }) => {
  return (
    <picture>
      <source srcSet={srcSetWebp} type="image/webp" />
      <source srcSet={srcSetPng} type="image/png" />
      <img
        src={srcSetPng}
        alt={`Logo for ${name}`}
        draggable={false}
        loading="lazy"
        decoding="async"
        // Specify the size to avoid Cumulative Layout Shift:
        width="25"
        height="25"
      />
    </picture>
  );
}

export default AppIcon;