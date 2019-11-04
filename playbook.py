#!/usr/bin/env python3

import os,sys,json
import ansible.constants as C
from ansible.parsing.dataloader import  DataLoader
from ansible.vars.manager import  VariableManager
from ansible.inventory.manager import  InventoryManager
from ansible.playbook import Play
from ansible.executor.task_queue_manager import  TaskQueueManager
from ansible.executor.playbook_executor import  PlaybookExecutor
from ansible.plugins.callback import CallbackBase
from ansible.inventory.host import  Host,Group
from  collections import namedtuple

BaseDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source = os.path.join(BaseDir,'dir1/inventory/multinode')
loader = DataLoader()   # 实例化loader对象
myinven = InventoryManager(loader=loader,sources=[source,])   # 实例化inventory对象
print(myinven.get_groups_dict())

varmanager = VariableManager(loader=loader,inventory=myinven)  # 实例化VariableManager对象

# Options 选项
Options = namedtuple('Options',[
                'connection','module_path', 'forks', 'timeout',  'remote_user',
                'ask_pass', 'private_key_file', 'ssh_common_args', 'ssh_extra_args', 'sftp_extra_args',
                'scp_extra_args', 'become', 'become_method', 'become_user', 'ask_value_pass', 'verbosity',
                'check', 'listhosts', 'listtasks', 'listtags', 'syntax','diff'
])

options = Options(connection='smart', module_path=None, forks=100, timeout=10,
                remote_user='root', ask_pass=False, private_key_file=None, ssh_common_args=None, ssh_extra_args=None,
                sftp_extra_args=None, scp_extra_args=None, become=None, become_method=None,
                become_user='root', ask_value_pass=False, verbosity=None, check=False, listhosts=False,
                listtasks=False, listtags=False, syntax=False, diff=True)

# 执行对象和模块
passwords = {}
#传入playbooks, inventory, variable_manager, loader, options, passwords
playbook = PlaybookExecutor(playbooks=['site.yml',],
                            inventory=myinven,
                            variable_manager=varmanager,
                            loader=loader,
                            options=options,
                            passwords=passwords)
playbook.run()
