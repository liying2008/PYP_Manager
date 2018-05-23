#!/usr/bin/python
# -*- coding: utf-8 -*-


__author__ = 'liying'

import time
from functools import wraps


def fn_timer(func):
    @wraps(func)
    def function_timer(*args, **kwargs):
        t0 = time.time()
        result = func(*args, **kwargs)
        t1 = time.time()
        print ("[ time running -> %s: %s seconds ]" % (func.func_name, str(t1 - t0)))
        return result

    return function_timer
