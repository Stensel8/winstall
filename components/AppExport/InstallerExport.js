import { FiDownload, FiInfo } from "react-icons/fi";
import styles from "../../styles/exportApps.module.scss";

const InstallerExport = ({ apps }) => {
    const handleInstall = async () => {
        if (!apps || apps.length === 0) {
            alert('No apps selected');
            return;
        }

        const appsPayload = apps.map(app => ({
            name: app.name,
            id: app._id
        }));

        console.log('Installing apps:', appsPayload);

        try {
            const response = await fetch('/api/installer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appsPayload),
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
