from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from playweb.db import db

bp = Blueprint('overview',__name__)

@bp.route('/')
def stats():
    return render_template('overview/stats.html')

@bp.route('/history')
def history():
    return render_template('overview/history.html')