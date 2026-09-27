import psutil


def get_network_stats():

    network = psutil.net_io_counters()


    interfaces =  psutil.net_io_counters(
            pernic=True
        )


    interface_data = {}


    for name, stats in interfaces.items():

        interface_data[name] = {

            "bytes_sent":
                stats.bytes_sent,

            "bytes_received":
                stats.bytes_recv,

            "packets_sent":
                stats.packets_sent,

            "packets_received":
                stats.packets_recv

        }


    return {

        "bytes_sent":
            network.bytes_sent,

        "bytes_received":
            network.bytes_recv,

        "packets_sent":
            network.packets_sent,

        "packets_received":
            network.packets_recv,

        "interfaces":
            interface_data

    }