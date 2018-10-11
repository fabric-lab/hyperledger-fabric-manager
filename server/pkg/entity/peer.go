package entity

import (
	"fmt"
	"github.com/fabric-lab/fabric-manager/server/pkg/store"
	"github.com/fabric-lab/fabric-manager/server/pkg/util"
	"io/ioutil"
	"path/filepath"
	"strings"
)

type Peer struct {
	Name                string
	ListenAddress       string
	ListenPort          uint16
	ChainCodeListenPort uint16
	LocalMSPID          string
	AdminMSPID          string
	EventListenPort   uint16
}

func (p *Peer) Create() error {
	Path(peerDir, p.Name)
	return nil
}

func (p *Peer) Exec(cmdInfo map[string]string) string {
	channelId := cmdInfo["ChannelId"]
	if channelId != "" {

		channel, err := getChannelByName(channelId)
		if err != nil {
			return err.Error()
		}
		cmdInfo["OrdererEndpoint"] = channel.OrdererEndpoint
		cmdInfo["OrdererName"] = channel.OrdererName
	}

	err := p.configCore(cmdInfo)
	if err != nil {
		return err.Error()
	}
	return ExecPeer(cmdInfo)
}

func (p *Peer) configCore(cmdInfo map[string]string) error {
	name := "core.yaml"
	cmd := cmdInfo["Cmd"]
	mspid := p.LocalMSPID
	if cmd == "CHANNEL_JOIN" || cmd == "CHAINCODE_INSTALL" || cmd == "CHAINCODE_INIT" {
		mspid = p.AdminMSPID
	}
	template := filepath.Join(templateDir, name)
	peerPath := filepath.Join(peerDir, p.Name)

	coreYml := filepath.Join(peerPath, name)
	b, err := ioutil.ReadFile(template)
	if err != nil {
		return err
	}
	str := string(b)
	str = strings.Replace(str, "$ID", p.Name, -1)
	listenAddress := fmt.Sprintf("%s:%d", p.ListenAddress, p.ListenPort)
	chainCodeListenPort := fmt.Sprintf("%s:%d", p.ListenAddress, p.ChainCodeListenPort)
	str = strings.Replace(str, "$LISTEN_ADDRESS", listenAddress, -1)
	str = strings.Replace(str, "$CHAINCODE_LISTEN_ADDRESS", chainCodeListenPort, -1)
	oname := strings.SplitN(p.LocalMSPID, ".", 2)[1]
	str = strings.Replace(str, "$LOCAL_MSP_ID", oname, -1)
	str = strings.Replace(str, "$FILE_SYSTEM_PATH", blockDir, -1)
	str = strings.Replace(str, "$LISTEN_PORT", fmt.Sprintf("%d",p.ListenPort), -1)
	str = strings.Replace(str, "$EVENT_LISTEN_PORT", fmt.Sprintf("%d",p.EventListenPort), -1)
	
	err = ioutil.WriteFile(coreYml, []byte(str), 0644)
	if err != nil {
		return err
	}
	msp, _ := getMspByName(mspid)
	err = util.Copy(msp.Path, peerPath)
	if err != nil {
		return err
	}

	return nil
}

func getPeerByName(cName string) (*Peer, error) {
	var p *Peer
	i, err := store.Bt.ViewByKey(peers, cName)
	if err != nil {
		return p, err
	}
	i = MapToEntity(i, peers)
	if p, ok := i.(*Peer); ok {
		return p, nil
	}
	return p, nil
}


func getPeerByLocalMSPId(localMSPID string) (*Peer, error) {
	var p *Peer
	is, err := store.Bt.View(peers)
	if err != nil {
		return p, err
	}
	for _, v := range is {
		v = MapToEntity(v, peers)
		if p, ok := v.(*Peer); ok {
			if(p.LocalMSPID == localMSPID){
				return p,nil
			}
		}
	} 
	return nil,nil
}