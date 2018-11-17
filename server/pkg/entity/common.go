package entity

import (
	"os"
	"path/filepath"
	"runtime"
)

var (
	templateDir = "template"
	blockDir    = "block"
	configDir   = "config"
	peerDir     = filepath.Join(configDir, "peer")
	OrdererDir  = filepath.Join(configDir, "orderer")
	channelDir  = filepath.Join(configDir, "channel")
	mspDir      = filepath.Join(configDir, "msp")
	tempDir     = filepath.Join(configDir, "tmp")
	binDir      = filepath.Join("bin",runtime.GOOS,runtime.GOARCH)
	peerBin     = filepath.Join(binDir, "peer")
	ordererBin  = filepath.Join(binDir, "orderer")

	configtxyml   = "configtx.yaml"
	configyml     = "config.yaml"
	ordereryml    = "orderer.yaml"
	coreYml       = "core.yaml"
	channel       = "channel"
	defaultMspDir = "msp"

	peers         = "peers"
	consortiums   = "consortiums"
	organizations = "organizations"
	channels      = "channels"
	chaincodes    = "chaincodes"
	orderers      = "orderers"

	windows       = "windows"
	
	caRoot		  = "ca.root"
	caCommon	  = "ca.common"
	tlscaRoot	  = "tlsca.root"
	tlscaCommon	  = "tlsca.common"
)


func Path(paths ...string) string {
	path := filepath.Join(paths...)
	os.RemoveAll(path)
	err := os.MkdirAll(path, 0755)
	if err == nil {
		return path
	}
	return ""
}

func SimpleWrite(path string, fileName string, b []byte) error {
	file, err := os.Create(filepath.Join(path, fileName))
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.WriteString(string(b))
	if err != nil {
		return err
	}
	return nil
}


func WindowsBin(bin string)string{
	if(runtime.GOOS == windows){
		return bin +".exe"
	}
	return bin
}