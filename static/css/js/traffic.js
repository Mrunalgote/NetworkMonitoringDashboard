/* =========================================================
   NETMONITOR - NETWORK TRAFFIC
   ========================================================= */

let trafficTimer = null;


/* =========================================================
   LOAD NETWORK DATA
   ========================================================= */

async function loadTrafficData() {

    try {

        const response =
            await fetch(
                "/api/network",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Network API error"
            );
        }

        const data =
            await response.json();

        updateTrafficValues(data);

    } catch (error) {

        console.error(
            "Traffic error:",
            error
        );

    }

}


/* =========================================================
   UPDATE VALUES
   ========================================================= */

function updateTrafficValues(data) {

    const received =
        Number(
            data.bytes_received ??
            data.received ??
            0
        );

    const sent =
        Number(
            data.bytes_sent ??
            data.sent ??
            0
        );

    const download =
        document.getElementById(
            "download"
        );

    const upload =
        document.getElementById(
            "upload"
        );

    if (download) {

        download.textContent =
            formatTraffic(received);

    }

    if (upload) {

        upload.textContent =
            formatTraffic(sent);

    }

}


/* =========================================================
   FORMAT
   ========================================================= */

function formatTraffic(bytes) {

    const mb =
        Number(bytes || 0) /
        (1024 * 1024);

    return mb.toFixed(2) + " MB";

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTrafficData();

        trafficTimer =
            setInterval(
                loadTrafficData,
                2000
            );

    }
);