# 🌐 Network Monitoring Dashboard

A professional web-based **Network Monitoring Dashboard** designed to monitor system performance and network activity through a centralized dashboard.

The project provides a clean dashboard interface for viewing device information, network traffic, system performance, alerts, reports, and settings.

---

## 📌 Project Overview

The Network Monitoring Dashboard is developed to provide real-time visibility into important system and network parameters.

It uses **Python, Flask, JavaScript, CSS, SQLite, and psutil** to collect and display monitoring information through a web-based interface.

The application can be deployed online so that the dashboard can be accessed from different devices using a web browser.

---

## ✨ Features

* 📊 Professional dashboard interface
* 💻 Device monitoring
* 📈 Network traffic monitoring
* ⚙️ CPU usage monitoring
* 🧠 RAM usage monitoring
* 💾 Disk usage monitoring
* 🚨 Alert monitoring
* 📑 Reports section
* ⚙️ Settings section
* 🗄️ SQLite database
* 🌐 Web-based interface
* 📱 Accessible from different devices
* 🚀 Cloud deployment support

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Jinja2 Templates

### Backend

* Python
* Flask

### Monitoring

* psutil

### Database

* SQLite

### Communication

* HTTP Requests

### Deployment

* Git
* GitHub
* Render
* Gunicorn

---

## 🧮 Algorithms / Methods Used

The project uses the following methods:

### 1. Real-Time Polling

System and network information is collected periodically to keep monitoring data updated.

### 2. Resource Utilization Calculation

CPU, RAM, and disk usage are calculated as percentages.

### 3. Network Throughput Calculation

Upload and download rates are calculated using network byte counters over a time interval.

### 4. Threshold-Based Alert Detection

Alerts can be generated when monitored values exceed predefined limits.

Example:

```text
IF CPU Usage > Threshold
    → Generate CPU Alert

IF RAM Usage > Threshold
    → Generate Memory Alert

IF Disk Usage > Threshold
    → Generate Disk Alert
```

### 5. Database CRUD Operations

SQLite is used to store and manage application data using Create, Read, Update, and Delete operations.

---

## 🏗️ Project Structure

```text
NetworkMonitoringDashboard/
│
├── app.py
├── database.db
├── requirements.txt
├── .gitignore
├── README.md
│
├── database/
│   └── database.py
│
├── monitoring/
│   ├── __init__.py
│   ├── network.py
│   └── system.py
│
├── static/
│   └── css/
│       ├── dashboard.css
│       ├── style.css
│       └── js/
│           ├── alerts.js
│           ├── dashboard.js
│           ├── devices.js
│           ├── performance.js
│           ├── reports.js
│           ├── settings.js
│           └── traffic.js
│
└── templates/
    ├── dashboard.html
    ├── devices.html
    ├── traffic.html
    ├── performance.html
    ├── alerts.html
    ├── reports.html
    └── settings.html
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mrunalgote/NetworkMonitoringDashboard.git
```

### 2. Open the project

```bash
cd NetworkMonitoringDashboard
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

### Windows

```bash
venv\Scripts\activate
```

### 5. Install dependencies

```bash
python -m pip install -r requirements.txt
```

---

## ▶️ Run the Application

Start the Flask application:

```bash
python app.py
```

The application will normally be available at:

```text
http://127.0.0.1:5000
```

Open the address in a web browser.

---

## 🌐 Deployment

The project can be deployed using **Render**.

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

After deployment, Render provides a public URL that can be opened from different devices.

---

## 📊 Dashboard Sections

### Dashboard

Provides an overview of monitoring information.

### Devices

Displays monitored device information.

### Network Traffic

Displays network activity including upload and download information.

### Performance

Displays system performance information such as CPU, RAM, and disk usage.

### Alerts

Displays monitoring alerts based on predefined thresholds.

### Reports

Provides monitoring-related information and reports.

### Settings

Provides application configuration options.

---

## 🔐 Security

The project should not store passwords, API keys, or other sensitive credentials directly in the source code.

Environment variables should be used for sensitive configuration when required.

The `.gitignore` file prevents unnecessary local files such as the Python virtual environment from being uploaded to GitHub.

---

## 🚀 Future Enhancements

Possible future improvements include:

* Real-time WebSocket monitoring
* Multiple-device monitoring
* Authentication and user accounts
* Secure API authentication
* Advanced network analytics
* Historical performance graphs
* Email/SMS alerts
* Automatic report generation
* Network anomaly detection
* Machine-learning-based monitoring
* Docker deployment
* Mobile-friendly improvements

---

## 🎓 Project Purpose

This project is developed as an academic/semester project to demonstrate practical implementation of:

* Web development
* Python programming
* Network monitoring
* System monitoring
* Database management
* Frontend development
* Backend development
* Cloud deployment

---

## 👨‍💻 Author

**Mrunal Gote**

GitHub:
https://github.com/Mrunalgote

---

## 📄 License

This project is intended for educational and academic purposes.
