from flask import Flask, render_template, jsonify
import psutil
import socket
import platform
import time

app = Flask(__name__)


# ============================================================
# PAGE ROUTES
# ============================================================

@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/devices")
def devices():
    return render_template("devices.html")


@app.route("/traffic")
def traffic():
    return render_template("traffic.html")


@app.route("/performance")
def performance():
    return render_template("performance.html")


@app.route("/alerts")
def alerts():
    return render_template("alerts.html")


@app.route("/reports")
def reports():
    return render_template("reports.html")


@app.route("/settings")
def settings():
    return render_template("settings.html")


# ============================================================
# SYSTEM API
# Used by Dashboard + Performance
# ============================================================

@app.route("/api/system")
def api_system():

    # CPU
    cpu = psutil.cpu_percent(interval=0.1)

    # MEMORY
    memory = psutil.virtual_memory()

    # DISK
    disk = psutil.disk_usage("/")

    # Convert memory to GB
    memory_total_gb = round(
        memory.total / (1024 ** 3), 2
    )

    memory_used_gb = round(
        memory.used / (1024 ** 3), 2
    )

    memory_available_gb = round(
        memory.available / (1024 ** 3), 2
    )

    # Convert disk to GB
    disk_total_gb = round(
        disk.total / (1024 ** 3), 2
    )

    disk_used_gb = round(
        disk.used / (1024 ** 3), 2
    )

    disk_free_gb = round(
        disk.free / (1024 ** 3), 2
    )

    return jsonify({

        # ----------------------------------------------------
        # CPU
        # ----------------------------------------------------

        "cpu": cpu,
        "cpu_percent": cpu,
        "cpu_usage": cpu,

        # ----------------------------------------------------
        # MEMORY PERCENT
        # ----------------------------------------------------

        "memory": memory.percent,
        "memory_percent": memory.percent,
        "memory_usage": memory.percent,

        # ----------------------------------------------------
        # MEMORY BYTES
        # ----------------------------------------------------

        "memory_total": memory.total,
        "memory_used": memory.used,
        "memory_available": memory.available,

        # ----------------------------------------------------
        # MEMORY GB
        # ----------------------------------------------------

        "memory_total_gb": memory_total_gb,
        "memory_used_gb": memory_used_gb,
        "memory_available_gb": memory_available_gb,

        # ----------------------------------------------------
        # RAM ALIASES
        # ----------------------------------------------------

        "ram_total": memory_total_gb,
        "ram_used": memory_used_gb,
        "ram_available": memory_available_gb,

        # ----------------------------------------------------
        # DISK PERCENT
        # ----------------------------------------------------

        "disk": disk.percent,
        "disk_percent": disk.percent,
        "disk_usage": disk.percent,

        # ----------------------------------------------------
        # DISK BYTES
        # ----------------------------------------------------

        "disk_total": disk.total,
        "disk_used": disk.used,
        "disk_free": disk.free,

        # ----------------------------------------------------
        # DISK GB
        # ----------------------------------------------------

        "disk_total_gb": disk_total_gb,
        "disk_used_gb": disk_used_gb,
        "disk_free_gb": disk_free_gb

    })


# ============================================================
# NETWORK API
# ============================================================

@app.route("/api/network")
def api_network():

    counters = psutil.net_io_counters()

    return jsonify({

        # Bytes
        "bytes_received": counters.bytes_recv,
        "bytes_sent": counters.bytes_sent,

        # Alternative names
        "received": counters.bytes_recv,
        "sent": counters.bytes_sent,

        # Packets
        "packets_received": counters.packets_recv,
        "packets_sent": counters.packets_sent,

        "timestamp": time.time()

    })


# ============================================================
# NETWORK TRAFFIC API
# ============================================================

@app.route("/api/traffic")
def api_traffic():

    counters = psutil.net_io_counters()

    return jsonify({

        "timestamp": time.time(),

        "bytes_sent": counters.bytes_sent,

        "bytes_recv": counters.bytes_recv,

        "bytes_received": counters.bytes_recv,

        "packets_sent": counters.packets_sent,

        "packets_recv": counters.packets_recv,

        "packets_received": counters.packets_recv

    })


# ============================================================
# DEVICES API
# ============================================================

