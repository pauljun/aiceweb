import React from 'react';
import IconFont from 'src/components/IconFont';
import moment from 'moment';
import WaterMark from 'src/components/WaterMarkView';
import ReactEcharts from 'echarts-for-react';
import { getKeyValue, marital, sex, nation } from '../../../../libs/Dictionary';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import './residenceHeader.scss';

class ResidenceHeader extends React.Component {
	constructor(props) {
		super(props);
	}
	getOtionTem = () => {
		let { peopleCountList = [] } = this.props;
		let yAxisList = [],
			xAxisList = [];
		if (peopleCountList.length > 0) {
			peopleCountList.map((v) => {
				xAxisList.unshift(v.value);
				yAxisList.unshift(v.key.slice(5, 10));
			});
		}
		const option = {
			color: [ '#3398DB' ],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: 0,
				top: 10,
				right: 36,
				bottom: 20,
				containLabel: true
			},
			yAxis: [
				{
					type: 'category',
					data: yAxisList,
					axisTick: {
						alignWithLabel: true,
						show: false
					},
					axisLine: {
						show: false
					}
				}
			],
			xAxis: [
				{
					type: 'value',
					minInterval: 1,
					axisLine: {
						show: false
					},
					axisTick: {
						alignWithLabel: true,
						show: false
					}
				}
			],
			series: [
				{
					name: '抓拍数量',
					color: '#8899BB',
					type: 'bar',
					barWidth: '30%',
					label: {
						normal: {
							show: false,
							// position: 'right'
						}
					},
					data: xAxisList
				}
			]
		};
		return option;
	};
	render() {
		let { tipModalChange, data = {} } = this.props;
		let item = [],
			itemT = [];
		data.tagList &&
			data.tagList.map((v) => {
				if (v.tagCode == 0 && v.tagName) {
					if (v.tagName.indexOf(';') > 0 || v.tagName.indexOf('；') > 0) {
						let arr = v.tagName.replace(/;/gi, '；').split('；');
						itemT = itemT.concat(arr);
					} else {
						itemT.push(v.tagName);
					}
				} else if(v.tagType !== 118500){
					item.push(v.tagName);
				}
			});
		let tagList = item.concat(itemT).filter((v) => v !== '') || [];
		return (
			<div className="community_residence_header">
				<p className="header_title">人员信息：</p>
				<div className="header_content">
					<div className="header_left">
					<WaterMark 	className={'left_img'}
							background={true}
							type='face'
							src={data.portraitPicUrl}/>
					</div>
					<div className="header_right">
						<div className="right_message">
							<p className="message_name">{data.name}</p>
							<div className="message_content">
								<div className="text_box">
									<span className="text_value">手机号码：</span>
									<p className="content_text">{data.mobile}</p>
								</div>
								<div className="text_box">
									<span className="text_value">婚姻状况：</span>
									<p className="content_text">{data.maritalStatus && getKeyValue(marital, data.maritalStatus)}</p>
								</div>
								<div className="text_box content_nation">
									<span className="text_value">性别:</span>
									<p className="content_text ">{data.gender && getKeyValue(sex, data.gender)}</p>
								</div>
								<div className="text_box content_nation">
									<span className="text_value">民族：</span>
									<p className="content_text ">{data.nation && getKeyValue(nation, data.nation)}</p>
								</div>
								<div className="text_box">
									<span className="text_value">出生日期：</span>
									<p className="content_text">{data.birthDate && moment(+data.birthDate).format('YYYY年MM月DD日')}</p>
								</div>
								<div className="text_box content_adress">
									<span className="text_value">住址：</span>
									<p className="content_text" title={data.presentAddress}>
										{data.presentAddress}
									</p>
								</div>
								<div className="text_box">
									<span className="text_value">身份证号：</span>
									<p className="content_text">{data.credentialNo}</p>
								</div>
							</div>
							<div className="message_content_lately">
								<div className="text_box">
									<span className="text_value">最近出现时间：</span>
									<p className="content_text">{data.recentTime}</p>
								</div>
								<div className="text_box">
									<span className="text_value">最近出现地点：</span>
									<p className="content_text" title={data.recentAddress}>
										{data.recentAddress}
									</p>
								</div>
								<div className="text_box">
									<span className="text_value">三天内出现次数：</span>
									<p className="content_text">{data.appearTimesForThreeDays}</p>
								</div>
							</div>
							<div className="message_content_label">
								<p className="label_title">标签：</p>
								<div className="label_value_box">
									{tagList &&
										tagList.map((v, index) => {
											return (
												<span className="label_value" key={index}>
													{v}
												</span>
											);
										})}
									<AuthComponent actionName="RegisteredManagement">
										<span className="label_add" onClick={tipModalChange}>
											<IconFont type={'icon-Zoom__Light'} theme="outlined" />
										</span>
									</AuthComponent>
								</div>
							</div>
						</div>
						<div className="right_chart">
							<div className="chart_title">近七天抓拍次数</div>
							<ReactEcharts option={this.getOtionTem()} style={{ height: 'calc(100% - 25px)' }} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ResidenceHeader;
