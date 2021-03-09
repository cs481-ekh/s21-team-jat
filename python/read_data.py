import json
import re
import sys
import pandas as pd
import numpy as np
import pathlib
import time
from datetime import datetime
from os import listdir
from os.path import isfile, join


class ReadData:
    """
    ReadData is a class that takes in the various data files created during the ALD process and processes
    the outputs to later be sent to the server.

    ...
    Attributes
    ----------
    doses_deltaM    :   Regular Expression Match Object
        a string that contains the path and file to the XXXX_Doses-DeltaM.txt
    data_log    :   Regular Expression Match Object
        a string that contains the path and file to the XXXX_DataLog.txt
    exe_table    :   Regular Expression Match Object
        a string that contains the path and file to the XXXX_ExecutionTable.txt
    summary    :   Regular Expression Match Object
        a string that contains the path and file to the XXXX_Summary.txt
    json       :   JSON
        The data json file that contains the data
    json_name       :   str
        Name of the JSON file

    Methods
    -------
    The attributes each have their own getter and setter methods.
    """
    def __init__(self, test=None):
        """

        :param test: Attach any value to run test files.
        """
        # Get the path of current working directory, currently works for just test_files
        # TODO (Future Story) Continue Path checking to determine development environment
        path_adder_1 = "/test_files"  # Defaults to test_files, will start implementing after Task #50 is completed
        path_adder_2 = "test_files/"
        self.json_name = "data.json"
        if test is not None:
            path_adder_1 = "/test_files"
            path_adder_2 = "test_files/"
            self.json_name = "test_data.json"
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
        self.json = '{}'

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
            cols = (df.columns.tolist())
            # Replace messy values in the rows
            df[cols] = df[cols].replace({'   NaN': 'NaN', np.nan: 'NaN', "ï¿½": "²"})
            for col in cols:
                # Rename column name, not necessary currently
                t = col.replace("ï¿½", "²")
                df.rename(columns={col: t})
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
                text = summary.read().replace("ï¿½", "^2")
                break
        except UnicodeDecodeError:
            print(code + " unsuccessful as a decoder. Trying next one")
    return text


def get_json(dfs, summary, file_name):
    """
    Creates the data json file
    :param file_name: Name of JSON file, no path needed
    :param dfs: List of tuples of data frames to be added to JSON. [(name, df),...]
    :param summary: Summary text string
    :return: JSON object
    """
    # Create dictionary to add data frames converted to dictionaries
    dfs_dict = {}
    for name, df in dfs:
        dic = df.to_dict(orient='records')
        # Temporary dictionary to help replace invalid characters currently in dictionaries
        final_dict = {}
        for tmp in dic:
            for old_key in tmp:
                # Python one-liner, it creates a new dictionary object if it finds the current key contains
                # ï¿½ (aka ²) and replaces it with ^2. If those characters aren't found, nothing is done
                t = {k[0:k.find("ï¿½")] + "^2"+k[k.find("ï¿½")+3:] if k.find("ï¿½") != -1 else k: v for k, v in tmp.items()}
                final_dict.update(t)
        # Set the dictionary for the current name
        dfs_dict[name] = final_dict
    dfs_dict['summary'] = summary  # Add summary manually
    dfs_dict['timestamp'] = str(datetime.fromtimestamp(time.time()))
    with open('./data_json/'+file_name, 'w', encoding='utf-8') as outfile:
        json.dump(dfs_dict, outfile, indent=4)

    json_result = json.dumps(dfs_dict, indent=4)  # Create JSON
    return json_result


def main(args):
    """
    The starting point of the program.
    """
    while True:
        num_items = 1  # Number of items to return in JSON
        read_data = ReadData(args)
        data_log_df = get_file_df(read_data.get_data_log())
        exe_table_df = get_file_df(read_data.get_exe_table())
        doses_delta_df = get_file_df(read_data.get_doses_delta())
        summary = get_summary(read_data.get_summary())
        # Create list of tuples to pass into get_json
        dfs = [("data_log", data_log_df[-num_items:]), ("exe_table", exe_table_df[-num_items:]),
               ("doses_delta", doses_delta_df[-num_items:])]
        data_json = get_json(dfs, summary, read_data.json_name)
        read_data.json = data_json
        time.sleep(5)


if __name__ == '__main__':
    main(sys.argv)
