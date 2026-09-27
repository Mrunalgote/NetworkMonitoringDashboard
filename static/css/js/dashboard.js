/* ============================================================
   NETMONITOR DASHBOARD
   ------------------------------------------------------------
   This file only handles dashboard data.
   It does not change the visual design.
============================================================ */


/* ============================================================
   HELPER
============================================================ */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   NUMBER HELPER
============================================================ */

function getNumber(...values) {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !Number.isNaN(Number(value))
        ) {

            return Number(value);

        }

    }

    return 0;

}


/* ============================================================
   FORMAT BYTES
============================================================ */

function formatMB(bytes) {

    const value =
        Number(bytes || 0) /
        (1024 * 1024);

    return value.toFixed(2) + " MB";

}


/* ============================================================
   LOAD SYSTEM DATA
============================================================ */

async function loadSystemData() {

    try {

        const response =
            await fetch(
                "/api/system",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "System API error"
            );

        }


        const data =
            await response.json();


        const cpu =
            getNumber(
                data.cpu,
                data.cpu_percent,
                data.cpu_usage
            );


        const memory =
            getNumber(
                data.memory,
                data.memory_percent,
                data.memory_usage
            );


        const disk =
            getNumber(
                data.disk,
                data.disk_percent,
                data.disk_usage
            );


        setText(
            "cpu-value",
            cpu.toFixed(1) + "%"
        );


        setText(
            "memory-value",
            memory.toFixed(1) + "%"
        );


        setText(
            "system-cpu",
            cpu.toFixed(1) + "%"
        );


        setText(
            "system-memory",
            memory.toFixed(1) + "%"
        );


        setText(
            "system-disk",
            disk.toFixed(1) + "%"
        );


    }

    catch (error) {

        console.error(
            "System data error:",
            error
        );

    }

}


/* ============================================================
   LOAD NETWORK DATA
============================================================ */

async function loadNetworkData() {

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


        const received =
            getNumber(
                data.bytes_received,
                data.received,
                data.download
            );


        const sent =
            getNumber(
                data.bytes_sent,
                data.sent,
                data.upload
            );


        const total =
            received + sent;


        setText(
            "download-value",
            formatMB(received)
        );


        setText(
            "upload-value",
            formatMB(sent)
        );


        setText(
            "total-traffic",
            formatMB(total)
        );


    }

    catch (error) {

        console.error(
            "Network data error:",
            error
        );

    }

}


/* ============================================================
   LOAD DEVICES
============================================================ */

async function loadDeviceData() {

    try {

        const response =
            await fetch(
                "/api/devices",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Devices API error"
            );

        }


        const data =
            await response.json();


        let devices;


        if (Array.isArray(data)) {

            devices = data;

        }

        else if (
            data &&
            Array.isArray(data.devices)
        ) {

            devices =
                data.devices;

        }

        else {

            devices = [];

        }


        setText(
            "device-count",
            devices.length
        );


    }

    catch (error) {

        console.error(
            "Device data error:",
            error
        );

    }

}


/* ============================================================
   NETWORK STATUS
============================================================ */

function updateNetworkStatus() {

    setText(
        "network-status",
        "Online"
    );

}


/* ============================================================
   UPDATE TIME
============================================================ */

function updateTime() {

    const now =
        new Date();


    setText(
        "last-updated",
        now.toLocaleTimeString()
    );

}


/* ============================================================
   LOAD EVERYTHING
============================================================ */

async function loadDashboard() {

    await Promise.all([

        loadSystemData(),

        loadNetworkData(),

        loadDeviceData()

    ]);


    updateNetworkStatus();

    updateTime();

}


/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();


        /*
         * Refresh every 2 seconds.
         *
         * This keeps the dashboard live without
         * creating unnecessary animation or lag.
         */

        setInterval(
            loadDashboard,
            2000
        );

    }
);