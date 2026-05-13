import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import SelectedContext from "../ctx/SelectedContext";
import { withRouter } from 'next/router'

import { FiTrash, FiCodepen, FiShare } from "react-icons/fi";

function SelectionBar({ router }) {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [ hideCreatePack, setHideCreatePack ] = useState(false);
    const twitterLoginEnabled = process.env.NEXT_PUBLIC_TWITTER_LOGIN === 'true';

    useEffect(() => {
      if(router.pathname === "/packs/create"){
        setHideCreatePack(true);
      } else{
        setHideCreatePack(false);
      };
    }, [ router ])

    if(selectedApps.length === 0) return <></>;

    let handleClear = () => {
      // check if confirm exists
      // support for iOS safari
      if ('confirm' in window && typeof window.confirm === 'function'){
        if(window.confirm("Are you sure you want to unselect all the apps?")){
            setSelectedApps([]);
        }
      } else{
        setSelectedApps([]);
      }
    }

    let handleInstall = async () => {
      if (selectedApps.length === 0) {
        alert('No apps selected');
        return;
      }

      const appsPayload = selectedApps.map(app => ({
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

          // Extract filename from content-disposition header
          let filename = 'installer.exe'; // default fallback
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
      <div className="bottomBar">
        <div className="container inner">
          <div className="appPreview">
            <p>Selected {selectedApps.length} apps so far</p>
          </div>
          <div className="controls">
            <button className="clear small" onClick={() => handleClear()} title="Clear selections">
              <FiTrash />
            </button>
            { twitterLoginEnabled && !hideCreatePack && (
              <Link href="/packs/create">
                <button disabled={selectedApps.length >= 2 ? false : true}>
                  <FiShare />
                  <em>{selectedApps.length >= 2 ? "Create Pack" : `Need ${Math.abs(2 - selectedApps.length)} more ${Math.abs(2 - selectedApps.length) === 1 ? "app" : "apps"} to create a pack.`}</em>
                </button>
              </Link>
            )}
            <button onClick={handleInstall}>
              <img src="/assets/ic_install.svg" alt="Install" style={{ width: '1em', height: '1em', marginRight: '0.5em' }} />
              Install
            </button>
            <Link href="/generate">
              <button>
                <FiCodepen />
                Generate script
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
}

export default withRouter(SelectionBar);