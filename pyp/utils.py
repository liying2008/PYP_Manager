#!/usr/bin/python
# -*- coding: utf-8 -*-


__author__ = 'liying'


def get_list_from_dict(a_dict):
    a_list = []
    for index, item in a_dict.items():
        a_list.append(item.__dict__)

    # ========= Just for develop and test ===========
    # a_list = a_list[:5]
    # ===============================================
    return a_list
