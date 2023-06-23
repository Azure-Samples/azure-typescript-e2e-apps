#!/bin/bash 

# generate private and public keys
openssl genrsa -out private_key.pem 2048  
openssl rsa -in private_key.pem -outform PEM -pubout -out public_key.pem  
