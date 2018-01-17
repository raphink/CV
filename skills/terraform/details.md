After using Cloud Formation with AWS for a while, we felt we needed a tool
to automate over all our cloud-based infrastructure and started using Terraform.

We quickly found Terraform would be an ideal tool to automate our Rancher
resources and I wrote
a [Rancher provider](https://www.terraform.io/docs/providers/rancher/index.html)
for Terraform.

When the Terraform providers were split from the core in release 0.10.0,
I became one of the maintainers of [that provider](https://github.com/terraform-providers/terraform-provider-rancher).

In 2017, I created a web interface to visualize Terraform remote states:
[Terraboard](https://github.com/camptocamp/terraboard)
 ![GitHub stars](https://img.shields.io/github/stars/camptocamp/terraboard.svg?style=social&label=Stars)]
