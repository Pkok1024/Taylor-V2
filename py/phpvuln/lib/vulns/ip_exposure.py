import ipaddress  # Import the ipaddress module to work with IP addresses

from lib.common.abc import Vulnerability  # Import the Vulnerability class from the abc module in lib.common


class IPExposure(Vulnerability):
    """
    IPExposure class to detect public IP addresses in the code.
    Inherits from the Vulnerability class.
    """

    name = 'IP EXPOSURE'  # Name of the vulnerability
    keyname = 'ips'  # Key name for the vulnerability

    def __init__(self, file_path):
        """
        Initialize the IPExposure class with the file_path.
        Call the constructor of the parent class (Vulnerability) with the file_path.
        """
        super().__init__(file_path)

    def find(self):
        """
        Find and return a list of tuples containing code, line number, and IP address if the IP address is public.
        """
        vulns = []  # Initialize an empty list to store the vulnerabilities found

        for code, line_no, match in self._find(r'("|\')[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}("|\')'):
            """
            Iterate over the results of the _find method, which searches for IP addresses in the code.
            Each match is a tuple containing the code, line number, and the matched IP address as a string.
            """
            ip = match[1:-1]  # Extract the IP address from the match

            if ipaddress.IPv4Address(ip).is_private:
                """
                Check if the IP address is a private IP address using the ipaddress module.
                If it is, skip this IP address and continue with the next one.
                """
                continue

            vulns.append((code, line_no, match))  # Add the vulnerability to the list

        return vulns  # Return the list of vulnerabilities