@app.route("/api/devices")
def api_devices():

    devices = []

    hostname = socket.gethostname()


    # ========================================================
    # LOCAL COMPUTER IP
    # ========================================================

    try:

        local_ip = socket.gethostbyname(hostname)

    except Exception:

        local_ip = "127.0.0.1"


    # ========================================================
    # LOCAL COMPUTER
    # ========================================================

    devices.append({

        "id": 1,

        "name": hostname,

        "hostname": hostname,

        "ip": local_ip,

        "ip_address": local_ip,

        "address": local_ip,

        "type": "Computer",

        "device_type": "Computer",

        "interface": "Local System",

        "status": "Online",

        "state": "Online"

    })


    # ========================================================
    # NETWORK INTERFACES
    # ========================================================

    try:

        interfaces = psutil.net_if_addrs()

        stats = psutil.net_if_stats()

        device_id = 2


        for interface_name, addresses in interfaces.items():

            ipv4 = None

            mac = None


            # ------------------------------------------------
            # Find IPv4 and MAC
            # ------------------------------------------------

            for address in addresses:

                if address.family == socket.AF_INET:

                    ipv4 = address.address

                elif getattr(
                    psutil,
                    "AF_LINK",
                    None
                ) == address.family:

                    mac = address.address


            # No IPv4 = skip
            if ipv4 is None:
                continue


            # Skip loopback
            if ipv4 == "127.0.0.1":
                continue


            # ------------------------------------------------
            # Interface status
            # ------------------------------------------------

            is_up = False


            if interface_name in stats:

                is_up = stats[
                    interface_name
                ].isup


            # ------------------------------------------------
            # Don't duplicate local computer
            # ------------------------------------------------

            if ipv4 == local_ip:

                continue


            # ------------------------------------------------
            # Add interface as device
            # ------------------------------------------------

            devices.append({

                "id": device_id,

                "name": interface_name,

                "hostname": interface_name,

                "ip": ipv4,

                "ip_address": ipv4,

                "address": ipv4,

                "mac": mac if mac else "N/A",

                "type": "Network Interface",

                "device_type": "Network Interface",

                "interface": interface_name,

                "status":
                    "Online"
                    if is_up
                    else "Offline",

                "state":
                    "Online"
                    if is_up
                    else "Offline"

            })


            device_id += 1


    except Exception as error:

        print(
            "Device detection error:",
            error
        )


    # ========================================================
    # RETURN BOTH FORMATS
    #
    # devices.html uses data.devices
    # dashboard.html can use data directly
    # ========================================================

    return jsonify({

        "devices": devices,

        "total": len(devices),

        "interface_count":
            len(
                psutil.net_if_addrs()
            )

    })


# ============================================================
# NETWORK INTERFACES API
# ============================================================

@app.route("/api/interfaces")
def api_interfaces():

    interfaces = []

    try:

        addresses = psutil.net_if_addrs()

        stats = psutil.net_if_stats()


        for name, addr_list in addresses.items():

            ipv4 = "N/A"

            mac = "N/A"


            # ------------------------------------------------
            # Find addresses
            # ------------------------------------------------

            for addr in addr_list:

                if addr.family == socket.AF_INET:

                    ipv4 = addr.address

                elif getattr(
                    psutil,
                    "AF_LINK",
                    None
                ) == addr.family:

                    mac = addr.address


            # ------------------------------------------------
            # Interface status
            # ------------------------------------------------

            is_up = False

            speed = 0


            if name in stats:

                is_up = stats[name].isup

                speed = stats[name].speed


            interfaces.append({

                "name": name,

                "ip": ipv4,

                "address": ipv4,

                "mac": mac,

                "status":
                    "Up"
                    if is_up
                    else "Down",

                "state":
                    "Up"
                    if is_up
                    else "Down",

                "speed": speed

            })


    except Exception as error:

        return jsonify({

            "error": str(error)

        }), 500


    return jsonify(interfaces)


# ============================================================
# PERFORMANCE API
# ============================================================

