#!/usr/bin/python
# -*- coding: utf-8 -*-


__author__ = 'liying'
from django.conf.urls import url
import views

urlpatterns = [
    url(r'simple_list$', views.p_list_simple),
    url(r'interpreters$', views.get_interpreter),
    url(r'summary$', views.summary),
]
