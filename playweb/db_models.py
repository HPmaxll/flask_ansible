## model.py
from playweb.db import db

class ansible_module(db.Model):
    __tablename__ = 'modules'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    module = db.Column(db.String(100))
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<ansible_module> {self.module}'

class ansible_module_parameter(db.Model):
    __tablename__ = 'module_parameter'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    parameter = db.Column(db.String(100))
    module = db.Column(db.String(100))
    required = db.Column(db.Boolean)
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<ansible_module: {self.module}> parameter: {self.parameter}'

class ansible_host(db.Model):
    __tablename__ = 'ansible_host'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hostname = db.Column(db.String(25))
    ip_addr = db.Column(db.String(15))
    grp = db.Column(db.String(50))
    os = db.Column(db.String(20))
    about = db.Column(db.String(150))

    def __repr__(self):
        return f'host {self.ip_addr}'