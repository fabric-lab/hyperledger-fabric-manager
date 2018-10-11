package util

import (
	// "fmt"
	"sync"
	"time"
)

//过期时间 10小时
const Time int64 = 1 //3600 * 10

//动态缓存数据库
var Caches *CacheManager

type CacheManager struct {
	lock   *sync.RWMutex
	caches map[string]*Cache
}

type Cache struct {
	Value interface{}
	Times int64
}

func Init() {
	Caches = NewCacheManager(300)
}

func NewCacheManager(size int) *CacheManager {
	return &CacheManager{new(sync.RWMutex), make(map[string]*Cache, size)}
}

func (this *CacheManager) Set(key string, v interface{}) {
	this.lock.Lock()
	x := Cache{Value: v, Times: Time}
	this.caches[key] = &x
	this.lock.Unlock()
}

func (this *CacheManager) Get(key string) *Cache {
	this.lock.RLock()
	v := this.caches[key]
	this.lock.RUnlock()
	return v
}

func (this *CacheManager) Delete(key string) *Cache {
	this.lock.Lock()
	v := this.caches[key]
	delete(this.caches, key)
	this.lock.Unlock()
	return v
}

func (this *CacheManager) IsExist(key string) bool {
	if xy := this.Get(key); xy != nil {
		return true
	} else {
		return false
	}
}

func (this *CacheManager) IsExpired(key string, ttl int) bool {

	if xy := this.Get(key); xy != nil {
		return (time.Now().Unix() - xy.Times) >= int64(ttl)
	} else {
		return true
	}
}
