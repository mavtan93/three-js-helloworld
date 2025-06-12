#!/usr/bin/env python3
# Example of a simple callback function in Python

# Run this script with python3 callbacks.py

# Define a callback function 
def my_callback(result):
    print(f"Callback called with result: {result}")

# Function that takes a callback as an argument
def do_something(data, callback):
    # Do something with data
    result = data * 2
    # Call the callback with the result
    callback(result)

# Example usage
do_something(5, my_callback)