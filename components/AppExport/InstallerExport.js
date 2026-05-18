import { FiDownload, FiInfo } from "react-icons/fi";
import styles from "../../styles/exportApps.module.scss";

const InstallerExport = ({ apps, filters = {} }) => {
    const handleInstall = async () => {
        if (!apps || apps.length === 0) {
            alert('No apps selected');
            return;
        }

        const options = {};

        // Handle silent/interactive (mutually exclusive, default is silent=true)
        if (filters["-i"]) {
            options.silent = false;
        } else if (filters["-h"]) {
            options.silent = true;
        }

        if (filters["--force"]) options.force = true;
        if (filters["--scope"]) options.scope = filters["--scope"];
        if (filters["-o"]) options.log = filters["-o"];
        if (filters["-l"]) options.location = filters["-l"];
        if (filters["--override"]) options.override = filters["--override"];

        const appsPayload = apps.map(app => ({
            name: app.name,
            id: app._id,
            version: app.selectedVersion !== app.latestVersion ? app.selectedVersion : undefined,
            options
        }));

        const payload = {
            version: "0.0.1",
            apps: appsPayload
        };

        if (process.env.NODE_ENV === 'development') {
            console.log('Installing apps with payload:', JSON.stringify(payload, null, 2));
        }

        console.log('Installing apps with payload:', payload);

        try {
            const response = await fetch('/api/installer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/octet-stream')) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                let filename = 'installer.exe';
                const disposition = response.headers.get('content-disposition');
                if (disposition) {
                    const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/i);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                console.log('Installer downloaded successfully:', filename);
            } else {
                const errorText = await response.text();
                console.error('Install failed:', errorText);
                alert(`Install failed: ${errorText}`);
            }
        } catch (error) {
            console.error('Install error:', error);
            alert(`Install error: ${error.message}`);
        }
    }

    return (
        <div className={styles.generate}>
            <div className={styles.tipContainer}>
                <FiInfo/>
                <p>Download the instant installer and run!</p>
            </div>

            <div className={`box`}>
                <button className={`button dl accent`} onClick={handleInstall}>
                    <FiDownload />
                    Download installer
                </button>
            </div>
        </div>
    )
}

export default InstallerExport;
