#### Development and Testing

Docker first came to me as a light replacement for Vagrant in our TDD/BDD process. We used it to quickly test solutions, to create software packages, and to set up BDD with rspec and beaker.

We had started by using our OpenStack infrastructure to launch VMs from Travis CI in order to run our Puppet acceptance tests, but as soon as Travis CI supported Docker, we migrated our testing facility to it, and experienced great performance gains.


#### Production

When Puppet 4 came out, we decided to try and package it as Docker containers. We set up a first infrastructure on top of Docker Compose on a single host, and later migrated it to a catalog template for Rancher.
