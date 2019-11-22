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
    for (var task in dict) {
        for (var host in dict[task]) {
            var status = dict[task][host]['status'];
            var feedback = dict[task][host]['feedback'];
            delete feedback._ansible_no_log;
            delete feedback._ansible_parsed;
            delete feedback.invocation;
            console.log(status);
            console.log(feedback);
        }
    }
    // document.getElementById('display').innerText = JSON.stringify(host);
}