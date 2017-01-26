# Technical Skills Timeline

This is an interface to view technical skills over time dynamically.

See it live at http://raphink.info/

## Setup

* `groups.json` lists the technical groups
* `items.json` lists the skills, associated to groups
* when skills have a `name` parameter, it is used to retrieve a logo and details from the `skills/<name>/` directory

## Webserver

You can use the following [CSP](https://content-security-policy.com/) for this site:

```
default-src 'none'; connect-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://maxcdn.bootstrapcdn.com; style-src 'self' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com; font-src 'self' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com; img-src 'self';
```
