from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db

bp = Blueprint('tasks',__name__,url_prefix='/tasks')

@bp.route('/run')
def task_run():
    return render_template('tasks/run.html')

@bp.route('/schedule')
def schedule():
    return render_template('tasks/schedule.html')

@bp.route('/define')
def define():
    return render_template('tasks/define.html')