from flask import Blueprint, flash, g, session, redirect, render_template, request, session, url_for
from playweb.db import db
from playweb.db_models import ansible_user

bp = Blueprint('auth',__name__)

@bp.route('/login', methods=('GET','POST'))
def login():
    if request.method == 'POST':
        pass
    return render_template('login.html')