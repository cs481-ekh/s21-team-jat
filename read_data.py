import re
import sys
doses_DeltaM, data_log, exe_table, summary = "", "", "", ""
for arg in sys.argv:
    if re.search("Doses-DeltaM.txt", arg): doses_DeltaM = re.search("Doses-DeltaM.txt", arg)
    if re.search("DataLog.txt", arg): data_log = re.search("DataLog.txt", arg)
    if re.search("ExecutionTable.txt", arg): exe_table = re.search("ExecutionTable.txt", arg)
    if re.search("Summary.txt", arg): summary = re.search("Summary.txt", arg)