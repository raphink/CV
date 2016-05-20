Behavior Driven Development became a necessity for us in Puppet modules development.

While Test Driven Development with Rspec and [Rspec-Puppet](https://github.com/rodjek/rspec-puppet) covered most of our testing needs, we still needed to ensure that Puppet catalogs could actually apply to real hosts. Over the years, we used Vagrant, OpenStack and finally Docker to set up acceptance testing for Puppet modules.
