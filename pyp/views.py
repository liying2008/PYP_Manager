# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# Create your views here.
import json
import os
import platform
import sys

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from pyp.model.package import Package
from pyp.model.summary import Summary
from pyp.model.latest import Latest

reload(sys)
sys.setdefaultencoding('utf-8')

package_dict = {}


def p_list_simple(request):
    cmd = 'python -m pip freeze --isolated --disable-pip-version-check --all > swap/p_list_simple.txt'
    os.system(cmd)
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
    print get_list_from_dict(package_dict)
    return HttpResponse(json.dumps(get_list_from_dict(package_dict)))


@csrf_exempt
def summary(request):
    if request.method == 'POST':
        p_list_str = request.POST.get('list', '[]')
        print(p_list_str)
        p_list = json.loads(p_list_str, "utf-8")
        summary_dict = {}
        for p in p_list:
            cmd = 'python -m pip show ' + p + ' --isolated --disable-pip-version-check > swap/p_summary.txt'
            os.system(cmd)
            output = None
            with open('swap/p_summary.txt') as f:
                output = f.read()
            splites = output.split("\n")
            s = Summary()
            s.package = p
            if len(splites) >= 3 and splites[2].startswith('Summary:'):
                s.summary = splites[2].split(': ')[1]
            else:
                s.summary = ''
            summary_dict[p] = s.__dict__
        print summary_dict
        return HttpResponse(json.dumps(summary_dict))
    return HttpResponse('{}')


def check_latest(request):
    cmd = 'python -m pip list -o --isolated --disable-pip-version-check --format json > swap/p_check_latest.txt'
    os.system(cmd)
    output = None
    with open('swap/p_check_latest.txt') as f:
        output = f.read()
    p_list_ori = json.loads(output)
    p_dict = {}
    for item in p_list_ori:
        latest = Latest()
        latest.package = item['name']
        latest.latest_version = item['latest_version']
        p_dict[latest.package] = latest.__dict__
    return HttpResponse(json.dumps(p_dict))


def get_interpreter(request):
    options = []
    # 得到默认 Python 解释器路径
    exe_path = sys.executable
    # 得到默认 Python 版本
    platform_version = platform.python_version()
    options.append({'path': exe_path, 'version': platform_version})
    # print(options)
    return HttpResponse(json.dumps(options))


def get_list_from_dict(dict):
    list = []
    for index, item in dict.items():
        list.append(item.__dict__)

    # ========= Just for develop and test ===========
    list = list[:5]
    # ===============================================
    return list
