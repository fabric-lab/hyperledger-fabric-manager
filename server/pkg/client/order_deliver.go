/*
Copyright IBM Corp. 2017 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

                 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package client

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"github.com/hyperledger/fabric/common/flogging"
	"github.com/hyperledger/fabric/common/localmsp"
	"github.com/hyperledger/fabric/common/tools/protolator"
	"github.com/hyperledger/fabric/core/comm"
	mspmgmt "github.com/hyperledger/fabric/msp/mgmt"
	ordererConfig "github.com/hyperledger/fabric/orderer/common/localconfig"
	"github.com/hyperledger/fabric/protos/common"
	ab "github.com/hyperledger/fabric/protos/orderer"
	"github.com/hyperledger/fabric/protos/utils"
	"github.com/pkg/errors"
	"time"
)

var logger = flogging.MustGetLogger("client")

type deliverClientIntf interface {
	getSpecifiedBlock(num uint64) (*common.Block, error)
	getOldestBlock() (*common.Block, error)
	getNewestBlock() (*common.Block, error)
	Close() error
}

type DeliverClient struct {
	client      ab.AtomicBroadcast_DeliverClient
	chainID     string
	tlsCertHash []byte
}

func NewDeliverClient(chainID string) (*DeliverClient, error) {
	config, err := initConfig()
	if err != nil {
		return nil, err
	}

	clientConfig := comm.ClientConfig{}
	clientConfig.Timeout = time.Second * 3
	gClient, err := comm.NewGRPCClient(clientConfig)
	address := fmt.Sprintf("%s:%d", config.General.ListenAddress, config.General.ListenPort)
	conn, err := gClient.NewConnection(address, "")
	if err != nil {
		return nil, err
	}
	dc, err := ab.NewAtomicBroadcastClient(conn).Deliver(context.TODO())
	if err != nil {
		return nil, errors.WithMessage(err, "failed to create deliver client")
	}

	return &DeliverClient{client: dc, chainID: chainID}, nil
}

func seekHelper(
	chainID string,
	position *ab.SeekPosition,
	tlsCertHash []byte,
) *common.Envelope {

	seekInfo := &ab.SeekInfo{
		Start:    position,
		Stop:     position,
		Behavior: ab.SeekInfo_BLOCK_UNTIL_READY,
	}

	env, err := utils.CreateSignedEnvelopeWithTLSBinding(
		common.HeaderType_CONFIG_UPDATE, chainID, localmsp.NewSigner(),
		seekInfo, int32(0), uint64(0), tlsCertHash)
	if err != nil {
		logger.Errorf("Error signing envelope:  %s", err)
		return nil
	}
	return env
}

func (r *DeliverClient) seekSpecified(blockNumber uint64) error {
	return r.client.Send(seekHelper(r.chainID, &ab.SeekPosition{
		Type: &ab.SeekPosition_Specified{
			Specified: &ab.SeekSpecified{
				Number: blockNumber}}}, r.tlsCertHash))
}

func (r *DeliverClient) seekOldest() error {
	return r.client.Send(seekHelper(r.chainID,
		&ab.SeekPosition{Type: &ab.SeekPosition_Oldest{
			Oldest: &ab.SeekOldest{}}}, r.tlsCertHash))
}

func (r *DeliverClient) seekNewest() error {
	return r.client.Send(seekHelper(r.chainID,
		&ab.SeekPosition{Type: &ab.SeekPosition_Newest{
			Newest: &ab.SeekNewest{}}}, r.tlsCertHash))
}

func (r *DeliverClient) readBlock() (*common.Block, error) {
	msg, err := r.client.Recv()
	if err != nil {
		return nil, fmt.Errorf("Error receiving: %s", err)
	}

	switch t := msg.Type.(type) {
	case *ab.DeliverResponse_Status:
		logger.Debugf("Got status: %v", t)
		return nil, fmt.Errorf("can't read the block: %v", t)
	case *ab.DeliverResponse_Block:
		logger.Debugf("Received block: %v", t.Block.Header.Number)
		r.client.Recv() // Flush the success message
		return t.Block, nil
	default:
		return nil, fmt.Errorf("response error: unknown type %T", t)
	}
}

func (r *DeliverClient) GetSpecifiedBlock(num uint64) (string, error) {
	err := r.seekSpecified(num)
	if err != nil {
		logger.Errorf("Received error: %s", err)
		return "", err
	}
	var b bytes.Buffer
	writer := bufio.NewWriter(&b)
	block, err := r.readBlock()
	if err != nil {
		return "", err
	}
	protolator.DeepMarshalJSON(writer, block)
	if err != nil {
		return "", err
	}
	return string(b.Bytes()), nil
}

func (r *DeliverClient) GetOldestBlock() (string, error) {
	err := r.seekOldest()
	if err != nil {
		logger.Errorf("Received error: %s", err)
		return "", err
	}
	var b bytes.Buffer
	writer := bufio.NewWriter(&b)
	block, err := r.readBlock()
	if err != nil {
		return "", err
	}
	protolator.DeepMarshalJSON(writer, block)
	if err != nil {
		return "", err
	}
	return string(b.Bytes()), nil
}

func (r *DeliverClient) GetNewestBlock() (string, error) {
	err := r.seekNewest()
	if err != nil {
		logger.Errorf("Received error: %s", err)
		return "", err
	}
	var b bytes.Buffer
	writer := bufio.NewWriter(&b)
	block, err := r.readBlock()
	if err != nil {
		return "", err
	}
	protolator.DeepMarshalJSON(writer, block)
	if err != nil {
		return "", err
	}
	return string(b.Bytes()), nil
}

func (r *DeliverClient) Close() error {
	return r.client.CloseSend()
}

func initConfig() (*ordererConfig.TopLevel, error) {
	config, err := ordererConfig.Load()
	if err != nil {
		return nil, err
	}
	// Load local MSP
	err = mspmgmt.LoadLocalMsp(config.General.LocalMSPDir, config.General.BCCSP, config.General.LocalMSPID)
	if err != nil { // Handle errors reading the config file
		return nil, err
	}
	return config, nil
}
