/* =========================================================
   NETMONITOR - REPORTS
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


function formatMB(bytes) {

    const value =
        Number(bytes || 0) /
        (1024 * 1024);

    return value.toFixed(2) + " MB";

}


/* =========================================================
   LOAD REPORT DATA
   ========================================================= */

async function loadReportData() {

    try {

        const [
            systemResponse,
            networkResponse,
            devicesResponse
        ] = await Promise.all([

            fetch(
                "/api/system",
                {
                    cache: "no-store"
                }
            ),

            fetch(
                "/api/network",
                {
                    cache: "no-store"
                }
            ),

            fetch(
                "/api/devices",
                {
                    cache: "no-store"
                }
            )

        ]);


        if (
            !systemResponse.ok ||
            !networkResponse.ok ||
            !devicesResponse.ok
        ) {

            throw new Error(
                "Report API error"
            );

        }


        const system =
            await systemResponse.json();

        const network =
            await networkResponse.json();

        const devices =
            await devicesResponse.json();


        const cpu =
            Number(
                system.cpu ??
                system.cpu_percent ??
                system.cpu_usage ??
                0
            );


        const memory =
            Number(
                system.memory ??
                system.memory_percent ??
                system.memory_usage ??
                0
            );


        const disk =
            Number(
                system.disk ??
                system.disk_percent ??
                system.disk_usage ??
                0
            );


        const received =
            Number(
                network.bytes_received ??
                network.received ??
                0
            );


        const sent =
            Number(
                network.bytes_sent ??
                network.sent ??
                0
            );


        const deviceList =
            Array.isArray(devices)
                ? devices
                : (
                    devices.devices || []
                );


        setText(
            "network-status",
            "Online"
        );

        setText(
            "total-devices",
            deviceList.length
        );

        setText(
            "memory-usage",
            memory.toFixed(1) + "%"
        );

        setText(
            "network-traffic",
            formatMB(
                received + sent
            )
        );


        setText(
            "report-cpu",
            cpu.toFixed(1) + "%"
        );

        setText(
            "report-memory",
            memory.toFixed(1) + "%"
        );

        setText(
            "report-disk",
            disk.toFixed(1) + "%"
        );

        setText(
            "report-download",
            formatMB(received)
        );

        setText(
            "report-upload",
            formatMB(sent)
        );

        setText(
            "last-updated",
            new Date().toLocaleTimeString()
        );


    } catch (error) {

        console.error(
            "Report Error:",
            error
        );

        setText(
            "network-status",
            "Unavailable"
        );

        setText(
            "report-status",
            "Unable to retrieve live report data."
        );

    }

}


/* =========================================================
   VIEW REPORT
   ========================================================= */

function viewReport(
    reportName
) {

    /*
       The actual report window/modal can be added
       without changing the existing page layout.
    */

    showReportModal(
        reportName
    );

}


/* =========================================================
   REPORT MODAL
   ========================================================= */

