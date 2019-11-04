from flask import Blueprint, flash, g, session, redirect, render_template, request, session, url_for
from playweb.db import db

bp = Blueprint('auth',__name__)

@bp.route('/login', methods=('GET','POST'))
def login():
    return render_template('login.html')