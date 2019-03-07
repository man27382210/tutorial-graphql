#!/bin/sh
yarn install &&
cd graphQL-server && yarn install && cd .. &&
cd query &&
cd query-normal && yarn install && cd .. &&
cd query-apollo && yarn install && cd .. && 
cd query-relay && yarn install && cd .. &&
cd .. && cd mutation &&
cd mutation-apollo && yarn install && cd .. && 
cd mutation-relay && yarn install && cd .. &&
cd .. && cd pagination &&
cd pagination-apollo && yarn install && cd .. && 
cd pagination-relay && yarn install && cd .. &&
cd .. && cd subscriptions &&
cd subscriptions-apollo && yarn install && cd .. && 
cd subscriptions-relay && yarn install
