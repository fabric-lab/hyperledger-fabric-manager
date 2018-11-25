package entity

import (
	
	"crypto"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"github.com/hyperledger/fabric/bccsp"
	"github.com/hyperledger/fabric/bccsp/factory"
	"github.com/hyperledger/fabric/bccsp/signer"
	"github.com/hyperledger/fabric/common/tools/cryptogen/ca"
	"github.com/hyperledger/fabric/common/tools/cryptogen/csp"
	"github.com/hyperledger/fabric/common/tools/cryptogen/msp"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"github.com/mitchellh/mapstructure"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/store"
)

type Organization struct {
	Country            string
	Province           string
	Locality           string
	Organization       string
	CommonName         string
	OrganizationalUnit string
	StreetAddress      string
	PostalCode         string
	PEMs               []PEM
	MSPs               []MSP
}

type PEM struct {
	Name string
	Key  string
	Cert string
	Type string
}






func (o *Organization) Create() error {

	o.generateRootCa()
	nodeName, mspPath, err := o.initMsp(msp.ORDERER)
	if err != nil {
		return err
	}
	o.MSPs = append(o.MSPs, MSP{Name: nodeName, Path: mspPath, Type: "orderer", Role: "orderer"})

	nodeName, mspPath, err = o.initMsp(msp.PEER)
	if err != nil {
		return err
	}
	o.MSPs = append(o.MSPs, MSP{Name: nodeName, Path: mspPath, Type: "peer", Role: "peer"})

	nodeName, mspPath, err = o.initAdminMsp()
	if err != nil {
		return err
	}
	o.MSPs = append(o.MSPs, MSP{Name: nodeName, Path: mspPath, Type: "peer", Role: "admin"})

	return nil
}


func (o *Organization) Update(i interface{}) error {
	v, ok := i.(map[string]interface{})
	if ok {
		if(v["Oper"].(string)  == "add_cert"){
			parentCa := ""
			if(v["ParentCa"] != nil){
				parentCa = v["ParentCa"].(string)
			}
			o.addCert(v["CommonName"].(string) ,parentCa,v["IsTLS"].(string) );
		}else if(v["Oper"].(string)  == "add_pem"){
			key := ""
			if(v["Key"] != nil){
				key = v["Key"].(string)
			}
			o.addPem(v["Cert"].(string),key,v["IsTLS"].(string))
		}else if(v["Oper"].(string)  == "add_msp"){
			o.addMsp(i)
		}
	}
	
	return nil
}

func (o *Organization) addMsp(i interface{}) error{
	var m MSP
	mapstructure.Decode(i, &m)
	o.MSPs = append(o.MSPs,m)
	return nil
}

func (o *Organization) exportMsp(name string) error{
	for _, v := range o.MSPs {
		if(v.Name == name){

		}
	}

	return nil
}


func (o *Organization) addPem(certdata string,key string,isTls string ) error {
	cBlock, _ := pem.Decode([]byte(certdata))
	if cBlock == nil {
		return errors.New("no PEM data found for certificate")
	}
	cert, err := x509.ParseCertificate(cBlock.Bytes)
	if err != nil {
		return err
	}
	issue := cert.Issuer.CommonName
	subject := cert.Subject.CommonName
	caType := caCommon
	if(issue == subject){
		if(isTls == "yes"){
			caType = tlscaRoot
		}else{
			caType = caRoot
		}
	}else{
		if(isTls == "yes"){
			caType = tlscaCommon
		}else{
			caType = caCommon
		}
	}
	pem := &PEM{Name: subject, Type: caType}
	pem.Key = key
	pem.Cert = certdata
	o.PEMs = append(o.PEMs, *pem)
	return nil
}

func (o *Organization)getPEMByName(name string) (PEM,error) {
	for _,v := range o.PEMs {
		if(v.Name == name){
			return v,nil
		}
	}
	return nil,errors.New("no PEM found ")
}

func (o *Organization) addCert(caName string,parentCaName string,isTls string ) error {
	if(parentCaName != ""){
		parentCa, _, err := o.GetCA(parentCaName)
		if err != nil {
			return err
		}
		caType := caCommon
		if(isTls == "yes"){
			caType = tlscaCommon
		}
		o.generateCa(parentCa,caName,caType)
	}else{
		rootCA, err := ca.NewCA(tempDir, o.Organization, caName, o.Country, o.Province, o.Locality, o.OrganizationalUnit, o.StreetAddress, o.PostalCode)
		if err != nil {
			return err
		}
		caType := caRoot
		if(isTls == "yes"){
			caType = tlscaRoot
		}
		err = o.appendPEM(rootCA.Name, caType)
		if err != nil {
			return err
		}
	}
	return nil
}

