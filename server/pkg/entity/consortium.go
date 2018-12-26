package entity

import (
	 "fmt"
	 "strings"
	// "errors"
	"path/filepath"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/store"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/util"
	profileConfig "github.com/hyperledger/fabric/common/tools/configtxgen/localconfig"
)

type Consortium struct {
	//OrderName string
	Name     string
	Type     string
	Desc     string
	Organizations []string
	MspNames []string
}

func (c *Consortium) Create() error {
	var organizations []string
	var mspNames      []string
	for _,v := range c.MspNames {
		temps := strings.Split(v,"|");
		organizations = append(organizations,temps[0]);
		mspNames = append(mspNames,temps[1]);
	}
	c.Organizations = organizations
	c.MspNames      = mspNames
	return nil
}

func (c *Consortium) Update(i interface{}) error {
	return nil
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

	for k, v := range consortium.MspNames {
		oname := consortium.Organizations[k]
	
		peerNodes := getPeerByOrganization(oname)
		if(peerNodes!=nil){
			for _, v := range peerNodes {
				fmt.Println(v)
			}
		}
		// peer,_:= getPeerByLocalMSPId(v)
		// fmt.Println(v)
		// if(peer ==nil){
		// 	return nil,errors.New("desc_2"+"|"+oname)
		// }
		
		msp, err := getMspByName(v)
		mspPath := msp.Path
		if err != nil {
			return nil, err
		}
		dest := Path(path, consortiums, cName, v)
		util.Copy(mspPath, dest)

		var AnchorPeers []*profileConfig.AnchorPeer
		// a := &profileConfig.AnchorPeer{
		// 	Host: "127.0.0.1",
		// 	Port: 7070,
		// }
		// AnchorPeers = append(AnchorPeers, a)
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
