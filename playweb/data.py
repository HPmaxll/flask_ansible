from flask import Blueprint, request,abort, jsonify
from playweb.db import db
from playweb.db_models import ansible_module,ansible_module_parameter, ansible_host, ansible_group, ansible_inventory

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

@bp.route('/all_inv', methods=("GET",))
def get_inv():
    invlist = ansible_inventory.query.all()
    namelist = []
    for inv in invlist:
        namelist.append(inv.inv_name)
    return jsonify(namelist)

@bp.route('/grps_of_inv/<string:inventory>', methods=("GET",))
def get_grp(inventory):
    inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
    namelist = []
    for grp in inv.groups[1:]:
        namelist.append([grp.group_name, grp.group_creator, grp.group_desc])
    return jsonify(namelist)

@bp.route('/grps_of_inv/name/<string:inventory>', methods=("GET",))
def get_grp_name(inventory):
    inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
    namelist = []
    for grp in inv.groups:
        namelist.append(grp.group_name)
    return jsonify(namelist)

@bp.route('/hosts_of_inv_grp/<string:inventory>/<string:group>', methods=("GET",))
def get_host_by_grp(inventory, group):
    namelist = []
    inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
    if group == 'all':
        for host in inv.hosts:
            namelist.append([host.host_name, host.host_ip, host.host_os, host.host_desc])
    else:
        if group == "none":
            group =inv.inv_name + '___nogroup'
        grp = ansible_group.query.filter_by(group_name=group).first()
        for host in grp.hosts:
            namelist.append([host.host_name, host.host_ip, host.host_os, host.host_desc])
    return jsonify(namelist)

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
        return jsonify(task)