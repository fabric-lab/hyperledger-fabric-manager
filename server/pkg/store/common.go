package store

import (
//"errors"
//"encoding/json"
)

var (
	ConsortiumBucket   = "consortium"
	OrganizationBucket = "organization"
)

type Consortium struct {
	//OrderName string
	Name     string
	Type     string
	Desc     string
	MspNames []string
}

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

type MSP struct {
	Name string
	Path string
	Type string
	Role string
}

// func GetConsortiumByName(name string) ( *Consortium,error){
// 	consortium := &Consortium{}
// 	key :=name
// 	record,err  := bolt.ViewByKey(ConsortiumBucket,key)
// 	if err != nil {
// 		return consortium ,err
// 	}
// 	for _, data := range record {
// 		json.Unmarshal([]byte(data), consortium)
// 		return consortium,nil
// 	}

// 	return  consortium,errors.New("NOT FOUND")

// }

// func GetOrganizationByName(name string)(*Organization,error){
// 	organization := &Organization{}
// 	key := name
// 	record,err  := bolt.ViewByKey(OrganizationBucket,key)
// 	if err != nil {
// 		return organization,err
// 	}
// 	for _, data := range record {
// 		json.Unmarshal([]byte(data), organization)
// 		return organization,nil
// 	}

// 	return organization,errors.New("NOT FOUND")
// }