function showReportModal(
    reportName
) {

    const oldModal =
        document.getElementById(
            "reportModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "reportModal";


    modal.innerHTML = `

        <div class="report-modal-overlay">

            <div class="report-modal">

                <div class="report-modal-header">

                    <div>

                        <div class="report-modal-title">
                            ${reportName}
                        </div>

                        <div class="report-modal-subtitle">
                            NetMonitor Live Report
                        </div>

                    </div>

                    <button
                        class="report-modal-close"
                        onclick="closeReportModal()">

                        ×

                    </button>

                </div>


                <div class="report-modal-body">

                    <div class="report-modal-loading">

                        Loading current
                        ${reportName.toLowerCase()}
                        data...

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    loadModalReport(
        reportName
    );

}


/* =========================================================
   LOAD MODAL REPORT
   ========================================================= */

async function loadModalReport(
    reportName
) {

    const body =
        document.querySelector(
            ".report-modal-body"
        );

    if (!body) {
        return;
    }


    try {

        const [
            systemResponse,
            networkResponse,
            devicesResponse
        ] = await Promise.all([

            fetch("/api/system", {
                cache: "no-store"
            }),

            fetch("/api/network", {
                cache: "no-store"
            }),

            fetch("/api/devices", {
                cache: "no-store"
            })

        ]);


        const system =
            await systemResponse.json();

        const network =
            await networkResponse.json();

        const devices =
            await devicesResponse.json();


        const cpu =
            Number(
                system.cpu ??
                system.cpu_percent ??
                system.cpu_usage ??
                0
            );

        const memory =
            Number(
                system.memory ??
                system.memory_percent ??
                system.memory_usage ??
                0
            );

        const disk =
            Number(
                system.disk ??
                system.disk_percent ??
                system.disk_usage ??
                0
            );

        const received =
            Number(
                network.bytes_received ??
                network.received ??
                0
            );

        const sent =
            Number(
                network.bytes_sent ??
                network.sent ??
                0
            );

        const deviceList =
            Array.isArray(devices)
                ? devices
                : (
                    devices.devices || []
                );


        if (
            reportName ===
            "System Performance"
        ) {

            body.innerHTML = `

                <div class="modal-stat-grid">

                    <div class="modal-stat">
                        <span>CPU Usage</span>
                        <strong>
                            ${cpu.toFixed(1)}%
                        </strong>
                    </div>

                    <div class="modal-stat">
                        <span>Memory Usage</span>
                        <strong>
                            ${memory.toFixed(1)}%
                        </strong>
                    </div>

                    <div class="modal-stat">
                        <span>Disk Usage</span>
                        <strong>
                            ${disk.toFixed(1)}%
                        </strong>
                    </div>

                </div>

                <div class="modal-info">
                    Current system performance
                    information collected from
                    NetMonitor.
                </div>

            `;

        }


        else if (
            reportName ===
            "Network Traffic"
        ) {

            body.innerHTML = `

                <div class="modal-stat-grid">

                    <div class="modal-stat">
                        <span>Download</span>
                        <strong>
                            ${formatMB(received)}
                        </strong>
                    </div>

                    <div class="modal-stat">
                        <span>Upload</span>
                        <strong>
                            ${formatMB(sent)}
                        </strong>
                    </div>

                    <div class="modal-stat">
                        <span>Total</span>
                        <strong>
                            ${formatMB(
                                received + sent
                            )}
                        </strong>
                    </div>

                </div>

                <div class="modal-info">
                    Current network traffic
                    statistics.
                </div>

            `;

        }


        else {

            body.innerHTML = `

                <div class="modal-stat-grid">

                    <div class="modal-stat">

                        <span>
                            Connected Devices
                        </span>

                        <strong>
                            ${deviceList.length}
                        </strong>

                    </div>

                </div>

                <div class="modal-device-list">

                    ${
                        deviceList.length
                        ? deviceList.map(
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
                                    "Unknown";

                                return `
                                    <div class="modal-device">

                                        <strong>
                                            ${name}
                                        </strong>

                                        <span>
                                            ${ip}
                                        </span>

                                        <small>
                                            ${status}
                                        </small>

                                    </div>
                                `;

                            }
                        ).join("")
                        :
                        `
                            <div class="modal-info">
                                No devices detected.
                            </div>
                        `
                    }

                </div>

            `;

        }


    } catch (error) {

        console.error(
            "Modal report error:",
            error
        );

        body.innerHTML = `

            <div class="modal-error">

                Unable to load report data.

            </div>

        `;

    }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeReportModal() {

    const modal =
        document.getElementById(
            "reportModal"
        );

    if (modal) {
        modal.remove();
    }

}


/* =========================================================
   GENERATE FULL REPORT
   ========================================================= */

async function generateReport() {

    try {

        const [
            systemResponse,
            networkResponse,
            devicesResponse
        ] = await Promise.all([

            fetch("/api/system", {
                cache: "no-store"
            }),

            fetch("/api/network", {
                cache: "no-store"
            }),

            fetch("/api/devices", {
                cache: "no-store"
            })

        ]);


        const system =
            await systemResponse.json();

        const network =
            await networkResponse.json();

        const devices =
            await devicesResponse.json();


        const deviceList =
            Array.isArray(devices)
                ? devices
                : (
                    devices.devices || []
                );


        const cpu =
            Number(
                system.cpu ??
                system.cpu_percent ??
                system.cpu_usage ??
                0
            );

        const memory =
            Number(
                system.memory ??
                system.memory_percent ??
                system.memory_usage ??
                0
            );

        const disk =
            Number(
                system.disk ??
                system.disk_percent ??
                system.disk_usage ??
                0
            );

        const received =
            Number(
                network.bytes_received ??
                network.received ??
                0
            );

        const sent =
            Number(
                network.bytes_sent ??
                network.sent ??
                0
            );


        let report =

            "========================================\n" +

            "           NETMONITOR REPORT\n" +

            "========================================\n\n" +

            "Generated: " +
            new Date().toLocaleString() +
            "\n\n" +

            "SYSTEM PERFORMANCE\n" +

            "----------------------------------------\n" +

            "CPU Usage: " +
            cpu.toFixed(1) +
            "%\n" +

            "Memory Usage: " +
            memory.toFixed(1) +
            "%\n" +

            "Disk Usage: " +
            disk.toFixed(1) +
            "%\n\n" +

            "NETWORK TRAFFIC\n" +

            "----------------------------------------\n" +

            "Download: " +
            formatMB(received) +
            "\n" +

            "Upload: " +
            formatMB(sent) +
            "\n\n" +

            "DEVICES\n" +

            "----------------------------------------\n" +

            "Total Devices: " +
            deviceList.length +
            "\n\n";


        deviceList.forEach(
            (device, index) => {

                const name =
                    device.name ||
                    device.hostname ||
                    "Unknown";

                const ip =
                    device.ip_address ||
                    device.ip ||
                    device.address ||
                    "N/A";

                const status =
                    device.status ||
                    device.state ||
                    "Unknown";


                report +=

                    `${index + 1}. ` +

                    `${name} | ` +

                    `${ip} | ` +

                    `${status}\n`;

            }
        );


        report +=

            "\n========================================\n" +

            "          END OF REPORT\n" +

            "========================================\n";


        const blob =
            new Blob(
                [report],
                {
                    type: "text/plain"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "NetMonitor_Report.txt";


        document.body.appendChild(
            link
        );

        link.click();

        link.remove();


        URL.revokeObjectURL(
            url
        );


        setText(
            "report-status",
            "Full report generated successfully."
        );


    } catch (error) {

        console.error(
            "Generate Report Error:",
            error
        );

        setText(
            "report-status",
            "Unable to generate report."
        );

    }

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadReportData();

        setInterval(
            loadReportData,
            2000
        );

    }
);