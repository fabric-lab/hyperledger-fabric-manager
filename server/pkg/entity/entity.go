package entity

import (
	"github.com/mitchellh/mapstructure"
	"reflect"
)

type Action interface {
	Create() error
}

type Get interface {
	GetEntity() error
}

var entityRegistry = make(map[string]reflect.Type)

func Init() {
	entityRegistry["organizations"] = reflect.TypeOf(Organization{})
	entityRegistry["peers"] = reflect.TypeOf(Peer{})
}

func GetEntityInstance(name string) interface{} {
	if entityRegistry[name] == nil {
		return nil
	}
	v := reflect.New(entityRegistry[name]).Elem()
	return v.Interface()
}

func MapToEntity(i interface{}, entityName string) interface{} {
	switch entityName {
	case "peers":
		var e Peer
		mapstructure.Decode(i, &e)
		return &e
	case "orderers":
		var e Orderer
		mapstructure.Decode(i, &e)
		return &e
	case "organizations":
		var e Organization
		mapstructure.Decode(i, &e)
		return &e
	case "consortiums":
		var e Consortium
		mapstructure.Decode(i, &e)
		return &e
	case "channels":
		var e Channel
		mapstructure.Decode(i, &e)
		return &e
	case "chaincodes":
		var e ChainCode
		mapstructure.Decode(i, &e)
		return &e
	}
	return i
}
