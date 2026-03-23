import Head from "next/head";
import { buildSiteUrl, getSiteOrigin } from "../utils/helpers";

const MetaTags = ({ title, desc="Bulk install Windows apps quickly with Windows Package Manager." }) => {
  const siteOrigin = getSiteOrigin();
  const siteUrl = siteOrigin || undefined;
  const coverUrl = siteOrigin ? buildSiteUrl("/cover.png") : undefined;
  const appleTouchIcon = buildSiteUrl("/logo192.png") || "/logo192.png";
  const manifestUrl = buildSiteUrl("/manifest.json") || "/manifest.json";

    return (
      <Head>
        <title>{title}</title>
        <meta
          name="title"
          content={title}
        />
        <meta
          name="description"
          content={desc}
        ></meta>

        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#9b2eff" />

        <meta property="og:type" content="website" />
        {siteUrl && <meta property="og:url" content={siteUrl} />}
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={desc}
        />
        {coverUrl && <meta property="og:image" content={coverUrl} />}

        <meta property="twitter:card" content="summary_large_image" />
        {siteUrl && <meta property="twitter:url" content={siteUrl} />}
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:description"
          content={desc}
        />
        {coverUrl && <meta
          property="twitter:image"
          content={coverUrl}
        />}

        <link rel="apple-touch-icon" href={appleTouchIcon} />
        <link rel="manifest" href={manifestUrl} />
      </Head>
    );
}

export default MetaTags;