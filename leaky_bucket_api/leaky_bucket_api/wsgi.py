"""
WSGI config for leaky_bucket_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'leaky_bucket_api.settings')

_application = get_wsgi_application()

SCRIPT_NAME = '/leaky_bucket_api'


def application(environ, start_response):
    path_info = environ.get('PATH_INFO', '')
    if path_info.startswith(SCRIPT_NAME):
        environ['PATH_INFO'] = path_info[len(SCRIPT_NAME):]
    environ['SCRIPT_NAME'] = SCRIPT_NAME
    return _application(environ, start_response)
