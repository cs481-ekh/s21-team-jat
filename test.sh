#!/bin/bash
mocha --exit && python3 python/test_read_data_unittest.py && exit 0
exit 127