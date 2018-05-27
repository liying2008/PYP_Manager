# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# Create your views here.
import json
import os
import platform
import sys
from collections import OrderedDict

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from pyp.model.latest import Latest
from pyp.model.package import Package
from pyp.model.summary import Summary
from pyp.utils import get_list_from_dict
from pyp.wrapper import fn_timer

reload(sys)
sys.setdefaultencoding('utf-8')

package_dict = OrderedDict()


@fn_timer
def p_list_simple(request):
    cmd = 'python -m pip freeze --isolated --disable-pip-version-check --all'
    pkgs = os.popen(cmd).readlines()
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


@fn_timer
@csrf_exempt
def summary(request):
    if request.method != 'POST':
        return HttpResponse('{}')
    p_list_str = request.POST.get('list', '[]')
    print(p_list_str)
    p_list = json.loads(p_list_str, "utf-8")
    summary_dict = {}
    for p in p_list:
        cmd = 'python -m pip show ' + p + ' --isolated --disable-pip-version-check'
        splites = os.popen(cmd).readlines()
        s = Summary()
        s.package = p
        if len(splites) >= 3 and splites[2].startswith('Summary:'):
            s.summary = splites[2].split(': ')[1]
        else:
            s.summary = ''
        summary_dict[p] = s.__dict__
    print summary_dict
    return HttpResponse(json.dumps(summary_dict))


@fn_timer
def check_latest(request):
    cmd = 'python -m pip list -o --isolated --disable-pip-version-check --format json'
    output = os.popen(cmd).read()
    p_list_ori = json.loads(output)
    p_dict = {}
    for item in p_list_ori:
        latest = Latest()
        latest.package = item['name']
        latest.latest_version = item['latest_version']
        p_dict[latest.package] = latest.__dict__
    return HttpResponse(json.dumps(p_dict))


@fn_timer
@csrf_exempt
def install(request):
    if request.method != 'POST':
        return HttpResponse('{}')
    p_list_str = request.POST.get('list', '[]')
    is_upgrade = request.POST.get('upgrade', '0')
    p_list = json.loads(p_list_str, "utf-8")
    upgrade_dict = {}
    for p in p_list:
        cmd = 'python -m pip install ' + p + ' --isolated'
        if is_upgrade == '1':
            cmd = 'python -m pip install -U ' + p + ' --isolated'
        # print("cmd", cmd)
        output = os.popen(cmd).read()
        if 'Successfully installed ' in output or 'Requirement already up-to-date' in output:
            upgrade_dict[p] = 'success'
        else:
            upgrade_dict[p] = 'failed'
    return HttpResponse(json.dumps(upgrade_dict))


@fn_timer
@csrf_exempt
def uninstall(request):
    if request.method != 'POST':
        return HttpResponse('{}')
    p_list_str = request.POST.get('list', '[]')
    p_list = json.loads(p_list_str, "utf-8")
    uninstall_dict = {}
    for p in p_list:
        cmd = 'python -m pip uninstall ' + p + ' --isolated -y'
        output = os.popen(cmd).read()
        if 'Successfully uninstalled ' in output or 'as it is not installed.' in output:
            uninstall_dict[p] = 'success'
        else:
            uninstall_dict[p] = 'failed'
    return HttpResponse(json.dumps(uninstall_dict))


@fn_timer
def get_interpreter(request):
    options = []
    # 得到默认 Python 解释器路径
    exe_path = sys.executable
    # 得到默认 Python 版本
    platform_version = platform.python_version()
    options.append({'path': exe_path, 'version': platform_version})
    # print(options)
    return HttpResponse(json.dumps(options))
