/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
 */

package main

import (
	"crypto/sha512"
	"encoding/hex"
	"strconv"
	"fmt"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	pb "github.com/hyperledger/fabric-protos-go/peer"
	"strings"
)

const ERROR_UNKNOWN_FUNC = "Unknown function"
const ERROR_WRONG_ARGS = "Wrong arguments of function"
const ERROR_SYSTEM = "System exception"
const ERR_NOT_FOUND = "Could not find specified Key"
const ERROR_PUT_STATE = "Failed to put state"

var namespace = hexdigest("ycsb")[:6]

type YCSBChaincode struct {
}

func (t *YCSBChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	// nothing to do
	return shim.Success(nil)
}

func (t *YCSBChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	switch function {
	case "insert":
		return t.Insert(stub, args)
	case "update":
		return t.Update(stub, args)
	case "readmodifywrite":
		return t.ReadModifyWrite(stub, args)
	case "remove":
		return t.Delete(stub, args)
	case "query":
		return t.Read(stub, args)
	case "upper":
		return t.upper(stub, args)
	// case "upper1":
	// 	return t.upper(stub, args, 1)
	// case "upper3":
	// 	return t.upper(stub, args, 3)
	// case "upper5":
	// 	return t.upper(stub, args, 5)
	// case "upper7":
	// 	return t.upper(stub, args, 7)
	// case "upper9":
	// 	return t.upper(stub, args, 9)
	// case "upper99":
	// 	return t.upper(stub, args, 99)
	default:
		return errormsg(ERROR_UNKNOWN_FUNC + ": " + function)
	}
}


func (t *YCSBChaincode) Insert(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 { //should be [key, concat of value]
		return errormsg(ERROR_WRONG_ARGS + " Insert")
	}

	fmt.Printf("Insert Key: %s and Value: %s\n", args[0], args[1])
	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return systemerror(err.Error())
	}

	return shim.Success(nil)
}

func (t *YCSBChaincode) Update(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 { //should be [key, concat of value]
		return errormsg(ERROR_WRONG_ARGS + " Update")
	}
	fmt.Printf("Update Key: %s and Value: %s\n", args[0], args[1])

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return systemerror(err.Error())
	}

	return shim.Success(nil)
}

func (t *YCSBChaincode) ReadModifyWrite(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 { //should be [key, concat of value]
		return errormsg(ERROR_WRONG_ARGS + " ReadModifyWrite")
	}

	fmt.Printf("ReadModifyWrite Key: %s and Value: %s\n", args[0], args[1])

	valBytes, err := stub.GetState(args[0])
	if err != nil {
		return systemerror(err.Error())
	}

	err = stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return systemerror(err.Error())
	}

	return shim.Success(valBytes)
}

func (t *YCSBChaincode) Delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 { // should be [key]
		return errormsg(ERROR_WRONG_ARGS + " Delete")
	}
	fmt.Printf("Delete Key: \n", args[0])

	err := stub.PutState(args[0], []byte(""))
	if err != nil {
		return systemerror(err.Error())
	}

	return shim.Success(nil)
}

func (t *YCSBChaincode) Read(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 { // should be [key]
		return errormsg(ERROR_WRONG_ARGS + " Read")
	}

	valBytes, err := stub.GetState(args[0])
	// fmt.Printf("Read Key: %s with Value: %s\n", args[0], string(valBytes))
	if err != nil {
		return systemerror(err.Error())
	}

	return shim.Success(valBytes)
}

func (t *YCSBChaincode) upper(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	arg_count, _ := strconv.Atoi(args[0])
	for i := 1; i <= arg_count; i++ {
		valBytes, _ := stub.GetState(args[i])
		_ = stub.PutState(args[i], valBytes)
	}
	return shim.Success(nil)
}

// func (t *YCSBChaincode) Upper1(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	return t.upper(stub, args, 1);
// }

// func (t *YCSBChaincode) Upper3(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	return t.upper(stub, args, 3);
// }

// func (t *YCSBChaincode) Upper5(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	return t.upper(stub, args, 5);
// }

// func (t *YCSBChaincode) Upper7(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	return t.upper(stub, args, 7);
// }

// func (t *YCSBChaincode) Upper9(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	return t.upper(stub, args, 9);
// }


func main() {
	err := shim.Start(new(YCSBChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %v \n", err)
	}

}

func errormsg(msg string) pb.Response {
	return shim.Error("{\"error\":" + msg + "}")
}

func systemerror(err string) pb.Response {
	return errormsg(ERROR_SYSTEM + ":" + err)
}

func hexdigest(str string) string {
	hash := sha512.New()
	hash.Write([]byte(str))
	hashBytes := hash.Sum(nil)
	return strings.ToLower(hex.EncodeToString(hashBytes))
}
