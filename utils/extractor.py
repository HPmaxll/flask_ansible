import re,os
import pymysql.cursors
con = pymysql.connect(
    host = '139.159.195.229',
    user = 'solar',
    password = 'deadweight',
    db = 'ansible',
    charset = 'utf8mb4',
    cursorclass = pymysql.cursors.DictCursor
)
pat = re.compile(r'^OPTION')
path = 'D:/ansible/'
flist = os.listdir(path)
plist = [path + x for x in flist]
try:
    for i in plist:
        flag = 0
        desc = ''
        module = os.path.split(i)[1].split('.')[0]
        with open(i,'r',encoding='utf-8') as t:
            text = t.readlines()
        for line in text:
            if line[0] == '\n':
                if flag == 0:
                    flag = 1
                    continue
                elif flag == 1:
                    break
            if flag == 1:
                desc += line.strip() + ' '
        with con.cursor() as cur:
            cur.execute("INSERT INTO ansible.modules(module,description) VALUES(%s,%s)",(f'{module}',f'{desc}'))
        flag = subflag = 0
        para_name = para_desc = ''
        for line in text:
            if re.match(pat,line):
                flag = 1
                continue
            if line[0] == '\n':
                if para_name == '':
                    continue
                with con.cursor() as cur:
                    cur.execute("INSERT INTO ansible.module_parameter(parameter,module,required,description) VALUES(%s,%s,%s,%s)",(f'{para_name}',f'{module}',subflag-1,f'{para_desc}'))
                para_name = para_desc = ''
                subflag = 0
            if line[0] not in ['-','=','\n',' ']:
                flag = 0
            if flag == 1:
                if line[0] == '-':
                    para_name = line.split()[1]
                    subflag = 1
                    continue
                if line[0] == '=':
                    para_name = line.split()[1]
                    subflag = 2
                    continue
                if subflag != 0:
                    para_desc += line.strip(' ').replace('\n',' ')
finally:
    con.commit()
    con.close()