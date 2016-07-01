var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var settings = require(__dirname + '/../config/settings');

app.use(express.static(__dirname + '/../client'));
