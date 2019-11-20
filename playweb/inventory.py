from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.db_models import ansible_host, ansible_group, ansible_inventory

bp = Blueprint('inventory',__name__,url_prefix='/inventory')

@bp.route('/inventorys', methods=('GET', 'POST'))
def inventorys():
    if request.method == 'POST':
        inv = ansible_inventory(
            inv_name = request.form['inv_name'],
            inv_creator = request.form['inv_creator'],
            inv_desc = request.form['inv_desc'],
            inv_attr = request.form['inv_attr']
        )
        grp = ansible_group(
            group_name = request.form['inv_name'] + '___nogroup',
            group_creator = request.form['inv_creator'],
            group_desc = 'No Group',
            ansible_inventory = inv
        )
        db.session.add(inv)
        db.session.add(grp)
        db.session.commit()
        return redirect(url_for('inventory.inventorys'))

    invList = get_ilist()
    return render_template('inventory/inventorys.html',invList = invList)

@bp.route('/groups', methods=('GET', 'POST'))
def groups():
    if request.method == 'POST':
        inventory = request.form['inv']
        inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
        g = ansible_group(
            group_name = request.form['group_name'],
            group_creator = request.form['group_creator'],
            group_desc = request.form['group_desc'],
            group_attr = request.form['group_attr'],
            ansible_inventory = inv
        )
        db.session.add(g)
        db.session.commit()
        return redirect(url_for('inventory.groups'))

    groupList = get_glist('default')
    return render_template('inventory/groups.html', groupList = groupList)

@bp.route('/hosts', methods=('GET', 'POST'))
def hosts():
    if request.method == 'POST':
        h = ansible_host(
            host_name = request.form['host_name'],
            host_ip = request.form['host_ip'],
            host_os = request.form['host_os'],
            host_desc = request.form['host_desc'],
            host_attr = request.form['host_attr']
        )

        inventory = request.form['inv']
        group = request.form['group']

        inv = ansible_inventory.query.filter_by(inv_name=inventory).first()
        inv.hosts.append(h)

        if group == 'NONE':
            group = inventory + '___nogroup'
        grp = ansible_group.query.with_parent(inv).filter_by(group_name=group).first()
        grp.hosts.append(h)

        db.session.add(h)
        db.session.commit()
        return redirect(url_for('inventory.hosts'))

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