# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# Create your views here.
import json
import os
import platform
import sys

from django.http import HttpResponse

from package import Package

reload(sys)
sys.setdefaultencoding('utf-8')

package_dict = {}


def p_list_simple(request):
    os.system('python -m pip freeze > swap/p_list_simple.txt')
    output = None
    with open('swap/p_list_simple.txt') as f:
        output = f.read()
    pkgs = output.split("\n")
    count = len(pkgs)
    for i in range(0, count):
        if pkgs[i].strip() != '':
            info = pkgs[i].split('==')
            package = Package()
            package.package = info[0]
            package.version = info[1]
            package_dict[package.package] = package
    print get_package_list_from_dict()
    return HttpResponse(json.dumps(get_package_list_from_dict()))


def get_interpreter(request):
    options = []
    # 得到默认 Python 解释器路径
    exe_path = sys.executable
    # 得到默认 Python 版本
    platform_version = platform.python_version()
    options.append({'path': exe_path, 'version': platform_version})
    # print(options)
    return HttpResponse(json.dumps(options))


def get_package_list_from_dict():
    package_list = []
    for index, item in package_dict.items():
        package_list.append(item.__dict__)
    return package_list
