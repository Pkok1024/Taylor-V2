#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@name: Infoga - Email Information Gathering
@url: https://github.com/m4ll0k/Infoga
@author: Momo Outaadi (m4ll0k)
"""

from lib.output import print_info
from lib.request import Request
from lib.parser import Parser

class PGP(Request):
    def __init__(self, target):
        super().__init__()
        self.target = target

    def search(self):
        print_info(f"Searching '{self.target}' in PGP...")
        url = f"http://pgp.mit.edu/pks/lookup?search={self.target}&op=index"
        try:
            response = self.send(
                method="GET",
                url=url,
                headers={
                    "Host": "pgp.mit.edu"
                }
            )
            return self.get_email(response.content, self.target)
        except Exception as e:
            print_info(f"Error: {e}", False)

    def get_email(self, content, target):
        parser = Parser()
        return parser.email(content, target)
