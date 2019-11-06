from flask import Blueprint, request,abort, jsonify
from playweb.db import db
from playweb.db_models import ansible_module,ansible_module_parameter

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