@app.route("/api/performance")
def api_performance():

    # CPU
    cpu = psutil.cpu_percent(interval=0.1)

    # Memory
    memory = psutil.virtual_memory()

    # Disk
    disk = psutil.disk_usage("/")


    # ========================================================
    # CPU FREQUENCY
    # ========================================================

    try:

        cpu_frequency = psutil.cpu_freq()

        if cpu_frequency:

            frequency = round(
                cpu_frequency.current,
                2
            )

        else:

            frequency = 0

    except Exception:

        frequency = 0


    # ========================================================
    # CPU CORES
    # ========================================================

    physical_cores = psutil.cpu_count(
        logical=False
    )

    logical_cores = psutil.cpu_count(
        logical=True
    )


    # ========================================================
    # MEMORY
    # ========================================================

    total_memory = memory.total

    used_memory = memory.used

    available_memory = memory.available


    total_memory_gb = round(
        total_memory / (1024 ** 3),
        2
    )

    used_memory_gb = round(
        used_memory / (1024 ** 3),
        2
    )

    available_memory_gb = round(
        available_memory / (1024 ** 3),
        2
    )


    # ========================================================
    # DISK
    # ========================================================

    total_disk_gb = round(
        disk.total / (1024 ** 3),
        2
    )

    used_disk_gb = round(
        disk.used / (1024 ** 3),
        2
    )

    free_disk_gb = round(
        disk.free / (1024 ** 3),
        2
    )


    return jsonify({

        # ----------------------------------------------------
        # CPU
        # ----------------------------------------------------

        "cpu": cpu,

        "cpu_usage": cpu,

        "cpu_percent": cpu,


        # ----------------------------------------------------
        # MEMORY
        # ----------------------------------------------------

        "memory": memory.percent,

        "memory_usage": memory.percent,

        "memory_percent": memory.percent,

        "ram": memory.percent,

        "ram_usage": memory.percent,


        # ----------------------------------------------------
        # MEMORY BYTES
        # ----------------------------------------------------

        "memory_total": total_memory,

        "memory_used": used_memory,

        "memory_available":
            available_memory,


        # ----------------------------------------------------
        # MEMORY GB
        # ----------------------------------------------------

        "memory_total_gb":
            total_memory_gb,

        "memory_used_gb":
            used_memory_gb,

        "memory_available_gb":
            available_memory_gb,


        # ----------------------------------------------------
        # RAM GB
        # ----------------------------------------------------

        "ram_total":
            total_memory_gb,

        "ram_used":
            used_memory_gb,

        "ram_available":
            available_memory_gb,


        # ----------------------------------------------------
        # DISK
        # ----------------------------------------------------

        "disk": disk.percent,

        "disk_usage": disk.percent,

        "disk_percent": disk.percent,


        # ----------------------------------------------------
        # DISK BYTES
        # ----------------------------------------------------

        "disk_total": disk.total,

        "disk_used": disk.used,

        "disk_free": disk.free,


        # ----------------------------------------------------
        # DISK GB
        # ----------------------------------------------------

        "disk_total_gb":
            total_disk_gb,

        "disk_used_gb":
            used_disk_gb,

        "disk_free_gb":
            free_disk_gb,


        # ----------------------------------------------------
        # CPU FREQUENCY
        # ----------------------------------------------------

        "frequency":
            frequency,

        "cpu_frequency":
            frequency,


        # ----------------------------------------------------
        # CPU CORES
        # ----------------------------------------------------

        "physical_cores":
            physical_cores,

        "logical_cores":
            logical_cores,

        "cpu_cores":
            logical_cores

    })


# ============================================================
# HOST INFORMATION
# ============================================================

@app.route("/api/host")
def api_host():

    hostname = socket.gethostname()


    try:

        ip_address = socket.gethostbyname(
            hostname
        )

    except Exception:

        ip_address = "127.0.0.1"


    return jsonify({

        "hostname": hostname,

        "ip": ip_address,

        "platform": platform.system(),

        "processor": platform.processor(),

        "machine": platform.machine(),

        "python": platform.python_version()

    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health")
def api_health():

    return jsonify({

        "status": "online",

        "message":
            "Network Monitoring Dashboard is running"

    })


# ============================================================
# 404 ERROR
# ============================================================

@app.errorhandler(404)
def page_not_found(error):

    return """
    <html>

    <head>

        <title>Page Not Found</title>

        <style>

            body {
                font-family: Arial;
                background: #f4f7fb;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
            }

            .box {
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow:
                    0 5px 20px
                    rgba(0,0,0,0.1);
            }

            h1 {
                color: #2867e8;
                font-size: 50px;
                margin: 0;
            }

            a {
                color: #2867e8;
                text-decoration: none;
            }

        </style>

    </head>

    <body>

        <div class="box">

            <h1>404</h1>

            <h2>Page Not Found</h2>

            <p>
                The requested page does not exist.
            </p>

            <a href="/">
                Return to Dashboard
            </a>

        </div>

    </body>

    </html>
    """, 404


# ============================================================
# START APPLICATION
# ============================================================

if __name__ == "__main__":

    print()
    print("==============================================")
    print("       NETMONITOR NETWORK DASHBOARD")
    print("==============================================")
    print()

    print("Dashboard:")
    print("http://127.0.0.1:5000/")
    print()

    print("Devices:")
    print("http://127.0.0.1:5000/devices")
    print()

    print("Network Traffic:")
    print("http://127.0.0.1:5000/traffic")
    print()

    print("Performance:")
    print("http://127.0.0.1:5000/performance")
    print()

    print("==============================================")
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )