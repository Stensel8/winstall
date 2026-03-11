import styles from "../styles/singleApp.module.scss";
import popularAppsList from "../data/popularApps.json";

const AppIcon = ({id, name, icon}) => {
    // if the app is listed in popularApps, use the image specified there
    const popularApps = Object.values(popularAppsList).filter((app) => app._id === id);
    if (popularApps.length === 1) {
      return (
        <AppPicture
          name={name}
          srcSetPng={`/assets/apps/fallback/${popularApps[0].img.replace("webp", "png")}`}
          srcSetWebp={`/assets/apps/${popularApps[0].img}`}
        />
      );
    }

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

    if (icon.startsWith("http")) {
      return (
        // if icon is not hosted on winstall
        icon.startsWith("http") && (
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
        )
      );
    }

    icon = icon.replace(".png", "")

    return (
      <AppPicture
        name={name}
        srcSetPng={`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/icons/${icon}.png`}
        srcSetWebp={`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/icons/next/${icon}.webp`}
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