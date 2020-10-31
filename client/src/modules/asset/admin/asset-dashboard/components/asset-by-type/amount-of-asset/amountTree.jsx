



import React, { Component } from 'react';

import AmountBarChart from './amountBarChart';

import * as d3 from 'd3-format';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';

class AmountTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: false
        }
    }

    handleChangeViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                tree: value
            }
        })
    }

    render() {
        const { assetType, listAssets, translate, setAmountOfAsset } = this.props;
        const { tree } = this.state;
        let typeName = [], countAssetType = [], idAssetType = [];

        for (let i in assetType) {
            countAssetType[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetType.indexOf(asset.assetType[k]._id);
                    countAssetType[idx]++;
                }
            })
            for (let i in assetType) {

                let val = d3.format(",")(countAssetType[i])
                let title = `${assetType[i].typeName} - ${val} `

                typeName.push(assetType[i].typeName);

                chart.push({
                    id: assetType[i]._id,
                    typeName: title,
                    parentId: assetType[i].parent,
                })
            }
        }
        let dataTree = chart && chart.map(node => {
            return {
                ...node,
                id: node.id,
                text: node.typeName,
                parent: node.parentId ? node.parentId.toString() : "#"
            }
        })

        return (
            <div className="amout-asset" id="amout-asset">
                <div className="box-tools pull-right">
                    <div className="btn-group pull-right">
                        <button type="button" className={`btn btn-xs ${tree ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>{translate('asset.dashboard.bar_chart')}</button>
                        <button type="button" className={`btn btn-xs ${tree ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>{translate('asset.dashboard.tree')}</button>
                    </div>
                </div>
                {
                    tree ?
                        <div>
                            <br />
                            {/* Cây số lượng tài sản */}
                            <Tree
                                id="tree-qlcv-amount-asset"
                                data={dataTree}
                                plugins={false}
                            />
                        </div> :
                        <AmountBarChart
                            listAssets={listAssets}
                            assetType={assetType}
                            setAmountOfAsset={setAmountOfAsset}
                        />
                }
            </div>
        )
    }
}

export default (withTranslate(AmountTree));