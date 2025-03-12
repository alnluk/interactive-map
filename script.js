{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // \uc0\u1030 \u1085 \u1110 \u1094 \u1110 \u1072 \u1083 \u1110 \u1079 \u1072 \u1094 \u1110 \u1103  \u1082 \u1072 \u1088 \u1090 \u1080 \
var map = L.map('map').setView([50.4501, 30.5234], 6);\
\
// \uc0\u1044 \u1086 \u1076 \u1072 \u1108 \u1084 \u1086  \u1090 \u1072 \u1081 \u1083 \u1080  OpenStreetMap\
L.tileLayer('https://\{s\}.tile.openstreetmap.org/\{z\}/\{x\}/\{y\}.png', \{\
    attribution: '&copy; OpenStreetMap contributors'\
\}).addTo(map);\
\
// \uc0\u1047 \u1072 \u1074 \u1072 \u1085 \u1090 \u1072 \u1078 \u1077 \u1085 \u1085 \u1103  GeoJSON \u1079  \u1084 \u1110 \u1089 \u1090 \u1072 \u1084 \u1080 \
fetch('cities.geojson')\
    .then(response => response.json())\
    .then(data => \{\
        L.geoJSON(data, \{\
            onEachFeature: function (feature, layer) \{\
                let cityName = feature.properties.name;\
                let people = feature.properties.people.join(", ");\
                layer.bindPopup(`<b>$\{cityName\}</b><br>\uc0\u1051 \u1102 \u1076 \u1080 : $\{people\}`);\
            \}\
        \}).addTo(map);\
    \});\
}