func (o *Organization) generateRootCa() error {
	os.RemoveAll(tempDir)

	// generate ROOT CA
	rootCA, err := ca.NewCA(tempDir, o.Organization, "ca."+o.CommonName, o.Country, o.Province, o.Locality, o.OrganizationalUnit, o.StreetAddress, o.PostalCode)
	if err != nil {
		return err
	}
	err = o.appendPEM(rootCA.Name, caRoot)
	if err != nil {
		return err
	}
	// generate TLS CA
	os.RemoveAll(tempDir)
	tlsCA, err := ca.NewCA(tempDir, o.Organization, "tlsca."+o.CommonName, o.Country, o.Province, o.Locality, o.OrganizationalUnit, o.StreetAddress, o.PostalCode)
	if err != nil {
		return err
	}
	err = o.appendPEM(tlsCA.Name, tlscaRoot)
	if err != nil {
		return err
	}
	// generate Admin CA
	o.generateCa(rootCA,"admin@"+o.CommonName,caCommon)

	return nil
}

func (o *Organization) generateCa(signCA *ca.CA,commonName string,caType string) error {
	os.RemoveAll(tempDir)
	// generate private key
	priv, _, err := csp.GeneratePrivateKey(tempDir)
	if err != nil {
		return err
	}

	// get public key
	ecPubKey, err := csp.GetECPublicKey(priv)
	if err != nil {
		return err
	}

	var ous []string

	_, err = signCA.SignCertificate(tempDir,
		commonName, ous, nil, ecPubKey, x509.KeyUsageDigitalSignature, []x509.ExtKeyUsage{})
	if err != nil {
		return err
	}
	err = o.appendPEM(commonName, caType)
	if err != nil {
		return err
	}
	return nil
}

func (o *Organization)appendPEM(name string, caType string) (error) {
	pem := &PEM{Name: name, Type: caType}
	files, err := ioutil.ReadDir(tempDir)
	if err != nil {
		return  err
	}
	for _, f := range files {
		b, err := ioutil.ReadFile(filepath.Join(tempDir,f.Name()))
		if err != nil {
			return  err
		}
		if strings.Index(f.Name(), "cert.pem") != -1 {
			pem.Cert = string(b)
		} else {
			pem.Key = string(b)
		}
	}
	o.PEMs = append(o.PEMs, *pem)
	return nil
}


func (o *Organization) initMsp(nodeType int) (string, string, error) {
	var (
		node     string
		nodeName string
	)

	if nodeType == msp.ORDERER {
		node = "order"
		nodeName = "order." + o.CommonName
	} else {
		node = "peer"
		nodeName = "peer0." + o.CommonName
	}

	signCA, _, err := o.GetCA("ca."+o.CommonName)
	if err != nil {
		return "", "", err
	}
	tlsCA, _, err := o.GetCA("tlsca."+o.CommonName)
	if err != nil {
		return "", "", err
	}
	mspPath := Path(mspDir, o.CommonName, node+"s", nodeName)
	if err != nil {
		return "", "", err
	}
	os.RemoveAll(mspPath)
	err = msp.GenerateLocalMSP(mspPath, nodeName, []string{}, signCA, tlsCA, nodeType, false)
	if err != nil {
		return "", "", err
	}

	//copy admin cert
	adminCA, _, err := o.GetCA("admin@"+o.CommonName)
	if err != nil {
		return "", "", err
	}
	adminPath := filepath.Join(mspPath, "msp", "admincerts")
	os.RemoveAll(adminPath)
	adminCertPath := filepath.Join(adminPath)
	os.Mkdir(adminCertPath, 0755)
	adminCertPath = filepath.Join(adminCertPath, adminCA.Name+"-cert.pem")
	pemExport(adminCertPath, "CERTIFICATE", adminCA.SignCert.Raw)
	return nodeName, mspPath, nil

}

