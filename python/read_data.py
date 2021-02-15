import re
import sys
import pandas as pd


class ReadData:

    def __init__(self, args):
        for arg in args:
            if re.search("Doses-DeltaM.txt", arg):
                self.doses_deltaM = re.search("Doses-DeltaM.txt", arg)
            if re.search("DataLog.txt", arg):
                self.data_log = re.search("DataLog.txt", arg)
            if re.search("ExecutionTable.txt", arg):
                self.exe_table = re.search("ExecutionTable.txt", arg)
            if re.search("Summary.txt", arg):
                self.summary = re.search("Summary.txt", arg)

    def get_doses_delta(self):
        return self.doses_deltaM.string

    def get_data_log(self):
        return self.data_log.string

    def get_exe_table(self):
        return self.exe_table.string

    def get_summary(self):
        return self.summary.string


def get_file_df(file):
    encodings = ['latin1', 'iso-8859-1', 'cp1252']
    df = []
    for code in encodings:
        try:
            df = pd.read_csv(file, delimiter='\t', encoding=code, skiprows=[0])
            break
        except UnicodeDecodeError:
            print(code+" unsuccessful as a decoder. Trying next one")
    return df


def main(args):
    read_data = ReadData(sys.argv)
    data_log_df = get_file_df(read_data.get_data_log())
    exe_table_df = get_file_df(read_data.get_exe_table())
    doses_delta_df = get_file_df(read_data.get_doses_delta())


if __name__ == '__main__':
    main(sys.argv)
