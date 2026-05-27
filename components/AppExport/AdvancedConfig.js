import { useState, useEffect } from 'react';
import { FiChevronDown, FiInfo } from "react-icons/fi";
import styles from "../../styles/exportApps.module.scss";
import { CheckboxConfig, RadioConfig, TextInputConfig } from "./InputComponents";

const AdvancedConfig = ({ refreshConfig, activeTab }) => {
    const [ expanded, setExpnaded ] = useState(false);

    const [ config, setConfig ] = useState({
        "--scope": "",
        "--interactive": false,
        "--silent": true,
        "--log": "",
        "--override": "",
        "--location": "",
        "--force": false,
        "--ignore-unavailable": false
    });

    const [ hiddenOptions, setHiddenOptions ] = useState([]);

    const updateConfig = async (key, val) => {
        const newConfig = { ...config, [key]: val};

        if (key === "--interactive") {
            newConfig["--silent"] = !val;
        }

        setConfig(newConfig);
        refreshConfig(newConfig, hiddenOptions);

        await localStorage.setItem("winstall-advanced-config", JSON.stringify(newConfig));
    }

    useEffect(() => {
        const loadExistingConfig = async (unavailableOptions) => {
            let previousConfig = await localStorage.getItem("winstall-advanced-config")

            if(previousConfig){
                previousConfig = JSON.parse(previousConfig);
                setExpnaded(true);
            } else{
                previousConfig = { ...config };
            }

            refreshConfig(previousConfig, unavailableOptions);
            setConfig(previousConfig);
        }


        let unavailableOptions = [];

        if (activeTab === ".json") {
            unavailableOptions = ["--scope", "--interactive", "--silent", "--log", "--override", "--location", "--force"];
        } else if(activeTab === ".installer") {
            unavailableOptions = ["--ignore-unavailable"];
        } else {
            unavailableOptions = ["--ignore-unavailable"];
        }

        setHiddenOptions(unavailableOptions);
        loadExistingConfig(unavailableOptions);

    }, [ activeTab ]);


    return (
        <div className={styles.expandBlock}>
            <h3 className={`${styles.expandHeader} ${ expanded ? styles.expandedHeader : ''}`} onClick={() => setExpnaded(e => !e)}>
                <FiChevronDown size={22} className={expanded ? styles.expandedIcon : ''}/>
                Advanced Options
            </h3>

            { expanded && (
                <div>
                    <p className={styles.center}><FiInfo/> All of the following options are persisted locally in your browser.</p>

                    <RadioConfig
                        id="--scope"
                        defaultChecked={config["--scope"]}
                        options={[{ id: "", label: "Default" }, { id: "user", label: "User" }, { id: "machine", label: "Machine" }]}
                        updateConfig={updateConfig}
                        hiddenOptions={hiddenOptions}
                        labelText="Installation scope"
                    />

                    <CheckboxConfig id="--interactive" defaultChecked={config["--interactive"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Request interactive installation; user input may be needed"/>
                    <CheckboxConfig id="--force" defaultChecked={config["--force"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Override the installer hash check"/>

                    <TextInputConfig id="--override" defaultValue={config["--override"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Override arguments to be passed on to the installer" inputPlaceholder="Enter arguments for installer"/>
                    <TextInputConfig id="--log" defaultValue={config["--log"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Log location (if supported)" inputPlaceholder="Enter a valid file path for your local machine"/>
                    <TextInputConfig id="--location" defaultValue={config["--location"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Location to install to (if supported)" inputPlaceholder="Enter a valid folder path for your local machine"/>

                    <CheckboxConfig id="--ignore-unavailable" defaultChecked={config["--ignore-unavailable"]} updateConfig={updateConfig} hiddenOptions={hiddenOptions} labelText="Ignore unavailable packages "/>
                </div>
            )}
        </div>
    )
}

export default AdvancedConfig;