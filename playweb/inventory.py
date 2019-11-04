from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.db_models import ansible_host

bp = Blueprint('inventory',__name__,url_prefix='/inventory')

@bp.route('/inventorys')
def inventorys():
    return render_template('inventory/inventorys.html')

@bp.route('/groups')
def groups():
    return render_template('inventory/groups.html')

@bp.route('/hosts', methods=('GET', 'POST'))
def hosts():
    if request.method == 'POST':
        h = ansible_host(
            hostname = request.form['hostname'],
            ip_addr = request.form['ip_addr'],
            grp = request.form['grp'],
            os = request.form['os'],
            about = request.form['description']
        )
        db.session.add(h)
        db.session.commit()
        return redirect(url_for('inventory.hosts'))

    hostList = get_list()
    return render_template('inventory/hosts.html', hostList = hostList)
        
def get_list():
    hlist = []
    hosts = ansible_host.query.all()
    for i in hosts:
        hlist.append([i.hostname,i.ip_addr,i.grp,i.os,i.about])
    return hlist