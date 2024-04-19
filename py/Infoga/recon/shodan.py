#!/usr/bin/env python
# -*- coding:utf-8 -*- 
#
# @name   : Infoga - Email Information Gathering
# @url    : http://github.com/m4ll0k
# @author : Momo Outaadi (m4ll0k)

# Import necessary libraries
from lib.output import *
from lib.request import *
from lib.parser import *

# Define the Shodan class that inherits from the Request class
class Shodan(Request):
    # Initialize the class with an IP address
    def __init__(self, ip):
        Request.__init__(self)
        self.ip = ip

    # Define the search method to query the Shodan API
    def search(self):
        # Construct the API URL
        url = "https://api.shodan.io/shodan/host/{target}?key=UNmOjxeFS2mPA3kmzm1sZwC0XjaTTksy".format(
            target=self.ip)
        try:
            # Send a GET request to the API
            resp = self.send(
                method='GET',
                url=url
            )
            # If the response status code is not 200, return an empty string
            if resp.status_code != 200:
                return b''
            # Otherwise, return the response content
            return resp.content
        # Catch any exceptions and pass (i.e., ignore them)
        except Exception as e:
            pass
