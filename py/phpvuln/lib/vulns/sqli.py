from lib.common.abc import Vulnerability

class SQLInjection(Vulnerability):
    """
    A class representing a SQL Injection vulnerability.

    Inherits from the Vulnerability abstract base class.

    Attributes:
        name (str): The name of the vulnerability.
        keyname (str): The keyname of the vulnerability.
    """

    name = 'SQL INJECTION'
    keyname = 'sqli'

    def __init__(self, file_path):
        """
        Initializes the SQLInjection object with the given file path.

        Args:
            file_path (str): The file path to be scanned for SQL injection vulnerabilities.
        """
        super().__init__(file_path)

    def find(self):
        """
        Finds SQL injection vulnerabilities in the scanned file.

        Uses regular expressions to search for instances of the 'query' method being called
        with user input as a parameter.

        Returns:
            A list of matches found in the scanned file.
        """
        return self._find(r'(mysqli?_|\->)query\(("|\').*[\$].+("|\')\)', False)
