/* =========================================================
   NETMONITOR - ALERTS
   ========================================================= */

async function checkAlerts() {

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
                "Alert API error"
            );
        }

        const data =
            await response.json();

        const cpu =
            Number(
                data.cpu ??
                data.cpu_percent ??
                data.cpu_usage ??
                0
            );

        const memory =
            Number(
                data.memory ??
                data.memory_percent ??
                data.memory_usage ??
                0
            );

        const disk =
            Number(
                data.disk ??
                data.disk_percent ??
                data.disk_usage ??
                0
            );

        const settings =
            getAlertSettings();

        updateAlert(
            "CPU",
            cpu,
            settings.cpuThreshold
        );

        updateAlert(
            "Memory",
            memory,
            settings.memoryThreshold
        );

        updateAlert(
            "Disk",
            disk,
            settings.diskThreshold
        );

    } catch (error) {

        console.error(
            "Alerts error:",
            error
        );

    }

}


/* =========================================================
   SETTINGS
   ========================================================= */

function getAlertSettings() {

    const defaults = {

        cpuThreshold: 80,

        memoryThreshold: 80,

        diskThreshold: 80

    };

    try {

        const saved =
            localStorage.getItem(
                "netmonitorSettings"
            );

        if (!saved) {
            return defaults;
        }

        return {
            ...defaults,
            ...JSON.parse(saved)
        };

    } catch {

        return defaults;

    }

}


/* =========================================================
   UPDATE ALERT
   ========================================================= */

function updateAlert(
    name,
    value,
    threshold
) {

    const id =
        "alert-" +
        name.toLowerCase();

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    if (value >= threshold) {

        element.textContent =
            `${name} usage is high (${value.toFixed(1)}%)`;

        element.classList.add(
            "alert-danger"
        );

    } else {

        element.textContent =
            `${name} usage is normal (${value.toFixed(1)}%)`;

        element.classList.remove(
            "alert-danger"
        );

    }

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAlerts();

        setInterval(
            checkAlerts,
            3000
        );

    }
);