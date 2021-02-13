#!/bin/bash
# Ubuntu 20.04

###
# SETUP DOESNT INVOLVE BUILDING ANGULAR APP AND SENDING IT TROUGH SFTP
###

cd
sudo apt update

curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

sudo adduser ${USER} docker

git clone https://github.com/Drucia/PSI-App
git clone https://github.com/Drucia/PSI-2020

cp PSI-App/docker-compose.yml .

cp PSI-2020/PSI-2020-backend/PSI-2020-backend/appsettings.Development.json.prod PSI-2020/PSI-2020-backend/PSI-2020-backend/appsettings.Development.json

sudo apt install -y docker-compose

echo
echo "Setup finished. Please relogin to run docker as ${USER} user."
