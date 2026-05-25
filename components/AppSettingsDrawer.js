import { useState, useEffect } from 'react';
import styles from "../styles/appSettingsDrawer.module.scss";

const CheckboxInput = ({ id, checked, onChange, label }) => {
    return (
        <label htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <p>{label} <code>{id}</code></p>
        </label>
    );
};

const RadioInput = ({ name, value, checked, onChange, label }) => {
    return (
        <label>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
            />
            <p>{label}</p>
        </label>
    );
};

const TextInput = ({ id, value, onChange, placeholder, label }) => {
    return (
        <label htmlFor={id} className={styles.textInputLabel}>
            <p>{label} <code>{id}</code></p>
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
};

const AppSettingsDrawer = ({ app, isOpen, onClose, onConfigChange }) => {
    const [config, setConfig] = useState({
        "--scope": null,
        "-i": false,
        "-h": false,
        "-o": "",
        "--override": false,
        "-l": "",
        "--force": false
    });

    useEffect(() => {
        if (app && app.advancedConfig) {
            setConfig(app.advancedConfig);
        } else {
            setConfig({
                "--scope": null,
                "-i": false,
                "-h": false,
                "-o": "",
                "--override": false,
                "-l": "",
                "--force": false
            });
        }
    }, [app]);

    const updateConfig = (key, val) => {
        const newConfig = { ...config, [key]: val };
        setConfig(newConfig);
        onConfigChange && onConfigChange(app, newConfig);
    };

    return (
        <>
            <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}></div>
            <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" strokeWidth="2.2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <h2>Advanced Options - {app?.name}</h2>
                </div>

                <div className={styles.content}>
                    <label className={styles.radioContainer}>
                        <p>Installation scope <code>--scope</code></p>
                        <div>
                            <RadioInput name="scope" value="default" checked={config["--scope"] === null} onChange={() => updateConfig("--scope", null)} label="Default" />
                            <RadioInput name="scope" value="user" checked={config["--scope"] === "user"} onChange={(val) => updateConfig("--scope", val)} label="User" />
                            <RadioInput name="scope" value="machine" checked={config["--scope"] === "machine"} onChange={(val) => updateConfig("--scope", val)} label="Machine" />
                        </div>
                    </label>

                    <CheckboxInput
                        id="-i"
                        checked={config["-i"]}
                        onChange={(val) => updateConfig("-i", val)}
                        label="Request interactive installation; user input may be needed"
                    />
                    <CheckboxInput
                        id="-h"
                        checked={config["-h"]}
                        onChange={(val) => updateConfig("-h", val)}
                        label="Request silent installation"
                    />
                    <CheckboxInput
                        id="--override"
                        checked={config["--override"]}
                        onChange={(val) => updateConfig("--override", val)}
                        label="Override arguments to be passed on to the installer"
                    />
                    <CheckboxInput
                        id="--force"
                        checked={config["--force"]}
                        onChange={(val) => updateConfig("--force", val)}
                        label="Override the installer hash check"
                    />

                    <TextInput
                        id="-o"
                        value={config["-o"]}
                        onChange={(val) => updateConfig("-o", val)}
                        placeholder="Enter a valid path for your local machine"
                        label="Log location (if supported)"
                    />
                    <TextInput
                        id="-l"
                        value={config["-l"]}
                        onChange={(val) => updateConfig("-l", val)}
                        placeholder="Enter a valid path for your local machine"
                        label="Location to install to (if supported)"
                    />
                </div>
            </div>
        </>
    );
};

export default AppSettingsDrawer;
