import re
import sys
import json
import pandas as pd
from os import listdir
from os.path import isfile, join
import pathlib


class ReadData:
    """
    ReadData is a class that takes in the various data files created during the ALD process and processes
    the outputs to later be sent to the server.

    ...
    Attributes
    ----------
    doses_deltaM    :   str
        a string that contains the path and file to the XXXX_Doses-DeltaM.txt
    data_log    :   str
        a string that contains the path and file to the XXXX_DataLog.txt
    exe_table    :   str
        a string that contains the path and file to the XXXX_ExecutionTable.txt
    summary    :   str
        a string that contains the path and file to the XXXX_Summary.txt

    Methods
    -------
    Each attribute has its own getter method used to retrieve the passed in file
    """
    def __init__(self, test=None):
        """

        :param test: Attach any value to run test files.
        """
        # Get the path of current working directory, currently works for just test_files
        # TODO (Future Story) Continue Path checking to determine development environment
        path_adder_1 = "/test_files"  # Defaults to test_files, will start implementing after Task #50 is completed
        path_adder_2 = "test_files/"
        if test is not None:
            path_adder_1 = "/test_files"
            path_adder_2 = "test_files/"
        my_path = pathlib.Path().absolute()
        my_path = (str(my_path) + path_adder_1)
        data_files = []
        # tmp files to add appropriate additional path files for environment
        tmp_data_files = [f for f in listdir(my_path) if isfile(join(my_path, f))]
        for f in tmp_data_files:
            data_files.append(path_adder_2 + (str(f)))
        for f in data_files:
            if re.search("Doses-DeltaM.txt", f):
                self.doses_deltaM = re.search("Doses-DeltaM.txt", f)
            if re.search("DataLog.txt", f):
                self.data_log = re.search("DataLog.txt", f)
            if re.search("ExecutionTable.txt", f):
                self.exe_table = re.search("ExecutionTable.txt", f)
            if re.search("Summary.txt", f):
                self.summary = re.search("Summary.txt", f)

    def get_doses_delta(self):
        """

        :return: string value of the name of the doses_deltaM file
        """
        return self.doses_deltaM.string

    def get_data_log(self):
        """

        :return: string value of the name of the data log file
        """
        return self.data_log.string

    def get_exe_table(self):
        """

        :return: string value of the name of the exe_table file
        """
        return self.exe_table.string

    def get_summary(self):
        """

        :return: string value of the name of the summary file
        """
        return self.summary.string


encodings = ['latin1', 'iso-8859-1', 'cp1252', 'utf-8', 'ascii']


def get_file_df(file):
    """
    Creates the data frame from the passed in file. Used to help the collection of data
    :param file: The data file to be processed
    :return: A data frame of that file
    """
    df = []
    for code in encodings:
        try:
            df = pd.read_csv(file, delimiter='\t', encoding=code, skiprows=[0])
            break
        except UnicodeDecodeError:
            print(code+" unsuccessful as a decoder. Trying next one")
    return df


def get_summary(file):
    """
    Reads the summary file and creates a string of the summary
    :param file: The summary data file
    :return: A string of the summary file
    """
    text = []
    for code in encodings:
        try:
            with open(file, 'r', encoding=code) as summary:
                text = summary.read().replace('\n', ' ')
                break
        except UnicodeDecodeError:
            print(code + " unsuccessful as a decoder. Trying next one")
    return text


def get_json(dfs, summary):
    """
    Creates the data json file
    :param dfs: List of tuples of data frames to be added to JSON. [(name, df),...]
    :param summary: Summary text string
    :return: JSON object
    """
    # Create dictionary to add data frames converted to dictionaries
    dfs_dict = {}
    for name, df in dfs:
        dfs_dict[name] = df.to_dict()
    dfs_dict['summary'] = summary  # Add summary manually
    json_result = json.dumps(dfs_dict)  # Create JSON
    with open('./data_json/data.json', 'w', encoding='utf-8') as outfile:
        json.dump(dfs_dict, outfile)

    return json_result


def main(args):
    """
    The starting point of the program.
    :return:
    """
    num_items = 5  # Number of items to return in JSON
    read_data = ReadData()
    data_log_df = get_file_df(read_data.get_data_log())
    exe_table_df = get_file_df(read_data.get_exe_table())
    doses_delta_df = get_file_df(read_data.get_doses_delta())
    summary = get_summary(read_data.get_summary())
    # Create list of tuples to pass into get_json
    dfs = [("data_log", data_log_df[-num_items:]), ("exe_table", exe_table_df[-num_items:]),
           ("doses_delta", doses_delta_df[-num_items:])]
    data_json = get_json(dfs, summary)


if __name__ == '__main__':
    main(sys.argv)
