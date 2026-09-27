import psutil


def get_system_stats():
    cpu_usage = psutil.cpu_percent(interval=1)

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    return {
        "cpu": cpu_usage,
        "memory": memory.percent,
        "disk": disk.percent
    }