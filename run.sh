# To run the application, only for linux
mkdir -p data
mongod --port 27017 --dbpath=data
gnome-terminal -e node server.js
gnome-terminal -e node exp-server.js