func (o *Organization) initAdminMsp() (string, string, error) {
	node := "admin"
	nodeName := "admin." + o.CommonName
	signCA, _, err := o.GetCA("ca."+o.CommonName)
	if err != nil {
		return "", "", err
	}
	tlsCA, _, err := o.GetCA("tlsca."+o.CommonName)
	if err != nil {
		return "", "", err
	}
	mspPath := Path(mspDir, o.CommonName, node+"s", nodeName)
	if err != nil {
		return "", "", err
	}
	os.RemoveAll(mspPath)
	err = msp.GenerateLocalMSP(mspPath, nodeName, []string{}, signCA, tlsCA, msp.PEER, false)
	if err != nil {
		return "", "", err
	}

	//copy admin cert
	adminCA, key, err := o.GetCA("admin@"+o.CommonName)
	if err != nil {
		return "", "", err
	}
	adminPath := filepath.Join(mspPath, "msp", "admincerts")
	os.RemoveAll(adminPath)
	adminCertPath := filepath.Join(adminPath)
	os.Mkdir(adminCertPath, 0755)
	adminCertPath = filepath.Join(adminCertPath, adminCA.Name+"-cert.pem")
	pemExport(adminCertPath, "CERTIFICATE", adminCA.SignCert.Raw)

	signPath := filepath.Join(mspPath, "msp", "signcerts")
	os.RemoveAll(signPath)
	signCertPath := filepath.Join(signPath)
	os.Mkdir(signCertPath, 0755)
	signCertPath = filepath.Join(signCertPath, nodeName+"-cert.pem")
	pemExport(signCertPath, "CERTIFICATE", adminCA.SignCert.Raw)

	//key
	keyPath := filepath.Join(mspPath, "msp", "keystore")
	writeAdminKey(key, keyPath)
	if err != nil {
		return "", "", err
	}
	return nodeName, mspPath, nil

}

func (o *Organization) GetCA(commonName string) (*ca.CA, string, error) {
	for _, v := range o.PEMs {
		if v.Name == commonName {
			cBlock, _ := pem.Decode([]byte(v.Cert))
			if cBlock == nil {
				return nil, "", errors.New("no PEM data found for certificate")
			}
			cert, err := x509.ParseCertificate(cBlock.Bytes)
			if err != nil {
				return nil, "", err
			}
			
			ca := &ca.CA{
				Name:               commonName,
				SignCert:           cert,
				Country:            o.Country,
				Province:           o.Province,
				Locality:           o.Locality,
				OrganizationalUnit: o.OrganizationalUnit,
				StreetAddress:      o.StreetAddress,
				PostalCode:         o.PostalCode,
			}
			if(v.Key!=""){
				_, signer, err := LoadSigner(v.Key)
				if err != nil {
					return nil, "", err
				}
				ca.Signer = signer
			}
			return ca, v.Key, nil
		}
	}
	return nil, "", nil
}

func pemExport(path, pemType string, bytes []byte) error {
	//write pem out to file
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	return pem.Encode(file, &pem.Block{Type: pemType, Bytes: bytes})
}



func writeAdminKey(key string, path string) error {
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return err
	}
	for _, f := range files {
		file, err := os.Create(filepath.Join(path, f.Name()))
		if err != nil {
			return err
		}
		defer file.Close()
		_, err = file.WriteString(string(key))
		if err != nil {
			return err
		}
		return nil
	}
	return nil
}



func getCAName(caType string, commonName string) string {
	if caType == "ca" {
		return "ca." + commonName
	} else if caType == "tls" {
		return "tlsca." + commonName
	}
	return "ca." + commonName
}

func LoadSigner(rawKey string) (bccsp.Key, crypto.Signer, error) {
	var err error
	var priv bccsp.Key
	var s crypto.Signer

	opts := &factory.FactoryOpts{
		ProviderName: "SW",
		SwOpts: &factory.SwOpts{
			HashFamily: "SHA2",
			SecLevel:   256,
		},
	}

	csp, err := factory.GetBCCSPFromOpts(opts)
	if err != nil {
		return nil, nil, err
	}

	block, _ := pem.Decode([]byte(rawKey))
	priv, err = csp.KeyImport(block.Bytes, &bccsp.ECDSAPrivateKeyImportOpts{Temporary: true})
	if err != nil {
		return nil, nil, err
	}

	s, err = signer.New(csp, priv)
	if err != nil {
		return nil, nil, err
	}

	return priv, s, err
}

func getMspByName(mspName string) (MSP, error) {

	var m MSP
	records, err := store.Bt.View(organizations)
	if err != nil {
		return m, err
	}
	for _, v := range records {
		i := MapToEntity(v, organizations)
		if o, ok := i.(*Organization); ok {
			for _, m := range o.MSPs {
				if mspName == m.Name {
					return m, nil
				}
			}
		}

	}
	return m, errors.New("Not find Msp")
}

func getOrgByName(oName string) (*Organization, error) {
	var o *Organization
	i, err := store.Bt.ViewByKey(organizations, oName)
	if err != nil {
		return o, err
	}
	i = MapToEntity(i, organizations)
	if o, ok := i.(*Organization); ok {
		return o, nil
	}
	return o, nil
}
