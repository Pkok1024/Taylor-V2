#!/usr/bin/env python
# -*- coding:utf-8 -*- 

# @name   : Infoga - Email OSINT
# @url    : http://github.com/m4ll0k
# @author : Momo Outaadi (m4ll0k)

import re

class parser:
    # Initialize the parser class with the content and target parameters
    def __init__(self, content, target):
        self.target = target
        self.content = str(content)

    # Method to extract emails from the content
    def email(self):
        # Regular expression pattern to match email addresses
        tmp_email = re.findall(r'[a-zA-Z0-9.\-_+#~!$&\',;=:]+'
                               + '@' + r'[a-zA-Z0-9.-]*' + self.target, self.clean)
        # Initialize an empty list to store unique email addresses
        email_list = []
        # Iterate through the temporary email list
        for _ in tmp_email:
            # Check if the email is not already in the list and its local part is not enclosed in quotes
            if _ not in email_list and _.split('@')[0] not in ('"', "'"):
                # Add the email to the list
                email_list.append(_)
        # Return the list of unique email addresses
        return email_list

    # Method to clean the content by removing HTML tags and special characters
    @property
    def clean(self):
        # Remove <em> tags
        self.content = re.sub('<em>', '', self.content)
        # Remove <b> tags
        self.content = re.sub('<b>', '', self.content)
        # Remove </b> tags
        self.content = re.sub('</b>', '', self.content)
        # Remove </em> tags
        self.content = re.sub('</em>', '', self.content)
        # Remove <strong> tags
        self.content = re.sub('<strong>', '', self.content)
        # Remove </strong>
