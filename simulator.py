import time
import shutil
import signal


def interrupt_handler(signal, frame):
    print("Keyboard interrupt caught")
    datalogOrig.close()
    deltaOrig.close()
    exeOrig.close()
    shutil.copyfile('test_files_template/data_template.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt')
    shutil.copyfile('test_files_template/delta_template.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt')
    shutil.copyfile('test_files_template/exe_template.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt')
    shutil.copyfile('test_files_template/summary_template.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Summary.txt')
    exit(0)


signal.signal(signal.SIGINT, interrupt_handler)

# Open the original files
datalogOrig = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt', 'r')
deltaOrig = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt', 'r')
exeOrig = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt', 'r')

# Replace the files with a basic template
shutil.copyfile('test_files_template/data_template.txt',
                'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt')
shutil.copyfile('test_files_template/delta_template.txt',
                'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt')
shutil.copyfile('test_files_template/exe_template.txt',
                'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt')
shutil.copyfile('test_files_template/summary_template.txt',
                'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Summary.txt')

count = 0

# Read 3 lines from each file before looping
datalogOrig.readline()
datalogOrig.readline()
datalogOrig.readline()

deltaOrig.readline()
deltaOrig.readline()
deltaOrig.readline()

exeOrig.readline()
exeOrig.readline()
exeOrig.readline()

while True:

    count += 1

    datalog = open(
        'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt', 'a')
    data_line = datalogOrig.readline()
    datalog.write(data_line)
    datalog.close()

    # Update other files every 10 seconds (0.5*20)
    if (count % 20 == 0):
        delta = open(
            'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt', 'a')
        data_line = deltaOrig.readline()
        delta.write(data_line)
        delta.close()

        exe = open(
            'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt', 'a')
        data_line = exeOrig.readline()
        exe.write(data_line)
        exe.close()

    time.sleep(0.5)
