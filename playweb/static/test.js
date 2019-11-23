var dict = {
    "ping": {
        "139.159.195.229": {
            "feedback": {
                "_ansible_no_log": false,
                "_ansible_parsed": true,
                "changed": false,
                "invocation": {
                    "module_args": {
                        "data": "pong"
                    }
                },
                "ping": "pong"
            },
            "status": "success"
        },
        "155.138.141.199": {
            "feedback": {
                "_ansible_no_log": false,
                "_ansible_parsed": true,
                "changed": false,
                "invocation": {
                    "module_args": {
                        "data": "pong"
                    }
                },
                "ping": "pong"
            },
            "status": "success"
        }
    },
    "yum": {
        "139.159.195.229": {
            "feedback": {
                "_ansible_no_log": false,
                "_ansible_parsed": true,
                "ansible_facts": {
                    "pkg_mgr": "yum"
                },
                "changed": false,
                "invocation": {
                    "module_args": {
                        "allow_downgrade": false,
                        "autoremove": false,
                        "bugfix": false,
                        "conf_file": null,
                        "disable_excludes": null,
                        "disable_gpg_check": false,
                        "disable_plugin": [],
                        "disablerepo": [],
                        "download_only": false,
                        "enable_plugin": [],
                        "enablerepo": [],
                        "exclude": [],
                        "install_repoquery": true,
                        "installroot": "/",
                        "list": "repos",
                        "name": [],
                        "releasever": null,
                        "security": false,
                        "skip_broken": false,
                        "state": null,
                        "update_cache": false,
                        "update_only": false,
                        "use_backend": "auto",
                        "validate_certs": true
                    }
                },
                "results": [
                    {
                        "repoid": "base",
                        "state": "enabled"
                    },
                    {
                        "repoid": "epel",
                        "state": "enabled"
                    },
                    {
                        "repoid": "extras",
                        "state": "enabled"
                    },
                    {
                        "repoid": "mysql-connectors-community",
                        "state": "enabled"
                    },
                    {
                        "repoid": "mysql-tools-community",
                        "state": "enabled"
                    },
                    {
                        "repoid": "mysql80-community",
                        "state": "enabled"
                    },
                    {
                        "repoid": "updates",
                        "state": "enabled"
                    }
                ]
            },
            "status": "success"
        },
        "155.138.141.199": {
            "feedback": {
                "_ansible_no_log": false,
                "_ansible_parsed": true,
                "ansible_facts": {
                    "pkg_mgr": "yum"
                },
                "changed": false,
                "invocation": {
                    "module_args": {
                        "allow_downgrade": false,
                        "autoremove": false,
                        "bugfix": false,
                        "conf_file": null,
                        "disable_excludes": null,
                        "disable_gpg_check": false,
                        "disable_plugin": [],
                        "disablerepo": [],
                        "download_only": false,
                        "enable_plugin": [],
                        "enablerepo": [],
                        "exclude": [],
                        "install_repoquery": true,
                        "installroot": "/",
                        "list": "repos",
                        "name": [],
                        "releasever": null,
                        "security": false,
                        "skip_broken": false,
                        "state": null,
                        "update_cache": false,
                        "update_only": false,
                        "use_backend": "auto",
                        "validate_certs": true
                    }
                },
                "results": [
                    {
                        "repoid": "base",
                        "state": "enabled"
                    },
                    {
                        "repoid": "extras",
                        "state": "enabled"
                    },
                    {
                        "repoid": "updates",
                        "state": "enabled"
                    }
                ]
            },
            "status": "success"
        }
    }
}


function display() {
    var display = document.getElementById('display');
    for (var task in dict) {
        for (var host in dict[task]) {
            var status = dict[task][host]['status'];
            var feedback = dict[task][host]['feedback'];
            delete feedback._ansible_no_log;
            delete feedback._ansible_parsed;
            delete feedback.invocation;
            console.log(status);
            console.log(feedback);
            var block = document.createElement('div');
            var p_host = document.createElement('span');
            p_host.className = 'p_host';
            p_host.innerText = host;
            var p_status = document.createElement('span');
            p_status.className = 'p_status';
            p_status.innerText = status.toUpperCase();
            var p_feedback = document.createElement('span');
            p_feedback.innerText = JSON.stringify(feedback, null, '\t');
            block.appendChild(p_host);
            block.appendChild(p_status);
            block.appendChild(p_feedback);
            display.appendChild(block);
        }
    }
}