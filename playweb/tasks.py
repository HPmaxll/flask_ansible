from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.inventory import get_glist, get_hlist, get_ilist
from playweb.taskHandler import ansibleTaskHandler

bp = Blueprint('tasks',__name__,url_prefix='/tasks')

@bp.route('/run', methods=("GET", "POST"))
def task_run():
    hostlist = get_hlist('default')
    grouplist = get_glist('default')
    invlist = get_ilist()
    return render_template('tasks/run.html', hostList=hostlist, groupList=grouplist, invList=invlist)

@bp.route('/schedule')
def schedule():
    return render_template('tasks/schedule.html')

@bp.route('/tasklist')
def tasklist():
    return render_template('tasks/tasklist.html')