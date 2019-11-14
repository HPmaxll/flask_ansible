from flask import Blueprint, request,abort, jsonify
from playweb.db import db
from playweb.db_models import ansible_module,ansible_module_parameter
import json

bp = Blueprint('data',__name__,url_prefix='/data')

@bp.route('/module/<string:module_name>', methods=('GET',))
def get_data(module_name):
    m = ansible_module.query.filter_by(module=module_name).first()
    if not m:
        abort(404)
    p = ansible_module_parameter.query.filter_by(module=module_name).all()
    data = {}
    data['module'] = m.module
    data['description'] = m.description
    data['parameter'] = []
    for i in p:
        tmp = {'parameter':i.parameter,'required':i.required,'description':i.description}
        data['parameter'].append(tmp)
    return jsonify(data)

@bp.route('/module/like/<string:module_name>')
def get_hint(module_name):
    mlist = ansible_module.query.filter(
        ansible_module.module.like(module_name + "%") if module_name is not None else ""
        ).all()
    data = []
    for m in mlist:
        data.append(m.module)
    return jsonify(data)

@bp.route('/task', methods=('GET', 'POST'))
def get_task():
    if request.method == 'POST':
        data = request.json
        task = {}
        args = ''
        count = 0
        task['action'] = {}
        task['register'] = 'shell_out'
        task['action']['module'] = data['module']
        arglist = data['args'].keys()
        for i in arglist:
            args += f"{i}={data['args'][i]}"
            count += 1
            if count < len(arglist):
                args += ' '
        task['action']['args'] = args
        return json.dumps(task)