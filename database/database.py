import sqlite3


# --------------------------------------------------
# DATABASE CONFIGURATION
# --------------------------------------------------

DATABASE = "database.db"


# --------------------------------------------------
# DATABASE CONNECTION
# --------------------------------------------------

def get_connection():
    connection = sqlite3.connect(DATABASE)

    # Allows us to access database columns by name
    connection.row_factory = sqlite3.Row

    return connection


# --------------------------------------------------
# INITIALIZE DATABASE
# --------------------------------------------------

def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()

    # --------------------------------------------------
    # DEVICES TABLE
    # --------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS devices (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            ip_address TEXT NOT NULL UNIQUE,

            device_type TEXT NOT NULL,

            description TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # --------------------------------------------------
    # MONITORING LOGS TABLE
    # --------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS monitoring_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            device_id INTEGER NOT NULL,

            ping REAL,

            packet_loss REAL,

            status TEXT,

            timestamp TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(device_id)
                REFERENCES devices(id)
        )
    """)


    # --------------------------------------------------
    # ALERTS TABLE
    # --------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            device_id INTEGER,

            message TEXT NOT NULL,

            severity TEXT NOT NULL,

            timestamp TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(device_id)
                REFERENCES devices(id)
        )
    """)


    connection.commit()

    connection.close()


# --------------------------------------------------
# ADD SAMPLE DEVICES
# --------------------------------------------------

def add_sample_devices():

    connection = get_connection()

    devices = [

        (
            "Main Router",
            "192.168.1.1",
            "Router",
            "Primary network router"
        ),

        (
            "Monitoring PC",
            "192.168.1.10",
            "Computer",
            "Computer running the monitoring dashboard"
        ),

        (
            "Local Server",
            "192.168.1.20",
            "Server",
            "Local network server"
        )

    ]


    # --------------------------------------------------
    # INSERT DEVICES
    # --------------------------------------------------

    for device in devices:

        try:

            connection.execute("""
                INSERT INTO devices
                (
                    name,
                    ip_address,
                    device_type,
                    description
                )

                VALUES (?, ?, ?, ?)
            """, device)

        except sqlite3.IntegrityError:

            # Device already exists.
            # This prevents duplicate entries.
            pass


    connection.commit()

    connection.close()