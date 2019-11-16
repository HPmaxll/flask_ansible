## model.py
from playweb.db import db

class ansible_user(db.Model):
    __tablename__ = 'ansible_user'
    __table_args__ = {'useexisting': True}
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(25))
    password = db.Column(db.String(256))

    def __repr__(self):
        return f'<user> {self.username}'

class ansible_module(db.Model):
    __tablename__ = 'modules'
    __table_args__ = {'useexisting': True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    module = db.Column(db.String(100))
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<ansible_module> {self.module}'

class ansible_module_parameter(db.Model):
    __tablename__ = 'module_parameter'
    __table_args__ = {'useexisting': True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    parameter = db.Column(db.String(100))
    module = db.Column(db.String(100))
    required = db.Column(db.Boolean)
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<ansible_module: {self.module}> parameter: {self.parameter}'

rel_inv_host = db.Table(
    'inv_host',
    db.Column('inv_id',db.Integer, db.ForeignKey('ansible_inventory.inv_id')),
    db.Column('host_id',db.Integer, db.ForeignKey('ansible_host.host_id'))
)

rel_grp_host = db.Table(
    'grp_host',
    db.Column('group_id',db.Integer, db.ForeignKey('ansible_group.group_id')),
    db.Column('host_id',db.Integer, db.ForeignKey('ansible_host.host_id'))
)

class ansible_host(db.Model):
    __tablename__ = 'ansible_host'
    __table_args__ = {'useexisting': True}
    host_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    host_name = db.Column(db.String(50), unique=True)
    host_ip = db.Column(db.String(15), nullable=False)
    host_os = db.Column(db.String(25))
    host_desc = db.Column(db.String(200))
    host_attr = db.Column(db.Text)
    invs = db.relationship('ansible_inventory',secondary = rel_inv_host, backref = db.backref('hosts',lazy='dynamic'))
    groups = db.relationship('ansible_group',secondary = rel_grp_host, backref = db.backref('hosts',lazy='dynamic'))
 
    def __repr__(self):
        return f'host {self.host_ip}'

class ansible_inventory(db.Model):
    __tablename__ = 'ansible_inventory'
    __table_args__ = {'useexisting': True}
    inv_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    inv_name = db.Column(db.String(50), unique=True, nullable=False)
    inv_creator = db.Column(db.String(50))
    inv_desc = db.Column(db.String(200))
    inv_attr = db.Column(db.Text)
    groups = db.relationship('ansible_group', backref='ansible_inventory', lazy=True)
   
    def __repr__(self):
        return f'Inventory {self.inv_name}'

class ansible_group(db.Model):
    __tablename__ = 'ansible_group'
    __table_args__ = {'useexisting': True}
    group_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    group_name = db.Column(db.String(50), unique=True, nullable=False)
    group_creator = db.Column(db.String(50))
    group_desc = db.Column(db.String(200))
    group_attr = db.Column(db.Text)
    inv_id = db.Column(db.Integer, db.ForeignKey('ansible_inventory.inv_id'), nullable=False)

    def __repr__(self):
        return f'group {self.group_name}'