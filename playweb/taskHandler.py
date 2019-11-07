import tempfile
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.playbook_executor import PlaybookExecutor
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase

class myCallback(CallbackBase):
    def __init__(self, display=None, option=None):
        super().__init__(display, option)
        self.result = None
        self.error_msg = None
    def v2_runner_on_ok(self, result):
        res = getattr(result, '_result')
        self.result = res
        self.error_msg = res.get('stderr')
    def v2_runner_on_failed(self, result, ignore_errors=None):
        if ignore_errors:
            return
        res = getattr(result, '_result')
        self.error_msg = res.get('stderr', '') + res.get('msg')
    def runner_on_unreachable(self, host, result):
        if result.get('unreachable'):
            self.error_msg = host + ':' + result.get('msg', '')
    def v2_runner_item_on_failed(self, result):
        res = getattr(result, '_result')
        self.error_msg = res.get('stderr', '') + res.get('msg')

class ansibleTask:
    def __init__(self, hosts, extra_vars=None):
        self.hosts = hosts
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
        self.passwords = dict(vault_pass='secret')
        self.inventory = InventoryManager(loader=self.loader, sources=[self.hosts_file])
        self.variable_manager = VariableManager(loader=self.loader, inventory=self.inventory)
        if extra_vars:
            self.variable_manager.extra_vars = extra_vars

    def run_task(self, taskList):
        source = {
            'hosts': 'all', 
            'gather_facts': 'no', 
            'tasks': [{'action': {'module': 'shell', 'args': command}, 'register': 'shell_out'}]
        }
        play = Play().load(source, variable_manager=self.variable_manager, loader=self.loader)
        results_callback = myCallback()
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
            if results_callback.error_msg:
                raise Exception(results_callback.error_msg)
            return results_callback.result
        except:
            raise
        finally:
            if tqm is not None:
                tqm.cleanup()
    def run_playbook(self, playbookList):
        results_callback = myCallback()
        playbook = PlaybookExecutor(playbooks=playbookList, inventory=self.inventory,
                                    variable_manager=self.variable_manager,
                                    loader=self.loader, options=self.options, passwords=self.passwords)
        setattr(getattr(playbook, '_tqm'), '_stdout_callback', results_callback)
        playbook.run()
        if results_callback.error_msg:
            raise Exception(results_callback.error_msg)
        return results_callback.result
