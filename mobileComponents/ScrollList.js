import React, {Component} from 'react'
import { ListView, Icon } from 'antd-mobile'
import CardItem from './CardItem'

const NUM_ROWS = 20
let pageIndex = 1

export default class ScrollList extends Component {
  constructor (props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }).cloneWithRows(props.initList)

    this.state = {
      rData: [],
      dataSource,
      isLoading: false
    }
  }

  onEndReached = async (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return
    }

    this.setState({ isLoading: true })

    await this.genData(++pageIndex)

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.rData),
      isLoading: false
    })
  }

  async genData (pIndex = 0) {
    const res = await fetch(`https://gank.io/api/data/${this.props.listType}/${NUM_ROWS}/${pIndex}`)
    const json = await res.json()

    this.setState((prevState) => ({
      rData: pIndex === 2
        ? this.props.initList.concat(prevState.rData).concat(json.results)
        : prevState.rData.concat(json.results)
    }))
  }

  render () {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    )

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
          {this.state.isLoading ? <Icon type="loading" /> : '滑动加载更多！'}
        </div>)}
        renderRow={CardItem}
        renderSeparator={separator}
        style={{
          height: this.props.listHeight,
          overflow: 'auto'
        }}
        pageSize={10}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    )
  }
}
