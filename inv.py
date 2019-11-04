#!/bin/python3
#!/usr/bin/env python3
import os,sys,json
from ansible.parsing.dataloader import  DataLoader
from ansible.vars.manager import   VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook  import play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
import ansible.constants as C

BaseDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source = os.path.join(BaseDir,"solar/inventory/multinode")
loader  = DataLoader()
inven = InventoryManager(loader=loader,sources=[source,])
# print(inven.get_hosts())

inven.add_group('test_group2')
print(inven.get_groups_dict())
inven.add_host(host='192.168.1.7',port=22,group='test_group2')
print(inven.get_groups_dict())

host = inven.get_host(hostname='192.168.1.7')

variableman = VariableManager(loader=loader,inventory=inven)
vars = variableman.get_vars(host=host)

# print(json.dumps(vars,indent=4))
variableman.set_host_variable(host=host,varname='k1',value='v1') 

x = variableman.get_vars(host=host)
print(x['k1'])
print(variableman.__dict__)
variableman._extra_vars = {"k2": "v2"} 

x = variableman.get_vars()  
