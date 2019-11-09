import os
import json
import tempfile
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.playbook_executor import PlaybookExecutor
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase

class ResultCallback(CallbackBase):
    def __init__(self, *args, **kwargs):
        self.results_raw = {}

    def v2_runner_on_unreachable(self, result):
        self.results_raw['unreachable'] = {}
        self.results_raw['unreachable'][result._host.get_name()] = json.dumps(result._result)

    def v2_runner_on_ok(self, result, *args, **kwargs):
        self.results_raw['success'] = {}
        self.results_raw['success'][result._host.get_name()] = json.dumps(result._result)

    def v2_runner_on_failed(self, result, *args, **kwargs):
        self.results_raw['failed'] = {}
        self.results_raw['failed'][result._host.get_name()] = json.dumps(result._result)

class ansibleTaskHandler:
    def __init__(self):
        self.hosts_file = None
        Options = namedtuple(
                'Options',
                [
                    'connection', 
                    'module_path', 
                    'forks', 
                    'become', 
                    'become_method', 
                    'become_user', 
                    'check',
                    'diff', 
                    'host_key_checking', 
                    'listhosts', 
                    'listtasks', 
                    'listtags', 
                    'syntax'
                    ]
                )
        self.options = Options(
                connection='ssh', 
                module_path=None, forks=10,
                become=None, 
                become_method=None, 
                become_user=None, 
                check=False, 
                diff=False,
                host_key_checking=False, 
                listhosts=None, 
                listtasks=None, 
                listtags=None, 
                syntax=None
                )
        self.loader = DataLoader()
        self.passwords = {}
        ## self.inventory = InventoryManager(loader=self.loader, sources=[self.hosts_file])
        self.inventory = InventoryManager(loader=self.loader)
        self.variable_manager = VariableManager(loader=self.loader, inventory=self.inventory)
    
    def load_hosts(self, host_list):
        for host in host_list:
            self.inventory.add_host(host=host, port=22, group='all')

    def add_extra_vars(self, extra_vars):
        self.variable_manager.extra_vars = extra_vars

    def run_task(self, target_host, task_list):
        play_source = dict(
                hosts=target_host,
                remote_user='root',
                gather_facts='no',
                tasks=task_list
                )
        play = Play().load(play_source, variable_manager=self.variable_manager, loader=self.loader)
        results_callback = ResultCallback()
        tqm = None
        try:
            tqm = TaskQueueManager(
                inventory=self.inventory,
                variable_manager=self.variable_manager,
                loader=self.loader,
                options=self.options,
                passwords=self.passwords,
                stdout_callback=results_callback
            )
            tqm.run(play)

        except:
            raise
        finally:
            if tqm is not None:
                tqm.cleanup()
        return results_callback.results_raw

    def run_playbook(self, playbookList):
        results_callback = ResultCallback()
        playbook = PlaybookExecutor(playbooks=playbookList, inventory=self.inventory,
                                    variable_manager=self.variable_manager,
                                    loader=self.loader, options=self.options, passwords=self.passwords)
        setattr(getattr(playbook, '_tqm'), '_stdout_callback', results_callback)
        playbook.run()

        return results_callback.results_raw

if __name__ == '__main__':
    taskHandler = ansibleTaskHandler()
    inventory = ['139.159.195.229']
    host_list = ['all']
    taskHandler.load_hosts(inventory)
    task_list = [{'action': {'module': 'ping', 'args': ''}, 'register': 'shell_out'}]
    result = taskHandler.run_task(host_list, task_list)
    print(result)