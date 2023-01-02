---
title: Establishing a Connection- The Fundamentals of the Three-Way Handshake in TCP
type: page
description: Click on me to see the content.
topic: networking
---

TCP stands for Transmission Control Protocol. The three-way handshake is a fundamental part of TCP. It is a process that is used to establish a connection between two devices before they can exchange data.

When a client wants to initiate a connection with a server, it sends a SYN (synchronize) packet to the server. This packet contains a sequence number that is used to keep track of the order of the packets during the transmission. The server responds with a SYN-ACK (synchronize-acknowledge) packet, which contains its own sequence number and the acknowledgment of the client's sequence number. Finally, the client sends an ACK (acknowledge) packet to the server, acknowledging the server's sequence number.

![img](https://cdn.hashnode.com/res/hashnode/image/upload/v1670611347854/rExK0uAan.png?auto=compress,format&format=webp)

This three-way handshake ensures that both the client and the server are ready to communicate and that they have a common sequence number to use for the transmission of data. It also helps prevent errors and ensure the reliability of the connection.

Here is an analogy to understand the three-way handshake:

You are out of sugar and you go to your neighbors to ask them for sugar.

You knock on your neighbor's door and ask for sugar.

Your neighbor confirms with you if you want sugar.

You confirm with them that you want sugar.

They bring you sugar.

Similarly, once the three-way handshake is complete, the client and the server can start exchanging data. The data is divided into small packets, each with a sequence number and a checksum for error detection. The packets are sent over the network and acknowledged by the recipient. If a packet is lost or corrupted, the recipient can request a retransmission of the lost packet.

In summary, the three-way handshake is a crucial part of the TCP protocol. It establishes a reliable connection between two devices and enables them to exchange data efficiently and reliably.
