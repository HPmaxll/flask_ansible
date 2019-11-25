import os
from flask import Flask, render_template
from playweb.db import db


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_TRACK_MODIFICATIONS = False,
        SQLALCHEMY_DATABASE_URI = 'mysql://solar:deadweight@139.159.195.229/ansible'
    )
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    db.init_app(app)
    @app.route('/test')
    def test():
        return render_template('test.html')
    
    @app.route('/about')
    def show_about():
        return render_template('about.html')

    """ from . import auth
    app.register_blueprint(auth.bp) """
    
    from . import overview
    app.register_blueprint(overview.bp)
    app.add_url_rule('/',endpoint='stats')
    
    from . import inventory
    app.register_blueprint(inventory.bp)

    from . import tasks
    app.register_blueprint(tasks.bp)

    from . import data
    app.register_blueprint(data.bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run()
else:
    app = create_app()
