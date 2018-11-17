package main

import (
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/entity"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/store"
	"github.com/fabric-lab/hyperledger-fabric-manager/server/pkg/util"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	util.Init()
	entity.Init()
	store.Init()
	defer store.Bt.DB.Close()
	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("static", false)))

	r.GET("/api/entity/:entity", pkg.GetEntitys)
	r.GET("/api/entity/:entity/:id", pkg.GetEntity)
	r.GET("/api/entity/:entity/:id/state", pkg.GetNodeState)
	r.POST("/api/entity/:entity/:id", pkg.CreateEntity)
	r.PUT("/api/entity/:entity/:id", pkg.UpdateEntity)
	r.PUT("/api/entity/:entity/:id/cmd", pkg.ExecCMD)
	r.DELETE("/api/entity/:entity/:id", pkg.DelEntity)

	r.GET("/api/organizations/:id/:ca", pkg.GetCert)
	r.Run()
}
