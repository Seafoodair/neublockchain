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



## 第二个实验
Smallbank 链码，测试指标吞吐量、延迟、CPU和内存利用率。
测试环境Ubuntu18.04，
Caliper0.4.2，
Fabric2.x版本，
测试了10w条数据.阿里云ECS服务器，2cpu 4G内存，40G硬盘。
| Req-500吞吐量load     |  Req-400吞吐量mixed    | Req-400吞吐量      |Req-300延迟     |  Req-350延迟   | Req-400延迟      |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 212.9 | 227.0 | 269.4 | 2.94s | 2.45s | 3.93s |
|  | 262.2 | 213.3 | 1.18s | 2.43s | 2.51s |
| 252.0 | 274.4 | 173.6 | 2.32s | 3.02s | 0.59s |
| 279.8 | 255.6 | 272.2 | 0.67s | 3.58s | 2.42s |
| 264.5 | 245.3 | 246.2 | 1.66s | 3.41s | 3.06s |
load| 245.3 | 246.2 | 1.66s | 3.41s | 3.06s |
mixed| 245.3 | 246.2 | 1.66s | 3.41s | 3.06s |
## 峰值吞吐量和延迟
REQ-5000，100w，load，219.5tps，平均延迟0.23s,no-ops.  Smallbank(偏移律，代码有问题，利用大数定律保证偏斜率。)
mixed. 232.8tps，延迟0.21s.   
参考文献：https://blog.csdn.net/weixin_44782149/article/details/125887800
|  SMALLBANK偏斜度为0.8   |  smallbank偏斜度0.2    | 偏斜度0.4      |偏斜度0.6     |  偏斜度0（没有读）  | 偏斜度1      |
| -------- | -------- | -------- | -------- |-------- |-------- |
| 吞吐量434.0 | 223.4 | 268.6 | 331.1 | 2.45s | 753.7 |
| 延迟0.03s | 0.15s  | 0.10s | 0.06s | 0.06s | 0.01s |
| CPU使用率14.11% | 13.94% | 14.41% | 14.18% | 3.02s | 14.12% |
| 内存使用率1.55 | 1.56G | 1.55G | 1.55G | 3.58s | 1.55G |
load 184.5、0.18s|185.5，0.19s  | 191.5，0.20s| 189.9，0.20s | 3.41s | 189.1、0.19s |
mixed 434.0、0.18s| 223.4,0.15s | 268.6,0.10s  | 331.1，0.06s | 3.41s | 753.7、0.01s |

load是生成数据的时间较长。而操作的时间短一点儿。

