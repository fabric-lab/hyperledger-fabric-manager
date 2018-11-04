package pkg

import (
	"encoding/json"
	"github.com/fabric-lab/fabric-manager/server/pkg/entity"
	"github.com/fabric-lab/fabric-manager/server/pkg/store"
	"github.com/fabric-lab/fabric-manager/server/pkg/util"
	"github.com/gin-gonic/gin"
	"strings"
)

func GetEntitys(c *gin.Context) {
	en := c.Param("entity")
	ens := strings.Split(en, ",")
	entitys := make(map[string][]interface{})
	for _, v := range ens {
		records, err := store.Bt.View(v)
		if err != nil {
			c.JSON(500, gin.H{"Error": err.Error()})
			return
		}

		entitys[v] = records
		var newRecords []interface{}
		for _, r := range records {
			e := entity.MapToEntity(r, v)
			if g, ok := e.(entity.Get); ok {
				g.GetEntity()
				newRecords = append(newRecords, g)
			}
		}
		if newRecords != nil {
			entitys[v] = newRecords
		}
	}
	c.JSON(200, entitys)
}

func GetEntity(c *gin.Context) {
	en := c.Param("entity")
	id := c.Param("id")
	record, err := store.Bt.ViewByKey(en, id)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}
	c.JSON(200, record)
	return

}

func GetNodeState(c *gin.Context) {
	en := c.Param("entity")
	id := c.Param("id")
	cache := util.Caches.Get(en + "." + id)
	if cache != nil {
		c.JSON(200, gin.H{"state": "running"})
		return
	}
	c.JSON(200, gin.H{"state": "stop"})
	return
}

func CreateEntity(c *gin.Context) {
	en := c.Param("entity")
	id := c.Param("id")
	var i interface{}
	c.BindJSON(&i)
	e := entity.MapToEntity(i, en)
	if a, ok := e.(entity.Action); ok {
		a.Create()
	}
	b, _ := json.Marshal(e)

	err := store.Bt.AddJson(en, id, b)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}

func DelEntity(c *gin.Context) {
	en := c.Param("entity")
	id := c.Param("id")
	err := store.Bt.DelByKey(en, id)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}
	records, err := store.Bt.View(en)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(200, records)
}

func ExecCMD(c *gin.Context) {
	en := c.Param("entity")
	id := c.Param("id")
	var cmd map[string]string
	c.BindJSON(&cmd)

	e, err := store.Bt.ViewByKey(en, id)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}
	e = entity.MapToEntity(e, en)

	var res string

	if a, ok := e.(entity.CMD); ok {
		res = a.Exec(cmd)
	}
	cache := util.Caches.Get(en + "." + id)
	state := "stop"
	if cache != nil {
		state = "running"
	}
	c.JSON(200, gin.H{"msg": res, "state": state})
}

func GetCert(c *gin.Context) {

	id := c.Param("id")
	caName := c.Param("ca")

	e, err := store.Bt.ViewByKey("organizations", id)
	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}
	e = entity.MapToEntity(e, "organizations")
	if o, ok := e.(*entity.Organization); ok {

		ca, key, err := entity.GetCA(caName, *o)
		if err != nil {
			c.JSON(500, gin.H{"Error": err.Error()})
			return
		}
		ca.SignCert.Raw = []byte{}
		ca.SignCert.RawTBSCertificate = []byte{}
		ca.SignCert.RawSubjectPublicKeyInfo = []byte{}
		ca.SignCert.RawSubject = []byte{}
		ca.SignCert.RawIssuer = []byte{}
		ca.SignCert.PublicKey = []byte{}

		cert, _ := json.Marshal(ca.SignCert)
		c.JSON(200, gin.H{
			"ca":  string(cert),
			"key": key,
		})
	} else {
		if err != nil {
			c.JSON(500, gin.H{"Error": "error"})
			return
		}
	}

}
