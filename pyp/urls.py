#!/usr/bin/python
# -*- coding: utf-8 -*-

__author__ = 'liying'
from django.conf.urls import url
import views
import search_packages

urlpatterns = [
    # Main UI
    url(r'^simple_list$', views.p_list_simple),
    url(r'^interpreters$', views.get_interpreter),
    url(r'^summary$', views.summary),
    url(r'^check_latest$', views.check_latest),
    url(r'^install$', views.install),
    url(r'^uninstall$', views.uninstall),
    # Search UI
    url(r'^search$', search_packages.search),
]
