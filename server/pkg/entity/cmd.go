package entity

import (
	"bytes"
	"fmt"
	"io"
	"strings"
	// "io/ioutil"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/client"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/util"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
)

const (
	ALLINFO = iota
	OUTINFO
	ERRINFO
)

type CMD interface {
	Exec(map[string]string) string
}

func ExecChannel(cmdInfo map[string]string) string {
	cmd := cmdInfo["Cmd"]
	channelId := cmdInfo["ChannelId"]
	ordererEndpoint := cmdInfo["OrdererEndpoint"]
	//seek :=cmdInfo["Seek"]
	channelPath := filepath.Join(channelDir, channelId)
	peerBin := WindowsBin(peerBin)
	switch cmd {
	case "CHANNEL_CREATE":
		genesisBlock := channelId + ".block"
		dest := filepath.Join(channelPath, genesisBlock)
		cmd := exec.Command(peerBin, "channel", "create", "-c", channelId, "-o", ordererEndpoint)
		msg := run(true, ALLINFO, cmd, channelPath)
		util.Copy(genesisBlock,dest)
		os.RemoveAll(genesisBlock)
		return msg
	}
	return ""
}

func ExecPeer(cmdInfo map[string]string) string {
	cmd := cmdInfo["Cmd"]
	nodeName := cmdInfo["NodeName"]
	channelId := cmdInfo["ChannelId"]
	version := cmdInfo["Version"]
	lang := cmdInfo["Lang"]
	path := cmdInfo["Path"]
	name := cmdInfo["Name"]
	json := cmdInfo["Json"]
	ordererEndpoint := cmdInfo["OrdererEndpoint"]
	ordererName := cmdInfo["OrdererName"]
	peerPath := filepath.Join(peerDir, nodeName)
	channelPath := filepath.Join(channelDir, channelId)
	cacheNodeName := peers + "." + nodeName
	cache := util.Caches.Get(cacheNodeName)

	if cache != nil && cmd == "NODE_START" {
		return "node_already_run"
	} else if cache == nil && cmd == "NODE_STOP" {
		return "node_already_stop"
	} else if cache == nil && cmd != "NODE_START" && cmd != "NODE_STOP" {
		return "node_must_run"
	}
	ordererCacheNodeName := orderers + "." + ordererName
	orderCache := util.Caches.Get(ordererCacheNodeName)
	peerBin := WindowsBin(peerBin)
	switch cmd {
	case "NODE_START":
		cmd := exec.Command(peerBin, "node", "start", "--peer-chaincodedev=true")
		util.Caches.Set(cacheNodeName, cmd)
		return run(false, ALLINFO, cmd, peerPath)
	case "NODE_STOP":
		v := cache.Value
		if _, ok := v.(*exec.Cmd); ok {
			err := v.(*exec.Cmd).Process.Kill()
			if err != nil {
				return err.Error()
			}
		}
		util.Caches.Delete(cacheNodeName)
		return "node_stop_ok"
	case "CHANNEL_LIST":
		cmd := exec.Command(peerBin, "channel", "list")
		return run(true, ALLINFO, cmd, peerPath)
	case "CHANNEL_JOIN":

		genesisBlock := channelId + ".block"
		genesisBlock = filepath.Join(channelPath, genesisBlock)
		cmd := exec.Command(peerBin, "channel", "join", "-b", genesisBlock)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHANNEL_GETINFO":
		cmd := exec.Command(peerBin, "channel", "getinfo", "-c", channelId)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHAINCODE_INSTALL":
		dir := filepath.Dir(path)
		cmd := exec.Command(peerBin, "chaincode", "install", "-n", name, "-v", version, "-l", lang, "-p", dir)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHAINCODE_LIST":
		cmd := exec.Command(peerBin, "chaincode", "list", "--installed")
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHAINCODE_INIT":
		if orderCache == nil {
			return "desc_3"+"|" + ordererName
		}
		cmd := exec.Command(peerBin, "chaincode", "instantiate", "-n", name, "-v", version, "-c", json, "-C", channelId, "-o", ordererEndpoint)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHAINCODE_INVOKE":
		if orderCache == nil {
			return "desc_3"+"|" + ordererName
		}
		cmd := exec.Command(peerBin, "chaincode", "invoke", "-n", name, "-c", json, "-C", channelId, "-o", ordererEndpoint)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	case "CHAINCODE_QUERY":
		if orderCache == nil {
			return "desc_3"+"|" + ordererName
		}
		cmd := exec.Command(peerBin, "chaincode", "query", "-n", name, "-c", json, "-C", channelId, "-o", ordererEndpoint)
		msg := run(true, ALLINFO, cmd, peerPath)
		return msg
	}
	return ""
}

