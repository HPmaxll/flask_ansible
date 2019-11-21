from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.db_models import ansible_host, ansible_group, ansible_inventory

bp = Blueprint('inventory',__name__,url_prefix='/inventory')

@bp.route('/inventorys', methods=('GET', 'POST'))
def inventorys():
    if request.method == 'POST':
        data = request.json
        inv = ansible_inventory(
            inv_name = data['inv_name'],
            inv_creator = data['inv_creator'],
            inv_desc = data['inv_desc'],
        )
        grp = ansible_group(
            group_name = data['inv_name'] + '___nogroup',
            group_creator = data['inv_creator'],
            group_desc = 'No Group',
            ansible_inventory = inv
        )
        db.session.add(inv)
        db.session.add(grp)
        db.session.commit()
        return 'success'

    invList = get_ilist()
    return render_template('inventory/inventorys.html',invList = invList)

@bp.route('/del', methods=('POST',))
def inv_del():
    data = request.json['id']
    name = data.split('____')[1]
    if data[0] == 'i':
        record = ansible_inventory.query.filter_by(inv_name=name).first()

    elif data[0] == 'g':
        record = ansible_group.query.filter_by(group_name=name).first()

    else:
        tmp = data.split('____')[0]
        grpid = tmp.split('_')[2]
        grp = ansible_group.query.filter_by(group_id=grpid).first()
        record = ansible_host.query.with_parent(grp).filter_by(host_name=name).first()
    
    db.session.delete(record)
    db.session.commit()
    return 'success'

@bp.route('/groups', methods=('GET', 'POST'))
def groups():
    if request.method == 'POST':
        data = request.json
        inv = ansible_inventory.query.filter_by(inv_name=data['inv']).first()
        g = ansible_group(
            group_name = data['group_name'],
            group_creator = data['group_creator'],
            group_desc = data['group_desc'],
            ansible_inventory = inv
        )
        db.session.add(g)
        db.session.commit()
        return 'success'

    groupList = get_glist('default')
    return render_template('inventory/groups.html', groupList = groupList)

@bp.route('/hosts', methods=('GET', 'POST'))
def hosts():
    if request.method == 'POST':
        data = request.json
        h = ansible_host(
            host_name = data['host_name'],
            host_ip = data['host_ip'],
            host_os = data['host_os'],
            host_desc = data['host_desc']
        )

        inventory = data['inv']
        group = data['group']

        inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
        inv.hosts.append(h)

        if group == 'no_group':
            group = inventory + '___nogroup'
        grp = ansible_group.query.with_parent(inv).filter_by(group_name=group).first()
        grp.hosts.append(h)

        db.session.add(h)
        db.session.commit()
        return 'success'

    hostList = get_hlist('default')
    return render_template('inventory/hosts.html', hostList = hostList)

def get_hlist(name):
    hlist = []
    inv = ansible_inventory.query.filter_by(inv_name=name).first()
    for grp in inv.groups:
        for host in grp.hosts:
            hlist.append([str(inv.inv_id), str(grp.group_id), host.host_name, host.host_ip, host.host_os, host.host_desc])
    return hlist

def get_ilist():
    ilist = []
    invs = ansible_inventory.query.all()
    for i in invs:
        ilist.append([i.inv_name, i.inv_creator, i.inv_desc])
    return ilist

def get_glist(name):
    glist = []
    inv = ansible_inventory.query.filter_by(inv_name=name).first()
    for i in inv.groups[1:]:
        glist.append([str(inv.inv_id), i.group_name, i.group_creator, i.group_desc])
    return glist