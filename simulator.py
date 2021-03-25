import time
import shutil
import signal
import os

# Executed after keyboard interrupt


def interrupt_handler(signal, frame):
    print("\nCleaning up.")
    datalog_original.close()
    delta_original.close()
    exe_original.close()

    shutil.copyfile('test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt')

    shutil.copyfile('test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt')

    shutil.copyfile('test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt',
                    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt')

    shutil.copyfile('data_json/template.json', 'data_json/past_data.json')

    shutil.rmtree('test_files_copy')

    exit(0)


# Catch keyboard interrupt signal
signal.signal(signal.SIGINT, interrupt_handler)

# Make a directory with a copy of the test files
os.mkdir('test_files_copy')

shutil.copyfile('test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt',
                'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt')

shutil.copyfile('test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt',
                'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt')

shutil.copyfile('test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt',
                'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt')


# Open the copied files
datalog_original = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt', 'rb')
delta_original = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt', 'rb')
exe_original = open(
    'test_files_copy/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt', 'rb')

# Copy the first three lines of each files before looping
# Datalog
datalog = open(
    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt', 'wb')

for x in range(3):
    line = datalog_original.readline()
    datalog.write(line)

datalog.close()

# Delta
delta = open(
    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt', 'wb')

for x in range(3):
    line = delta_original.readline()
    delta.write(line)

delta.close()

# Exe
exe = open(
    'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt', 'wb')

for x in range(3):
    line = exe_original.readline()
    exe.write(line)

exe.close()

count = 0

while True:

    count += 1

    datalog = open(
        'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt', 'ab')
    data_line = datalog_original.readline()
    datalog.write(data_line)
    datalog.close()

    # Update other files every 10 seconds (0.5*20)
    if (count % 20 == 0):
        delta = open(
            'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt', 'ab')
        data_line = delta_original.readline()
        delta.write(data_line)
        delta.close()

        exe = open(
            'test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt', 'ab')
        data_line = exe_original.readline()
        exe.write(data_line)
        exe.close()

    time.sleep(0.5)
