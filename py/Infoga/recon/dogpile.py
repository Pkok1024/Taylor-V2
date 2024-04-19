#!/usr/bin/env python
# -*- coding:utf-8 -*- 

"""
@name   : Infoga - Email Information Gathering
@url    : http://github.com/m4ll0k
@author : Momo Outaadi (m4ll0k)
"""

import requests
from lib.output import Output
from lib.parser import Parser

class Request:
    """
    Base request class for making HTTP requests.
    """
    def __init__(self):
        self.output = Output()

    def send(self, method: str, url: str, headers: dict, **kwargs) -> requests.Response:
        """
        Sends an HTTP request and returns the response.

        :param method: The HTTP method (GET, POST, etc.)
        :param url: The URL to make the request to
        :param headers: The HTTP headers to include in the request
        :param kwargs: Additional keyword arguments to pass to the requests.get() or requests.post() method
        :return: The response object from the requests library
        """
        response = requests.request(method, url, headers=headers, **kwargs)
        return response

class Dogpile(Request):
    """
    A class for making requests to the Dogpile search engine.
    """
    def __init__(self, target: str):
        Request.__init__(self)
        self.target = target

    def search(self) -> list[str]:
        """
        Searches Dogpile for the target email address and returns any found email addresses.

        :return: A list of email addresses found in the search results
        """
        self.output.test('Searching "{}" in DogPile...'.format(
