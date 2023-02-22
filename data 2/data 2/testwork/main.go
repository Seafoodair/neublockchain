package main

import (
	"fmt"
	"os"
	"testwork/sdkInit"
)
const (
	cc_name = "smallbank"
	cc_version = "1.0"
)
var App sdkInit.Application //app
func main()  {
	fmt.Println("go")
	//org信息
	orgs := []*sdkInit.OrgInfo{
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org1",
			OrgMspId:      "Org1MSP",
			OrgUser:       "User1",
			OrgPeerNum:    2,
			OrgAnchorFile: "/root/testwork/fixtures/channel-artifacts/Org1MSPanchors.tx",
		},
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org2",
			OrgMspId:      "Org2MSP",
			OrgUser:       "User1",
			OrgPeerNum:    2,
			OrgAnchorFile: "/root/testwork/fixtures/channel-artifacts/Org2MSPanchors.tx",
		},
	}
	// 初始化info
	info := sdkInit.SdkEnvInfo{
		ChannelID:        "mychannel",
		ChannelConfig:    "/root/testwork/fixtures/channel-artifacts/channel.tx",
		Orgs:             orgs,
		OrdererAdminUser: "Admin",
		OrdererOrgName:   "OrdererOrg",
		OrdererEndpoint:  "orderer.example.com",
		ChaincodeID:      cc_name,
		ChaincodePath:    "/root/testwork/chaincode/go/smallbank",
		ChaincodeVersion: cc_version,
	}
	sdk, err := sdkInit.Setup("config.yaml", &info)
	if err != nil{
		fmt.Println(">> Sdk set error ", err)
		os.Exit(-1)
	}
	if err := sdkInit.CreateChannel(&info); err != nil{
		fmt.Println(">> Create channel error: ", err)
		os.Exit(-1)
	}
	if err := sdkInit.JoinChannel(&info); err != nil{
		fmt.Println(">> join channel error: ", err)
		os.Exit(-1)
	}
	//chaincode operation
	packageID, err := sdkInit.InstallCC(&info)
	if err != nil{
                fmt.Println(">> install chaincode error: ", err)
		os.Exit(-1)
	}
        //apprrove
	if err := sdkInit.ApproveLifecycle(&info, 1, packageID); err != nil{
		fmt.Println(">> approve chaincode error: ", err)
		os.Exit(-1)
	}
	//init chaincode
	if err := sdkInit.InitCC(&info, false, sdk); err != nil{
		fmt.Println(">> init chaincode error: ", err)
		os.Exit(-1)
	}
	fmt.Println(">> 通过链码外部服务设置链码状态......")
	if err := info.InitService(info.ChaincodeID, info.ChannelID, info.Orgs[0], sdk);err != nil{
		fmt.Println(">> InitService error: ", err)
		os.Exit(-1)
	}
	App=sdkInit.Application{
		SdkEnvInfo: &info,
	}
	fmt.Println(">> 设置链码状态完成")
}
