package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/boltdb/bolt"
	"os"
	"path/filepath"
)

type Bolt struct {
	DB *bolt.DB
}

var Bt *Bolt

func Init() *Bolt {
	config := "config"
	_, err := os.Stat(config)
	if err != nil {
		os.Mkdir(config,os.ModePerm)
	}
	db, err := bolt.Open(filepath.Join(config, "manager.db"), 0600, nil)
	if err == nil {
		Bt = &Bolt{DB: db}
		return Bt
	}
	return nil
}

func (b *Bolt) Add(root string, key string, data map[string]interface{}) error {

	return b.DB.Update(func(tx *bolt.Tx) error {
		_, kb, err := buckets(tx, root, key)
		if err != nil {
			return err
		}
		for k, v := range data {
			str, _ := v.(string)
			if err := kb.Put([]byte(k), []byte(str)); err != nil {
				return fmt.Errorf("failed puting %v key into %v keys bucket: %v", v, k, err)
			}
		}
		return nil
	})
}

func (b *Bolt) AddJson(root string, key string, json []byte) error {

	return b.DB.Update(func(tx *bolt.Tx) error {
		_, kb, err := buckets(tx, root, key)
		if err != nil {
			return err
		}

		if err := kb.Put([]byte(key), json); err != nil {
			return err
		}

		return nil
	})
}

func buckets(tx *bolt.Tx, root string, key string) (*bolt.Bucket, *bolt.Bucket, error) {
	rb, err := tx.CreateBucketIfNotExists([]byte(root))
	if err != nil {
		return nil, nil, fmt.Errorf("failed getting %v bucket: %v", root, err)
	}
	kb, err := rb.CreateBucketIfNotExists([]byte(key))
	if err != nil {
		return nil, nil, fmt.Errorf("failed getting %v key bucket: %v", root, err)
	}

	return rb, kb, nil
}

// func (b *Bolt) View(root string) ([]map[string]string,error) {
// 	var records  []map[string]string
// 	err := b.DB.View(func(tx *bolt.Tx) error {
// 		root := tx.Bucket([]byte(root))
// 		c 	 := root.Cursor()

// 		for k, v := c.First(); k != nil; k, v = c.Next() {
// 			record := make(map[string]string)
// 			key := root.Bucket(k)
// 			key.ForEach(func(k, v []byte) error {
// 				record[string(k)] = string(v)
// 				return nil
// 			})
// 			records = append(records,record)
// 			fmt.Printf("key=%s, value=%s\n", k, v)
// 		}

// 		return nil
// 	})
// 	return records,err
// }

func (b *Bolt) View(root string) ([]interface{}, error) {
	records := make([]interface{}, 0)
	err := b.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(root))
		if root != nil {
			c := root.Cursor()
			for k, v := c.First(); k != nil; k, v = c.Next() {
				rbkt := root.Bucket(k)
				rbkt.ForEach(func(k, v []byte) error {
					var s interface{}
					json.Unmarshal(v, &s)
					records = append(records, s)
					return nil
				})
				fmt.Printf("key=%s, value=%s\n", k, v)
			}
		}

		return nil
	})
	return records, err
}

func (b *Bolt) ViewByKey(root string, key string) (interface{}, error) {
	var i interface{}
	err := b.DB.View(func(tx *bolt.Tx) error {
		rbkt := tx.Bucket([]byte(root))
		if rbkt != nil {
			bkt := rbkt.Bucket([]byte(key))
			if bkt != nil {
				_, v := bkt.Cursor().First()
				json.Unmarshal(v, &i)
				return nil
			}
		}
		return errors.New("Empty Entity")

	})
	return i, err
}

func (b *Bolt) DelByKey(root string, key string) error {
	return b.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(root))
		return root.DeleteBucket([]byte(key))
	})
}
