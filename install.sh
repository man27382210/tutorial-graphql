#!/bin/sh
yarn install &&
cd starwars-normal && yarn install && cd .. &&
cd swapi-graphql && yarn install && cd .. &&
cd starwars-apollo && yarn install && cd .. && 
cd starwars-relay && yarn install && cd ..
