package entity

import (
	"fmt"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/store"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/util"
	profileConfig "github.com/hyperledger/fabric/common/tools/configtxgen/localconfig"
	ordererConfig "github.com/hyperledger/fabric/orderer/common/localconfig"
	yaml "gopkg.in/yaml.v2"
	"path/filepath"
	"strings"
	"time"
)

type Orderer struct {
	Name          string
	LedgerType    string
	OrdererType   string
	ListenAddress string
	ListenPort    uint16
	LocalMSPID    string
	Consortiums   []string
}

func (o *Orderer) Create() error {
	Path(OrdererDir, o.Name)
	return nil
}

func (c *Orderer) Update() error {

	return nil
}

func (o *Orderer) Exec(cmdInfo map[string]string) string {
	err := o.config(cmdInfo)
	if err != nil {
		return err.Error()
	}
	return ExecOrderer(cmdInfo)
}

func (o *Orderer) config(cmdInfo map[string]string) error {

	path := filepath.Join(OrdererDir, o.Name)
	profileBytes, err := o.configOrderProfile(path)
	if err != nil {
		return err
	}

	err = SimpleWrite(path, configtxyml, profileBytes)
	if err != nil {
		return err
	}

	orderBytes, err := o.configOrderer(path)
	if err != nil {
		return err
	}
	SimpleWrite(path, ordereryml, orderBytes)

	return nil
}

func (o *Orderer) configOrderProfile(path string) ([]byte, error) {
	ordererConfig := &profileConfig.Orderer{
		OrdererType:  "solo",
		Addresses:    []string{fmt.Sprintf("%s:%d", o.ListenAddress,o.ListenPort)},
		BatchTimeout: 2 * time.Second,
		BatchSize: profileConfig.BatchSize{
			MaxMessageCount:   10,
			AbsoluteMaxBytes:  10 * 1024 * 1024,
			PreferredMaxBytes: 512 * 1024,
		},
	}
	consortiumsConfig := make(map[string]*profileConfig.Consortium)
	for _, v := range o.Consortiums {
		orgs, err := configConsortiumOrgs(path, v)
		if err != nil {
			return nil, err
		}
		consortiumsConfig[v] = &profileConfig.Consortium{
			Organizations: orgs,
		}

	}

	profile := &profileConfig.Profile{
		Orderer:     ordererConfig,
		Consortiums: consortiumsConfig,
	}
	Profiles := make(map[string]*profileConfig.Profile)
	Profiles["SampleSolo"] = profile
	topLevel := &profileConfig.TopLevel{Profiles: Profiles}
	b, err := yaml.Marshal(topLevel)
	if err != nil {
		return nil, err
	}
	s := string(b)
	s = strings.Replace(s, "MaxMessageSize", "MaxMessageCount", 1)
	return []byte(s), nil
}

func (o *Orderer) configOrderer(path string) ([]byte, error) {
	msp, err := getMspByName(o.LocalMSPID)
	if err != nil {
		return nil, err
	}
	util.Copy(msp.Path, path)
	general := ordererConfig.General{
		LedgerType:     o.LedgerType,
		ListenAddress:  o.ListenAddress,
		ListenPort:     o.ListenPort,
		LocalMSPDir:    defaultMspDir,
		LocalMSPID:     o.LocalMSPID,
		SystemChannel:  "system-channel",
		GenesisMethod:  "provisional",
		GenesisProfile: "SampleSolo",
		LogLevel:       "debug",
	}
	blockPath := filepath.Join(path, blockDir)
	fileLedger := ordererConfig.FileLedger{
		Location: blockPath,
	}
	topLevel := &ordererConfig.TopLevel{
		General:    general,
		FileLedger: fileLedger,
	}
	return yaml.Marshal(topLevel)
}

func getOrderByName(oName string) (*Orderer, error) {
	var o *Orderer
	i, err := store.Bt.ViewByKey(orderers, oName)
	if err != nil {
		return o, err
	}
	i = MapToEntity(i, orderers)
	if o, ok := i.(*Orderer); ok {
		return o, nil
	}
	return o, nil
}
