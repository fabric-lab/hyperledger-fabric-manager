package entity

import (
	"errors"
	"path/filepath"
	"strings"

	"github.com/fabric-lab/fabric-manager/server/pkg/store"
	"github.com/fabric-lab/fabric-manager/server/pkg/util"
	profileConfig "github.com/hyperledger/fabric/common/tools/configtxgen/localconfig"
)

type Consortium struct {
	//OrderName string
	Name     string
	Type     string
	Desc     string
	MspNames []string
}

func getConsortiumByName(cName string) (*Consortium, error) {
	var c *Consortium
	i, err := store.Bt.ViewByKey(consortiums, cName)
	if err != nil {
		return c, err
	}
	i = MapToEntity(i, consortiums)
	if c, ok := i.(*Consortium); ok {
		return c, nil
	}
	return c, nil
}

func configConsortiumOrgs(path string, cName string) ([]*profileConfig.Organization, error) {
	var orgs []*profileConfig.Organization

	consortium, err := getConsortiumByName(cName)
	if err != nil {
		return nil, err
	}

	for _, v := range consortium.MspNames {
		oname := strings.SplitN(v, ".", 2)[1]
		peer,_:= getPeerByLocalMSPId(v)
		if(peer ==nil){
			//请先添加组织【"+oname+"】的Peer节点
			return nil,errors.New("desc_2"+"|"+oname)
		}
		
		msp, err := getMspByName(v)
		mspPath := msp.Path
		if err != nil {
			return nil, err
		}
		dest := Path(path, consortiums, cName, v)
		util.Copy(mspPath, dest)

		var AnchorPeers []*profileConfig.AnchorPeer
		a := &profileConfig.AnchorPeer{
			Host: "127.0.0.1",
			Port: int(peer.ListenPort),
		}
		AnchorPeers = append(AnchorPeers, a)
		organization := &profileConfig.Organization{
			Name:        oname,
			ID:          oname,
			MSPDir:      filepath.Join(consortiums, cName, v, "msp"),
			AnchorPeers: AnchorPeers,
		}
		orgs = append(orgs, organization)
	}
	return orgs, nil
}
