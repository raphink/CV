In 2007, I set up a Debian build farm for Orange Portails using [buildd](https://buildd.debian.org/). To avoid using multiple machines as builders, we setup chrooted environments using sbuild. However, sending and receiving emails was necessary for a proper buildd setup, and chroot was not enough for that. We thus used LXC-jailed buildd services to set up both i386 and amd64 builders on the same physical machine.

Given the purpose of that task, this was really a container approach, since our goal was essentially to jail one two processes: buildd and postfix, inside LXC containers.
