# Unit Test File
# run from /s21-team-jat/.
import unittest
import os.path
from os import path
import re
from read_data import *

files = ["test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt",
         "test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt",
         "test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt",
         "test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Summary.txt"]

read_data = ReadData(1)
data_log_df = get_file_df(read_data.get_data_log())
data_log_columns = ['Timestamp', 'Elapsed Time', 'Chamber Pressure', 'Pump Pressure',
                    'Xtal OK?', 'Xtal Life', 'Mass', 'Mass Offset',
                    'Frequency', 'MFC 1 Flow', 'MFC 2 Flow', 'MFC 3 Flow',
                    'MFC 4 Flow', 'MFC 5 Flow', 'Thermocouple 1', 'Thermocouple 2',
                    'Thermocouple 3', 'Thermocouple 4', 'Iteration Duration', 'Mod7/do0', 'Mod7/do1',
                    'Mod7/do2', 'Mod7/do3', 'Mod7/do4', 'Mod7/do5', 'Mod7/do6', 'Mod7/do7', 'Mod8/do0', 'Mod8/do1',
                    'Mod8/do2', 'Mod8/do3', 'Mod8/do4', 'Mod8/do5', 'Mod8/do6', 'Mod8/do7']

doses_delta_df = get_file_df(read_data.get_doses_delta())
doses_delta_df_columns = ['Recipe Step #', 'Precursor #', 'Precursor Name', 'ALD Process Type',
                        'Pulse/Fill Start Timestamp', 'Pulse/Fill Start Elapsed Time',
                        'Hold Start Timestamp', 'Hold Start Elapsed Time',
                        'Purge Start Timestamp', 'Purge Start Elapsed Time',
                        'Initial Mass', 'Final Mass', 'delta-M']

exe_table_df = get_file_df(read_data.get_exe_table())
exe_table_df_columns = ['Recipe Step', 'Precursor', 'Fill Pressure', 'Dose Time',
                        'Purge Time', 'ALD Process Type']


class TestReadData(unittest.TestCase):

    def test_get_doses_file(self):
        self.assertEqual(files[0], read_data.get_doses_delta(), "Files should match")

    def test_get_data_log_file(self):
        self.assertEqual(files[1], read_data.get_data_log(), "Files should match")

    def test_get_exe_file(self):
        self.assertEqual(files[2], read_data.get_exe_table(), "Files should match")

    def test_get_summary_file(self):
        self.assertEqual(files[3], read_data.get_summary(), "Files should match")

    def data_frame_column_checker(self, df_cols, pred, test):
        for i, col in enumerate(df_cols):
            pred[i] = pred[i].replace("ï¿½", "^2")
            pred[i] = pred[i].replace("²", "^2")
            pred[i] = pred[i].replace("º", "Degrees")
            if pred[i] != test[i]:
                self.assertEqual(pred[i], test[i], '\''+pred[i]+"\' found in columns. Doesn't match "
                                                                "with test value of \'"+test[i]+'\'')
        self.assertEqual(len(pred), len(test), "Generated Count: "+str(len(pred))+" vs Tested Values: "+str(len(test)))

    def test_data_log_columns(self):
        pred = sorted(data_log_df.columns)
        test = sorted(data_log_columns)

        self.data_frame_column_checker(data_log_columns, pred, test)

    def test_doses_delta_columns(self):
        pred = sorted(doses_delta_df.columns)
        test = sorted(doses_delta_df_columns)

        self.data_frame_column_checker(doses_delta_df_columns, pred, test)

    def test_exe_table_columns(self):
        pred = sorted(exe_table_df)
        test = sorted(exe_table_df_columns)

        self.data_frame_column_checker(exe_table_df_columns, pred, test)

    def test_summary(self):
        summary = get_summary(read_data.get_summary())

        self.assertTrue(len(summary) > 0, "Summary file contains at least some text")

    def test_json(self):
        summary = get_summary(read_data.get_summary())
        num_items = 1;
        dfs = [("data_log", data_log_df[-num_items:]), ("exe_table", exe_table_df[-num_items:]),
               ("doses_delta", doses_delta_df[-num_items:])]
        j = get_json(dfs, summary, "test_data.json")
        try:
            json_obj = json.loads(j)
        except Exception as e:
            self.fail("JSON file creation failed")
        self.assertTrue(0 == 0, "JSON file creation succeeded")

    def test_json_file(self):
        summary = get_summary(read_data.get_summary())
        num_items = 1;
        dfs = [("data_log", data_log_df[-num_items:]), ("exe_table", exe_table_df[-num_items:]),
               ("doses_delta", doses_delta_df[-num_items:])]
        j = get_json(dfs, summary, "test_data.json")
        self.assertTrue(path.exists("data_json/data.json"), "Data.json file exists")

    def test_data_json_file_update(self):
        count = 0
        first_time = []
        second_time = []
        while count < 2:
            data_read_data = ReadData(1)
            summary = get_summary(data_read_data.get_summary())
            num_items = 1;
            data_data_log_df = get_file_df(data_read_data.get_data_log())
            data_doses_delta_df = get_file_df(data_read_data.get_doses_delta())
            data_exe_table_df = get_file_df(data_read_data.get_exe_table())
            dfs = [("data_log", data_data_log_df[-num_items:]), ("exe_table", data_exe_table_df[-num_items:]),
                   ("doses_delta", data_doses_delta_df[-num_items:])]
            data_read_data.json = get_json(dfs, summary, data_read_data.json_name)
            count += 1
            if count == 1:
                tmp = json.loads(data_read_data.json)
                first_time = tmp['timestamp']
                time.sleep(5)
            elif count == 2:
                tmp = json.loads(data_read_data.json)
                second_time = tmp['timestamp']
        self.assertTrue(first_time != second_time, "New file was created with a new time stamp")


if __name__ == '__main__':
    unittest.main()
