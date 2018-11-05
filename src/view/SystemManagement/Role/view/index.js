import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
import Search from '../components/Search';
import Table from '../components/Table';
import ModalDelete from 'src/components/ModalComponent'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Socket from 'src/libs/Socket';
import {message} from 'antd'
import LogsComponent from 'src/components/LogsComponent';
import '../index.scss';

@LogsComponent()
@BusinessProvider('OrgStore', 'RoleManagementStore', 'TabStore')
@observer
export default class RoleView extends React.Component {
	state = {
		list: [],
		total: 10,
		loading: false,
		deleteInfo:'',
		deleteShow:false,
	};

	componentWillMount() {
		this.search();
		Socket.on('UPDATE_ROLE_LIST',this.search)
	}
	componentWillUnmount(){
		Socket.off('UPDATE_ROLE_LIST',this.search)
	}

	/**搜索 */
	search = () => {
		this.setState({
			loading: true
		});
		this.props.RoleManagementStore.getList().then((res) => {
			this.setState({
				total: res.result.total,
				list: res.result.list,
				loading: false
			});
		});
	};

	/**修改查询条件 */
	editSearchData = (options) => {
		if(options.roleName){
			options.pageNum=1
		}
		this.props.RoleManagementStore.editSearchData(options).then((res) => {
			this.search();
		});
	};
	/**分页切换查询 */
	onChange = (pageNum, pageSize) => {
		this.editSearchData({ pageNum, pageSize });
	};
	/**新增角色 */
	goPage = (moduleName, childModuleName, data) => {
		this.props.TabStore.goPage({
			moduleName,
			childModuleName,
			history: this.props.history,
			isUpdate: false,
			data
		});
	};
	/**删除角色 */
	deleteAction(item) {
		this.setState({
      deleteShow:true,
      deleteInfo:item,
    })
	}
	deleteOk = () => {
    const { deleteInfo } = this.state
		let { RoleManagementStore } = this.props;
		RoleManagementStore.deleteRole(deleteInfo.id,deleteInfo.roleName).then(res => {
			message.success('角色删除成功')
			 this.deleteCancel()
			 this.search();
		});
  }
  deleteCancel = () => {
    this.setState({
      deleteShow:false
		})
		Socket.emit('UPDATE_ROLE_LIST')
  }
	render() {
		const { menuInfo, RoleManagementStore } = this.props;

		const { searchData } = RoleManagementStore;

		const { list, total, loading } = this.state;
		return (
			<React.Fragment>
			<div className='noTreeTitle'>角色管理</div>
			<div className="role_view">
				<Title key="title" name={''}>
					<Search goPage={this.goPage} searchData={searchData} onChange={this.editSearchData} />
				</Title>
				<Table
					key="soldier"
					total={total}
					deleteAction={this.deleteAction.bind(this)}
					searchData={searchData}
          dataSource={list}
          loading={loading}
					onChange={this.onChange}
					scroll={{ y: '100%' }}
				/>
				 <ModalDelete 
            visible={this.state.deleteShow}
            onOk = {this.deleteOk}
            onCancel = {this.deleteCancel}
            title= '删除确认'
            img = 'delete'
          >
            <p style={{textAlign: 'center'}}>确定删除 <span className='highlight'>{this.state.deleteInfo.roleName}</span></p>
          </ModalDelete>
			</div>
			</React.Fragment>
		);
	}
}
