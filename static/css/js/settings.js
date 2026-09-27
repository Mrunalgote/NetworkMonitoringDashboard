/* ============================================================
NETMONITOR GLOBAL SETTINGS
Controls settings across the complete website
============================================================ */

const NETMONITOR_DEFAULT_SETTINGS = {
theme: "light",
autoRefresh: true,
refreshInterval: 10,
notifications: false,
cpuThreshold: 80,
memoryThreshold: 80,
diskThreshold: 80,
networkThreshold: 100
};

/* ============================================================
GET SETTINGS
============================================================ */

function getNetMonitorSettings() {

```
try {

    const saved =
        localStorage.getItem("netmonitorSettings");

    if (!saved) {

        return {
            ...NETMONITOR_DEFAULT_SETTINGS
        };

    }

    const settings = JSON.parse(saved);

    return {
        ...NETMONITOR_DEFAULT_SETTINGS,
        ...settings
    };

} catch (error) {

    console.error(
        "Unable to read NetMonitor settings:",
        error
    );

    return {
        ...NETMONITOR_DEFAULT_SETTINGS
    };
}
```

}

/* ============================================================
APPLY THEME
============================================================ */

function applyNetMonitorTheme() {

```
const settings =
    getNetMonitorSettings();

if (settings.theme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

} else {

    document.body.classList.remove(
        "dark-mode"
    );
}
```

}

/* ============================================================
AUTO REFRESH
============================================================ */

function isNetMonitorAutoRefreshEnabled() {

```
const settings =
    getNetMonitorSettings();

return settings.autoRefresh === true;
```

}

/* ============================================================
REFRESH INTERVAL
Returns milliseconds
============================================================ */

function getNetMonitorRefreshInterval() {

```
const settings =
    getNetMonitorSettings();

const seconds =
    Number(settings.refreshInterval);

if (
    !Number.isFinite(seconds) ||
    seconds < 1
) {

    return 10000;

}

return seconds * 1000;
```

}

/* ============================================================
REFRESH INTERVAL IN SECONDS
============================================================ */

function getNetMonitorRefreshSeconds() {

```
const settings =
    getNetMonitorSettings();

const seconds =
    Number(settings.refreshInterval);

if (
    !Number.isFinite(seconds) ||
    seconds < 1
) {

    return 10;

}

return seconds;
```

}

/* ============================================================
ALERT THRESHOLDS
============================================================ */

function getNetMonitorThresholds() {

```
const settings =
    getNetMonitorSettings();

return {

    cpu:
        Number(settings.cpuThreshold) || 80,

    memory:
        Number(settings.memoryThreshold) || 80,

    disk:
        Number(settings.diskThreshold) || 80,

    network:
        Number(settings.networkThreshold) || 100

};
```

}

/* ============================================================
BROWSER NOTIFICATIONS
============================================================ */

function isNetMonitorNotificationsEnabled() {

```
const settings =
    getNetMonitorSettings();

return settings.notifications === true;
```

}

/* ============================================================
SHOW NOTIFICATION
============================================================ */

function showNetMonitorNotification(
title,
message
) {

```
if (
    !isNetMonitorNotificationsEnabled()
) {

    return;

}

if (
    !("Notification" in window)
) {

    return;

}

if (
    Notification.permission !== "granted"
) {

    return;

}

try {

    new Notification(
        title,
        {
            body: message,
            icon: "/static/favicon.ico"
        }
    );

} catch (error) {

    console.log(
        "Unable to show notification:",
        error
    );

}
```

}

/* ============================================================
APPLY SETTINGS WHEN PAGE LOADS
============================================================ */

document.addEventListener(
"DOMContentLoaded",
function() {

```
    applyNetMonitorTheme();

}
```

);

/* ============================================================
APPLY THEME WHEN SETTINGS CHANGE
Works between browser tabs/pages
============================================================ */

window.addEventListener(
"storage",
function(event) {

```
    if (
        event.key === "netmonitorSettings"
    ) {

        applyNetMonitorTheme();

    }

}
```

);
