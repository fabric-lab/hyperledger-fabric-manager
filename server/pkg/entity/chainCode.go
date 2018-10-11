package entity

import (
	"fmt"
	"github.com/fabric-lab/fabric-manager/server/pkg/store"
	"github.com/fabric-lab/fabric-manager/server/pkg/util"
)

type ChainCode struct {
	Name    string
	Lang    string
	Version string
	Path    string
	PeerName string
	Init    string
	Invoke  string
	Query   string
	State   string
}

func (o *ChainCode) Exec(cmdInfo map[string]string) string {
	
	cmdInfo["Path"] = o.Path
	cmdInfo["Name"] = fmt.Sprintf("%s:%s", o.Name, o.Version)

	peerName := cmdInfo["Peer"]
	if peerName != "" {
		peer, err := getPeerByName(peerName)
		if err != nil {
			return err.Error()
		}
		cmdInfo["PeerNodeName"] = peer.Name
		cmdInfo["PeerEndPoint"] = fmt.Sprintf("%s:%d", peer.ListenAddress, peer.ChainCodeListenPort)
	}

	return ExecChainCode(cmdInfo)
}

func (o *ChainCode) GetEntity() error {
	cacheNodeName := chaincodes + "." + o.Name+"."+o.PeerName
	cache := util.Caches.Get(cacheNodeName)
	if cache == nil {
		o.State = "disable"
	} else {
		o.State = "enable"
	}
	return nil
}

func getChaincodeByName(cName string) (*ChainCode, error) {
	var c *ChainCode
	i, err := store.Bt.ViewByKey(chaincodes, cName)
	if err != nil {
		return c, err
	}
	i = MapToEntity(i, chaincodes)
	if c, ok := i.(*ChainCode); ok {
		return c, nil
	}
	return c, nil
}
