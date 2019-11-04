from flask import Blueprint, g, request, session
from playweb.db import db
import json

bp = Blueprint('data',__name__,url_prefix='/data')

@bp.route('/', methods=('GET','POST'))
def get_data():
    if request.method == 'POST':
        data = json.loads(request.data)
        