When we started considering using Docker in production, the one major question was which orchestration tool was to be used. After surveying Kubernetes, Mesos and AWS ECS, we chose Rancher for its open-source philosophy and simple, flexibly approach.

As a result, we implemented Rancher (and the Puppet server stack on top of it) as early as 2015.
