module.exports = [{
    script: 'npm -- start',
    name: 'server'
  },
  
  {
    script: 'python/read_data.py',
    name: 'python',
    interpreter: "/usr/bin/python3",
    args: "python python/read_data.py test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Doses-DeltaM.txt test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_DataLog.txt test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_ExecutionTable.txt test_files/20190524_Run1_TMA-H2O-50cycles_TMA-10Pulses_TMA-H2O-20cycles_425C_GaPO4_Summary.txt"
  }
];