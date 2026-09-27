/* =========================================================
   NETMONITOR - PERFORMANCE
   ========================================================= */

async function loadPerformanceData() {

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
                "Performance API error"
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

        updateValue(
            "cpu",
            cpu
        );

        updateValue(
            "memory",
            memory
        );

        updateValue(
            "disk",
            disk
        );

    } catch (error) {

        console.error(
            "Performance error:",
            error
        );

    }

}


/* =========================================================
   UPDATE VALUE
   ========================================================= */

function updateValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        Number(value).toFixed(1) + "%";

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPerformanceData();

        setInterval(
            loadPerformanceData,
            2000
        );

    }
);