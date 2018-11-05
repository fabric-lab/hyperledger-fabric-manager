package entity

import (
	"encoding/json"
	"fmt"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/store"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/util"
	profileConfig "github.com/hyperledger/fabric/common/tools/configtxgen/localconfig"
	yaml "gopkg.in/yaml.v2"
	"io/ioutil"
	"path/filepath"
	"strings"
)

type Channel struct {
	Name            string
	Consortium      string
	Desc            string
	OrdererName     string
	OrdererEndpoint string
	State           string
}

func (c *Channel) Create() error {
	Path(channelDir, c.Name)
	o, err := getOrderByName(c.OrdererName)
	if err != nil {
		return err
	}
	c.OrdererEndpoint = fmt.Sprintf("%s:%d", o.ListenAddress, o.ListenPort)
	return nil
}

func (c *Channel) Exec(cmdInfo map[string]string) string {
	cmdInfo["ChannelId"] = c.Name
	cmdInfo["OrdererEndpoint"] = c.OrdererEndpoint
	err := c.config(cmdInfo)
	if err != nil {
		return err.Error()
	}

	str := ExecChannel(cmdInfo)

	//check output if exist "Error:",not accuracy,to do next
	index := strings.Index(str, "Error:")
	if index == -1 {
		c.State = "enable"
	} else {
		c.State = "disable"
	}
	b, err := json.Marshal(c)
	if err != nil {
		return err.Error()
	}
	err = store.Bt.AddJson(channels, c.Name, b)
	if err != nil {
		return err.Error()
	}
	return c.State
}

func (c *Channel) config(cmdInfo map[string]string) error {

	path := filepath.Join(channelDir, c.Name)
	profileBytes, err := c.configChannelProfile(path, c.Consortium)
	if err != nil {
		return err
	}

	err = SimpleWrite(path, configtxyml, profileBytes)
	if err != nil {
		return err
	}

	err = c.configCore(path)
	if err != nil {
		return err
	}

	return nil
}

func (c *Channel) configChannelProfile(path string, consortium string) ([]byte, error) {
	orgs, err := configConsortiumOrgs(path, consortium)
	if err != nil {
		return nil, err
	}
	application := &profileConfig.Application{
		Organizations: orgs,
	}

	profile := &profileConfig.Profile{
		Application: application,
		Consortium:  consortium,
	}
	Profiles := make(map[string]*profileConfig.Profile)
	Profiles["SampleSingleMSPChannel"] = profile
	topLevel := &profileConfig.TopLevel{Profiles: Profiles}
	b, err := yaml.Marshal(topLevel)
	if err != nil {
		return nil, err
	}
	s := string(b)
	s = strings.Replace(s, "MaxMessageSize", "MaxMessageCount", 1)
	return []byte(s), nil
}

func (c *Channel) configCore(path string) error {
	consortium, err := getConsortiumByName(c.Consortium)
	if err != nil {
		return err
	}
	mspName := consortium.MspNames[0]
	oname := strings.SplitN(mspName, ".", 2)[1]
	localMSPID := fmt.Sprintf("%s.%s", "admin", oname)
	template := filepath.Join(templateDir, configyml)
	corepath := filepath.Join(path, coreYml)
	b, err := ioutil.ReadFile(template)
	if err != nil {
		return err
	}
	str := string(b)
	str = strings.Replace(str, "$LOCAL_MSP_ID", oname, -1)
	err = ioutil.WriteFile(corepath, []byte(str), 0644)
	if err != nil {
		return err
	}
	msp, _ := getMspByName(localMSPID)
	err = util.Copy(msp.Path, path)
	if err != nil {
		return err
	}

	return nil
}

func getChannelByName(cName string) (*Channel, error) {
	var c *Channel
	i, err := store.Bt.ViewByKey(channels, cName)
	if err != nil {
		return c, err
	}
	i = MapToEntity(i, channels)
	if c, ok := i.(*Channel); ok {
		return c, nil
	}
	return c, nil
}
