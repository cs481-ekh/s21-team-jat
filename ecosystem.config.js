module.exports = [{
    script: 'npm -- start',
    name: 'server'
  },
  
  {
    script: 'python/read_data.py',
    name: 'python',
    interpreter: "/usr/bin/python3",
    args: ""
  }
];