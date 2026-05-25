import Link from "next/link";
import MetaTags from "../components/MetaTags";
import Footer from "../components/Footer";
import styles from "../styles/compareDetail.module.scss";

function CompareTabs({ active }) {
  const tabs = [
    { label: "vs Ninite", page: "/compare-ninite" },
    { label: "vs UniGetUI", page: "/compare-unigetui" },
    { label: "vs Chocolatey", page: "/compare-chocolatey" },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.page}
          className={`${styles.tab} ${tab.page === active ? styles.active : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

function StatusCell({ text, positive }) {
  return (
    <div className={styles.statusCell}>
      <span className={`${styles.statusIcon} ${positive ? styles.positive : styles.negative}`}>
        {positive ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        )}
      </span>
      <span className={styles.statusText}>{text}</span>
    </div>
  );
}

const NINITE_TABLE = [
  { feature: "Package Ecosystem", win: "12,000+ packages and growing", other: "Limited, ~100 popular apps" },
  { feature: "Open Source", win: "Fully open source, community driven", other: "Closed source" },
  { feature: "Community Packages", win: "Anyone can contribute packages", other: "No community contributions" },
  { feature: "Automation", win: "Export commands, share collections, scriptable", other: "Manual selections only" },
  { feature: "Discoverability", win: "Browse, search, filter 20k+ packages", other: "Fixed categories only" },
  { feature: "Developer Friendly", win: "CLI first, CI/CD ready", other: "Not designed for developers" },
  { feature: "Pricing", win: "Free, forever", other: "Free personal only, paid enterprise" },
];

const NINITE_FAQ = [
  { q: "Is Winstall.app better than Ninite?", a: "Winstall.app offers both the simplicity of Ninite through Express Setup and the flexibility of the modern Winget ecosystem. You get access to 12,000+ packages, open-source transparency, shareable install scripts, and developer-friendly automation, while still supporting quick multi-app installation similar to Ninite." },
  { q: "Can I switch from Ninite to Winstall.app?", a: "Yes. Most popular apps available on Ninite are also in the Winget repository. Just search for them on Winstall.app, build your collection, and generate the install command — no migration tool needed." },
  { q: "Is Winstall.app free?", a: "Yes, completely free and open source — no paid tiers. Ninite is free for personal use but charges for its enterprise Pro version." },
  { q: "Does Winstall.app require installation?", a: "No. Winstall.app runs entirely in your browser and generates Winget commands for your terminal. No downloads, no extra software — just Windows 10/11 with Winget." },
];

export default function CompareNinite() {
  return (
    <div className={styles.detailPage}>
      <MetaTags
        title="Winstall vs Ninite - Comparison | winstall"
        path="/compare-ninite"
        desc="Compare Winstall.app with Ninite. See how the modern Winget-powered approach stacks up against the classic installer."
      />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <CompareTabs active="/compare-ninite" />
          <h1>
            Winstall.app <span>vs</span> Ninite
          </h1>
          <p>
            The simplicity of Ninite, powered by the modern Winget ecosystem — more apps, open source,
            community driven, and built for today's Windows.
          </p>
        </div>

        <div className={styles.visualCompare}>
          <div className={styles.compareLeft}>
            <div className={styles.compareHeader}>
              <span className={styles.wIcon}>W</span>
              <span>Winstall.app</span>
            </div>
            <div className={styles.codeBlock}>
              <pre>
                <span className={styles.cmd}>winget install</span> \{"\n"}
                <span className={styles.pkg}>Google.Chrome Mozilla.Firefox{"\n"}</span>
                <span className={styles.pkg}>Microsoft.VSCode 7zip.7zip{"\n"}</span>
                <span className={styles.pkg}>VideoLAN.VLC{"\n"}</span>
                <span className={styles.pkg}>Notepad++.Notepad++</span>
              </pre>
            </div>
          </div>

          <div className={styles.compareRight}>
            <div className={styles.compareHeader}>
              <span>Ninite</span>
            </div>
            <div className={styles.checklistGrid}>
              {["Chrome", "Firefox", "VLC", "7-Zip", "GIMP", "Notepad++", "Paint.NET", "WinRAR"].map((app) => (
                <div key={app} className={styles.checkItem}>
                  <span className={styles.checkbox}></span>
                  <span>{app}</span>
                </div>
              ))}
            </div>
            <div className={styles.footnote}>~100 apps total</div>
          </div>

          <div className={styles.vsIndicator}>VS</div>
        </div>
      </section>

      <section className={styles.featureComparison}>
        <div className={styles.sectionHeader}>
          <h2>Feature Comparison</h2>
          <p>See how Winstall.app compares to Ninite across the features that matter.</p>
        </div>

        <div className={styles.comparisonTable}>
          <div className={styles.tableHeader}>
            <div className={styles.colFeature}>Feature</div>
            <div className={styles.colWinstall}>Winstall.app (Winget)</div>
            <div className={styles.colOther}>Ninite</div>
          </div>
          {NINITE_TABLE.map((row) => (
            <div key={row.feature} className={styles.tableRow}>
              <div className={styles.colFeature}>{row.feature}</div>
              <div className={styles.colWinstall}>
                <StatusCell text={row.win} positive={true} />
              </div>
              <div className={styles.colOther}>
                <StatusCell text={row.other} positive={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {NINITE_FAQ.map((item) => (
            <div key={item.q} className={styles.faqCard}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2>Ready to try the modern way?</h2>
          <p>
            Join thousands of users who prefer the Winget-powered approach to installing apps on Windows.
          </p>
          <a href="/" className={styles.ctaButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Open Winstall.app
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
