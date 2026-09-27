/* =========================================================
   NETMONITOR - DEVICES
   ========================================================= */

async function loadDevices() {

    try {

        const response = await fetch(
            "/api/devices",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Device API error");
        }

        const data = await response.json();

        const devices =
            Array.isArray(data)
                ? data
                : (data.devices || []);

        console.log(
            "Devices loaded:",
            devices
        );

        renderDevices(devices);

    } catch (error) {

        console.error(
            "Devices error:",
            error
        );

    }
}


/* =========================================================
   RENDER DEVICES
   ========================================================= */

function renderDevices(devices) {

    const container =
        document.getElementById(
            "devices-container"
        );

    if (!container) {
        return;
    }

    if (devices.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No devices detected.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    devices.forEach(
        (device, index) => {

            const name =
                device.name ||
                device.hostname ||
                `Device ${index + 1}`;

            const ip =
                device.ip_address ||
                device.ip ||
                device.address ||
                "N/A";

            const status =
                device.status ||
                device.state ||
                "Online";

            const card =
                document.createElement("div");

            card.className = "device-card";

            card.innerHTML = `
                <div class="device-name">
                    ${name}
                </div>

                <div class="device-ip">
                    ${ip}
                </div>

                <div class="device-status">
                    ${status}
                </div>
            `;

            container.appendChild(card);

        }
    );

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDevices();

        setInterval(
            loadDevices,
            3000
        );

    }
);