package entity

import (
	"fmt"
	
	"io/ioutil"
	"os"
	"path/filepath"

)

type MSP struct {
	Name string
	Path string
	Type string
	Role string
	Roots []string
	Intermediates []string
	Ous string
	Administrators []string
	CRL []string
	NodeId string
	TlsRoots []string
	TlsIntermediates []string
}


func (m *MSP)ExportMSP(o *Organization) error {
	// create folder structure
	mspDir := filepath.Join(m.Path, "msp")
	tlsDir := filepath.Join(m.Path, "tls")

	err := m.createFolderStructure(mspDir, true)
	if err != nil {
		return err
	}

	err = os.MkdirAll(tlsDir, 0755)
	if err != nil {
		return err
	}

	//cacerts
	for _, v := range m.Roots {
		pem,err := o.getPEMByName(v)
		if(err == nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			err  = ioutil.WriteFile(filepath.Join(mspDir, "cacerts",fileName), []byte(pem.Cert), 0644)
			
		}
	}

	for _, v := range m.Intermediates {
		pem,err := o.getPEMByName(v)
		if(err == nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			ioutil.WriteFile(filepath.Join(mspDir, "intermediatecerts",fileName), []byte(pem.Cert), 0644)
		}
	}

	for _, v := range m.Administrators {
		pem,err := o.getPEMByName(v)
		if(err == nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			ioutil.WriteFile(filepath.Join(mspDir, "admincerts",fileName), []byte(pem.Cert), 0644)
		}
	}

	for _, v := range m.CRL {
		pem,err := o.getPEMByName(v)
		if(err != nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			ioutil.WriteFile(filepath.Join(mspDir, "crls",fileName), []byte(pem.Cert), 0644)
		}
	}

	for _, v := range m.TlsRoots {
		pem,err := o.getPEMByName(v)
		if(err == nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			ioutil.WriteFile(filepath.Join(mspDir, "tlscacerts",fileName), []byte(pem.Cert), 0644)
		}
	}

	for _, v := range m.TlsIntermediates {
		pem,err := o.getPEMByName(v)
		if(err == nil){
			fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
			ioutil.WriteFile(filepath.Join(mspDir, "tlsintermediatecerts",fileName), []byte(pem.Cert), 0644)
		}
	}
	ioutil.WriteFile(filepath.Join(mspDir, "config.yaml"), []byte(m.Ous), 0644)
	pem,err := o.getPEMByName(m.NodeId)
	fileName  := fmt.Sprintf("%s.%s",pem.Name,"pem")
	ioutil.WriteFile(filepath.Join(mspDir, "signcerts",fileName), []byte(pem.Cert), 0644)
	ioutil.WriteFile(filepath.Join(mspDir, "keystore","key"), []byte(pem.Key), 0644)

	
	return nil
}

func (m *MSP) createFolderStructure(rootDir string, local bool) error {

	var folders []string
	// create admincerts, cacerts, keystore and signcerts folders
	folders = []string{
		filepath.Join(rootDir, "admincerts"),
		filepath.Join(rootDir, "cacerts"),
		filepath.Join(rootDir, "tlscacerts"),
		filepath.Join(rootDir, "tlsintermediatecerts"),
		
	}
	if local {
		folders = append(folders, filepath.Join(rootDir, "keystore"),
			filepath.Join(rootDir, "signcerts"))
	}

	for _, folder := range folders {
		err := os.MkdirAll(folder, 0755)
		if err != nil {
			return err
		}
	}

	return nil
}