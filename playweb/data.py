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
        namelist.append([str(inv.inv_id), grp.group_name, grp.group_creator, grp.group_desc])
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
        for grp in inv.groups:
            for host in grp.hosts:
                namelist.append([ str(inv.inv_id), str(grp.group_id), host.host_name, host.host_ip, host.host_os, host.host_desc])
    else:
        if group == "no_group":
            group =inv.inv_name + '___nogroup'
        grp = ansible_group.query.filter_by(group_name=group).first()
        for host in grp.hosts:
            namelist.append([str(inv.inv_id), str(grp.group_id), host.host_name, host.host_ip, host.host_os, host.host_desc])
    return jsonify(namelist)

@bp.route('/task', methods=('GET', 'POST'))
def get_task():
    if request.method == 'POST':
        data = request.json
        data_server = data['serverlist']
        inventory = {}
        for host in data_server:
            tmp = host.split('____')
            tmp_info = tmp[0]
            tmp_name = tmp[1]
            if host[0] == 'i':
                inventory[tmp_name] = '*'
            elif host[0] == 'g':
                inv_name = ansible_inventory.query.filter_by(inv_id=int(tmp_info.split('_')[1])).first().inv_name
                if inv_name not in inventory:
                    inventory[inv_name] = {}
                if inventory[inv_name] == '*':
                    continue
                if tmp_name == inv_name + '___nogroup':
                    tmp_name = 'nogroup'
                inventory[inv_name][tmp_name] = '*'
            else:
                inv_name = ansible_inventory.query.filter_by(inv_id=int(tmp_info.split('_')[1])).first().inv_name
                grp_name = ansible_group.query.filter_by(group_id=int(tmp_info.split('_')[2])).first().group_name
                if grp_name== inv_name + '___nogroup':
                    grp_name = 'nogroup'
                host_ip = ansible_host.query.filter_by(host_name=tmp_name).first().host_ip
                if inv_name not in inventory:
                    inventory[inv_name] = {}
                if inventory[inv_name] == '*':
                    continue
                if grp_name not in inventory[inv_name]:
                    inventory[inv_name][grp_name] = []
                if inventory[inv_name][grp_name] == '*':
                    continue
                inventory[inv_name][grp_name].append(host_ip)
                        
        data_task = data['tasklist']
        
        tasklist = []
        for i in data_task:
            task = {}
            args = ''
            task['action'] = {}
            task['register'] = 'shell_out'
            task['action']['module'] = i['module']
            arglist = i['args'].keys()
            for j in arglist:
                args += f"{j}={i['args'][j]}"
                args += ' '
            args = args.strip()
            task['action']['args'] = args
            tasklist.append(task)

        ansible_data = {'inventory':inventory,'tasklist':tasklist}
        return jsonify(ansible_data)