func ExecOrderer(cmdInfo map[string]string) string {
	cmd := cmdInfo["Cmd"]
	nodeName := cmdInfo["NodeName"]
	cacheNodeName := orderers + "." + nodeName
	ordererPath := filepath.Join(OrdererDir, nodeName)
	ordererBin := WindowsBin(ordererBin)
	switch cmd {
		case "NODE_START":
			cache := util.Caches.Get(cacheNodeName)
			if cache != nil {
				return "node_already_run"
			}
			
			cmd := exec.Command(ordererBin, "start")
			util.Caches.Set(cacheNodeName, cmd)
			return run(false, ALLINFO, cmd, ordererPath)
		case "NODE_STOP":
			cache := util.Caches.Get(cacheNodeName)
			if cache == nil {
				return "node_already_stop"
			}
			v := cache.Value
			if _, ok := v.(*exec.Cmd); ok {
				err := v.(*exec.Cmd).Process.Kill()
				if err != nil {
					return err.Error()
				}
			}
			util.Caches.Delete(cacheNodeName)
			return "node_stop_ok"
		case "SEEK":
			cache := util.Caches.Get(cacheNodeName)
			if cache == nil {
				return "node_must_run"
			}
			return Seek(cmdInfo)
	}
	return ""
}

func ExecChainCode(cmdInfo map[string]string) string {
	cmd := cmdInfo["Cmd"]
	nodeName := cmdInfo["NodeName"]
	path := cmdInfo["Path"]
	peerEndPoint := cmdInfo["PeerEndPoint"]
	name := cmdInfo["Name"]
	peerNodeName := cmdInfo["PeerNodeName"]
	peerCacheNodeName := peers + "." + peerNodeName
	cacheNodeName := chaincodes + "." + nodeName+"."+peerNodeName
	switch cmd {
	case "NODE_START":
		cache := util.Caches.Get(peerCacheNodeName)
		if cache == nil {
			return "desc_4"+"|" + peerNodeName
		}
		cache = util.Caches.Get(cacheNodeName)
		if cache != nil {
			return "node_already_run"
		}
		path = filepath.Join(os.Getenv("GOPATH"), "src", path)
		cmd := exec.Command(path)
		env := "CORE_CHAINCODE_LOGLEVEL=debug"
		cmd.Env = append(os.Environ(), env)
		env = fmt.Sprintf("CORE_PEER_ADDRESS=%s", peerEndPoint)
		cmd.Env = append(cmd.Env, env)
		env = fmt.Sprintf("CORE_CHAINCODE_ID_NAME=%s", name)
		cmd.Env = append(cmd.Env, env)

		msg := run(false, OUTINFO, cmd, "")
		if msg == "" {
			util.Caches.Set(cacheNodeName, cmd)
			return "ok"
		}
		return msg
	case "NODE_STOP":
		cache := util.Caches.Get(cacheNodeName)
		if cache == nil {
			return "node_already_stop"
		}
		v := cache.Value
		util.Caches.Delete(cacheNodeName)
		if _, ok := v.(*exec.Cmd); ok {
			err := v.(*exec.Cmd).Process.Kill()
			if err != nil {
				return err.Error()
			}
		}

		return "ok"
	}
	return ""
}

func run(isSycn bool, outType int, cmd *exec.Cmd, config string) string {

	var stdoutBuf, stderrBuf bytes.Buffer
	stdoutIn, _ := cmd.StdoutPipe()
	stderrIn, _ := cmd.StderrPipe()
	var errStdout, errStderr error
	stdout := io.MultiWriter(os.Stdout, &stdoutBuf)
	stderr := io.MultiWriter(os.Stderr, &stderrBuf)

	cmd.Env = append(cmd.Env, os.Environ()...)
	fabricCFGPath := "FABRIC_CFG_PATH=" + config
	cmd.Env = append(cmd.Env, fabricCFGPath)

	err := cmd.Start()
	if err != nil {
		return err.Error()
	}
	go func() {
		_, errStdout = io.Copy(stdout, stdoutIn)
	}()
	go func() {
		_, errStderr = io.Copy(stderr, stderrIn)
	}()

	if isSycn {
		cmd.Wait()
	} else {
		go func() {
			cmd.Wait()
		}()

	}
	outStr, errStr := string(stdoutBuf.Bytes()), string(stderrBuf.Bytes())
	if outType == OUTINFO {
		return outStr
	} else if outType == ERRINFO {
		return errStr
	}
	return fmt.Sprintf("Environment:%s\nCommand:%s\n\n\n%s\n\n\n%s", fabricCFGPath, strings.Join(cmd.Args, " "), errStr, outStr)
}

func Seek(cmdInfo map[string]string) string {
	nodeName := cmdInfo["NodeName"]
	channelId := cmdInfo["ChannelId"]
	seek := cmdInfo["Seek"]
	ordererPath := filepath.Join(OrdererDir, nodeName)
	os.Setenv("FABRIC_CFG_PATH", ordererPath)
	deliverClient, err := client.NewDeliverClient(channelId)
	if err != nil {
		return err.Error()
	}
	var block string
	if seek == "-2" {
		block, err = deliverClient.GetOldestBlock()
		if err != nil {
			return err.Error()
		}
	} else if seek == "-1" {
		block, err = deliverClient.GetNewestBlock()
		if err != nil {
			return err.Error()
		}
	} else {
		i, err := strconv.ParseUint(seek, 10, 64)
		if err != nil {
			return err.Error()
		}
		block, err = deliverClient.GetSpecifiedBlock(i)
		if err != nil {
			return err.Error()
		}
	}
	return block

}
