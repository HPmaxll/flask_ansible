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
        self.results_raw['order'] = []

    def v2_runner_on_unreachable(self, result):
        if result.task_name not in self.results_raw:
            self.results_raw[result.task_name] = {}
            self.results_raw['order'].append(result.task_name)
        self.results_raw[result.task_name][result._host.get_name()] = {}
        self.results_raw[result.task_name][result._host.get_name()]['status'] = 'unreachable'
        self.results_raw[result.task_name][result._host.get_name()]['feedback'] = result._result

    def v2_runner_on_ok(self, result, *args, **kwargs):
        if result.task_name not in self.results_raw:
            self.results_raw[result.task_name] = {}
            self.results_raw['order'].append(result.task_name)
        self.results_raw[result.task_name][result._host.get_name()] = {}
        self.results_raw[result.task_name][result._host.get_name()]['status'] = 'success'
        self.results_raw[result.task_name][result._host.get_name()]['feedback'] = result._result

    def v2_runner_on_failed(self, result, *args, **kwargs):
        if result.task_name not in self.results_raw:
            self.results_raw[result.task_name] = {}
            self.results_raw['order'].append(result.task_name)
        self.results_raw[result.task_name][result._host.get_name()] = {}
        self.results_raw[result.task_name][result._host.get_name()]['status'] = 'failed'
        self.results_raw[result.task_name][result._host.get_name()]['feedback'] = result._result

class ansibleTaskHandler:
    def __init__(self):
        self.hosts_file = None
        Options = namedtuple(
                'Options',
                [
                    'connection', 
                    'remote_user',
                    'module_path', 
                    'forks', 
                    'become', 
                    'become_method', 
                    'become_user', 
                    'check',
                    'diff',
                    'ssh_common_args',
                    'host_key_checking', 
                    'listhosts', 
                    'listtasks', 
                    'listtags', 
                    'syntax'
                    ]
                )
        self.options = Options(
                connection='ssh', 
                remote_user='root',
                module_path=None, 
                forks=10,
                become=None, 
                become_method=None, 
                become_user=None, 
                check=False, 
                diff=False,
                ssh_common_args='-o StrictHostKeyChecking=no',
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
    
    def load_inv(self, inv):
        for grp in inv.keys():
            self.inventory.add_group(grp)
            for host in inv[grp]:
                self.inventory.add_host(host=host, port=22, group=grp)

    def add_extra_vars(self, extra_vars):
        self.variable_manager.extra_vars = extra_vars

    def run_task(self, target_host, task_list):
        play_source = dict(
                hosts=target_host,
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
    taskHandler.load_inv(inventory)
    task_list = [{'action': {'module': 'ping', 'args': ''}, 'register': 'shell_out'}]
    result = taskHandler.run_task(host_list, task_list)
    print(result)