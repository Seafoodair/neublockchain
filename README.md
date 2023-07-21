# neublockchain
## 设计一个区块链分析平台
区块链分析平台只是在分析区块链各个部件的消耗。从而达到优化区块链的目的。
# introduction
| Req-300吞吐量     |  Req-350吞吐量    | Req-400吞吐量      |Req-300延迟     |  Req-350延迟   | Req-400延迟      |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 237.2 | 254.6 | 269.4 | 2.94s | 2.45s | 3.93s |
| 225.8 | 262.2 | 213.3 | 1.18s | 2.43s | 2.51s |
| 252.0 | 274.4 | 173.6 | 2.32s | 3.02s | 0.59s |
| 279.8 | 255.6 | 272.2 | 0.67s | 3.58s | 2.42s |
| 264.5 | 245.3 | 246.2 | 1.66s | 3.41s | 3.06s |

虚拟机，单机写操作（随机冲突的情况下，测试的）测试的链码为：asset-transfer-basic
进程数据对吞吐量的影响。峰值情况下
单核：吞吐量为364.7，延迟：0s：


## 第二个实验
Smallbank 链码，测试指标吞吐量、延迟、CPU和内存利用率。
测试环境Ubuntu18.04，
Caliper0.4.2，
Fabric2.x版本，
测试了10w条数据.阿里云ECS服务器，2cpu 4G内存，40G硬盘。

| 客户端数量    |  吞吐量    | 延迟      |cpu     |  内存   | 其他0.2query     |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 1 | 225.1 | 0.17s | 14.29 | 1.61G | 189.8，0.12s load |
| 4 | 220.4 | 0.15s | 14.25 | 1.52G | 181.1,0.2s |
| 8 | 195.6 | 0.19s | 13.63 | 1.38G | 160.9,0.24s |
| 2 | 239.0 | 0.10s | 17.99% | 47.7M | 205.7,0.13s |
| 10 | 190.9 | 0.2s | 16.23% | 443M | 157.8,0.27s |
|6| 219.5 | 0.16s | 16.46s | 439M | 171.8,0.2s |


| 分布式客户端数量    |  吞吐量    | 延迟      |orderer，cpu     |  内存   | 其他     |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 1 | 221 | 0.09s | 14.29 | 1.61G | 186.3，0.26s load |
| 2 | 438.3/433.1 | 0.18s | 27.78 | 828M | 378.3.,0.27sload |
| 3 | 476.2、410.71| 6.82s | 30.16% | 2.11G | 346.4,12.50s |
| 4 | 490.5/412.28 | 9.25s | 28.79% | 1.58G | 365.1,22.31s |
| 5 | 956.4/141.27 | 6.82s | 25.5% | 1.63G | 329.9/303.76,45.07s |
4延迟高：是因为ENDORSEMENT_POLICY_FAILURE 原因造成的。
请求超时，4的时候。
5 台exceeding concurrency limit (2500)
## 并发分析
| 交易数量    |  吞吐量    | 延迟      |cpu     |  内存   | 其他0.2query     |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 10 | 410.1/374.75 | 0.12s | 28.25 | 1.61G | 189.8，0.12s load |
| 30 | 413.9/375.6 | 0.2s | 22.17 | 1.52G | 356.7,0.3s |
| 50 | 414.3/402.9 | 0.21s | 18.26 | 1.38G | 356.1,0.275s |
| 100 | 239.0 | 0.10s | 17.99% | 47.7M | 205.7,0.13s  这个跟两个客户端应该一致 |
| 150 | 418.3/411.488 | 0.22s | 21.9% | 443M | 351.5,0.32s |
|200| 409.1/389.5 | 0.24s | 22.08 | 439M | 360.4,0.34s |
|250| 406.5/391.7| 0.25s | 21.46 | 439M | 342.8,0.33s |
|300| 408.8/399.2| 0.24s | 17.75| 439M | 356.8,0.32s |


| 时间timeout    |  吞吐量    | 延迟      |cpu     |  内存   | 其他0.2query     |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 20崩掉啦 | 410.1/374.75 | 0.12s | 28.25 | 1.61G | 189.8，0.12s load |
| 40 | 424.5/366.21091 | 0.17s | 26.85 | 1.52G | 365.4,0.27s |
| 60 | 398.4/364.7 | 0.19s | 25.46 | 1.38G | 368.1,0.33s |
| 80 | 401.4/340.9 | 0.25s | 19.6% | 47.7M | 360.5,0.25s |
| 120 | 411.9/404.05 | 0.55s | 23.22% | 443M | 352.2,0.28s |
|140| 380.2/373.6 | 0.27s | 25.06 | 439M | 356.7,0.41s |
|160| 419.6/412.8| 0.31s | 20.82 | 439M | 362.1,0.44s |
|180| 417.6/404.8| 0.59s | 26.53| 439M | 354.1,0.40s |
|200| 410/403.3| 0.29s | 17.77| 439M | 358.6,0.37s |
|220| 424.3/416.5| 0.38s | 20.11| 439M | 362.2,0.51s |
### 区块的大小
只需要重新生成创世块和通道和通道中的锚节点。
``configtxgen -profile TwoOrgsOrdererGenesis -channelID nomychannel -outputBlock ./channel-artifacts/genesis.block
藏锋:
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel

藏锋:
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

藏锋:
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP
``
## 安全性分析
有无tls的吞吐量
0.17s   
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/4adcadbf-6476-4cc4-8c26-6db9adcc094d)
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/23924857-053c-4945-9beb-cf94b8a5f0ea)
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/22f2c12c-6092-4041-b54e-94912de166af)
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/f08cfd07-63a0-49ab-ab6a-6f92a8c3f363)
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/033be786-2709-4f77-b65c-93c948e68d9c)
![image](https://github.com/Seafoodair/neublockchain/assets/51044388/189dfe59-09a7-45ea-be70-627979cb2ec5)
23.32%


## 峰值吞吐量和延迟
REQ-5000，100w，load，219.5tps，平均延迟0.23s,no-ops.  Smallbank(偏移律，代码有问题，利用大数定律保证偏斜率。)
mixed. 232.8tps，延迟0.21s.   
参考文献：https://blog.csdn.net/weixin_44782149/article/details/125887800
|  SMALLBANK偏斜度为0.8   |  smallbank偏斜度0.2    | 偏斜度0.4      |偏斜度0.6     |  偏斜度0（没有读）  | 偏斜度1      |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 吞吐量434.0 | 223.4 | 268.6 | 331.1 | 195.2 | 753.7 |
| 延迟0.03s | 0.15s  | 0.10s | 0.06s | 0.21s | 0.01s |
| CPU使用率14.11% | 13.94% | 14.41% | 14.18% | 13.8% | 14.12% |
| 内存使用率1.55 | 1.56G | 1.55G | 1.55G | 1.55G | 1.55G |
load 184.5、0.18s|185.5，0.19s  | 191.5，0.20s| 189.9，0.20s | 185.8,0.19s | 189.1、0.19s |
mixed 434.0、0.18s| 223.4,0.15s | 268.6,0.10s  | 331.1，0.06s | 195.2,0.21s | 753.7、0.01s |

load是生成数据的时间较长。而操作的时间短一点儿。


## CA对吞吐量和延迟的影响
ECDSA 和 RSA 和HSM 对性能的影响。

| 发送率1000   |  smallbank偏斜度0.2    | 偏斜度0.4      |偏斜度0.6     |  偏斜度0（没有读）  | 偏斜度1      |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 吞吐量377.2 | 223.4 | 268.6 | 331.1 | 195.2 | 753.7 |
| 延迟0.45s | 0.15s  | 0.10s | 0.06s | 0.21s | 0.01s |
| CPU使用率22.64% | 13.94% | 14.41% | 14.18% | 13.8% | 14.12% |
| 内存使用率98.8 | 1.56G | 1.55G | 1.55G | 1.55G | 1.55G |
load 346.5、0.42s|185.5，0.19s  | 191.5，0.20s| 189.9，0.20s | 185.8,0.19s | 189.1、0.19s |
mixed 395.1/377.2、0.45s| 223.4,0.15s | 268.6,0.10s  | 331.1，0.06s | 195.2,0.21s | 753.7、0.01s |
ping peer1.org1.example.com   结果：
--- orderer.example.com ping statistics ---
1000 packets transmitted, 1000 received, 0% packet loss, time 1022715ms
rtt min/avg/max/mdev = 0.173/0.260/3.193/0.115 ms

--- peer0.org1.example.com ping statistics ---
1000 packets transmitted, 1000 received, 0% packet loss, time 1022682ms
rtt min/avg/max/mdev = 0.197/0.263/5.235/0.212 ms



网络丢包率影响比较低（基本无影响）。
--- peer1.org1.example.com ping statistics ---
1000 packets transmitted, 1000 received, 0% packet loss, time 1022370ms
rtt min/avg/max/mdev = 0.207/0.320/13.373/0.590 ms


--- peer0.org1.example.com ping statistics ---
1000 packets transmitted, 1000 received, 0% packet loss, time 1022682ms
rtt min/avg/max/mdev = 0.197/0.263/5.235/0.212 ms

--- peer1.org2.example.com ping statistics ---
1000 packets transmitted, 1000 received, 0% packet loss, time 1022451ms
rtt min/avg/max/mdev = 0.194/0.278/1.567/0.155 ms

smallbank事务不设置冲突但是，还是吞吐量很低。284.33 tps   3.67s  
出现了大多事务是背书策略不满足。
1004.4 tps  avg0.18  21.85%
##一致性 
solo 
