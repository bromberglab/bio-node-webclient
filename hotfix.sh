#!/bin/sh

yarn build
docker build . -t gcr.io/poised-cortex-254814/webservice-client
docker push gcr.io/poised-cortex-254814/webservice-client
sleep 1
kubectl apply -f kubectl.yml
kubectl wait --for=condition=complete --timeout=30s job/client-copy
kubectl delete -f kubectl.yml
