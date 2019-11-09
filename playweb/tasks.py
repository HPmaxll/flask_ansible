from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.taskHandler import ansibleTaskHandler

bp = Blueprint('tasks',__name__,url_prefix='/tasks')

@bp.route('/run', methods=("GET", "POST"))
def task_run():
    return render_template('tasks/run.html')

@bp.route('/schedule')
def schedule():
    return render_template('tasks/schedule.html')

@bp.route('/define')
def define():
    return render_template('tasks/define.html')