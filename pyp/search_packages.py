#!/usr/bin/python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

# Create your views here.
import json
import os
import sys
from collections import OrderedDict

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from pyp.model.package_search import SearchPackage
from pyp.utils import get_list_from_dict
from pyp.wrapper import fn_timer

reload(sys)
sys.setdefaultencoding('utf-8')


@fn_timer
@csrf_exempt
def search(request):
    if request.method != 'POST':
        return HttpResponse('[]')
    p = request.POST['p']
    last_package = ''
    search_package_dict = OrderedDict()
    print(p)
    cmd = 'python -m pip search --isolated --disable-pip-version-check ' + p
    lines = os.popen(cmd).readlines()
    for line in lines:
        if line.startswith('  INSTALLED:'):
            installed_version = line.lstrip('  INSTALLED: ').rstrip(' (latest)\n')
            print(installed_version)
            search_package_dict[last_package].is_installed = True
            search_package_dict[last_package].installed_version = installed_version
        elif line.startswith('  LATEST:'):
            pass
        else:
            arr = line.split(' - ')
            name = arr[0].rstrip().split(' (')
            package = name[0]
            version = ''
            if len(name) == 2:
                version = name[1].rstrip(')')
            summary = ''
            if len(arr) == 2:
                summary = arr[1]
            # print('package', package)
            # print('version', version)
            # print('summary', summary)
            last_package = package
            search_package = SearchPackage()
            search_package.package = package
            search_package.version = version
            search_package.summary = summary
            search_package.is_installed = False
            search_package.installed_version = ''
            search_package_dict[package] = search_package

    search_package_list = get_list_from_dict(search_package_dict)
    return HttpResponse(json.dumps(search_package_list))
