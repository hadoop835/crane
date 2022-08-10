import React, { useState } from 'react';
import { Col, Row } from 'tdesign-react';
import useDynamicChart from 'hooks/useDynamicChart';
import { getLineChartOptions } from '../chart';
import Style from './MemoryChart.module.less';
import SeriesLineChart, { ISeriesLineChart } from '../../../../components/SeriesLineChart';

const lineOptions = getLineChartOptions();

const item: ISeriesLineChart = {
  title: 'Memory 资源使用',
  subTitle: '( GB )',
  datePicker: true,
  timeRange: 3600,
  step: '1h',
  xAxis: { type: 'time' },
  lines: [
    {
      name: 'capacity',
      query: `SUM(kube_node_status_capacity{resource="memory", unit="byte"}  * on (node) group_left() max(kube_node_labels{label_beta_kubernetes_io_instance_type!="eklet", label_node_kubernetes_io_instance_type!~"eklet"}) by (node)  / 1024 / 1024 / 1024 )`,
    },
    {
      name: 'request',
      query: `SUM(kube_pod_container_resource_requests{resource="memory", unit="byte", namespace!=""} * on (node) group_left() max(kube_node_labels{label_beta_kubernetes_io_instance_type!="eklet", label_node_kubernetes_io_instance_type!~"eklet"}) by (node)/ 1024 / 1024 / 1024)`,
    },
    {
      name: 'usage',
      query: `SUM(container_memory_usage_bytes{image!=""}   * on (node) group_left() max(kube_node_labels{label_beta_kubernetes_io_instance_type!="eklet", label_node_kubernetes_io_instance_type!~"eklet"}) by (node) / 1024 / 1024 / 1024)`,
    },
    {
      name: 'limits',
      query: `SUM(kube_pod_container_resource_limits{resource="memory", unit="byte", namespace!=""} * on (node) group_left() max(kube_node_labels{label_beta_kubernetes_io_instance_type!="eklet", label_node_kubernetes_io_instance_type!~"eklet"}) by (node) / 1024 / 1024 / 1024)`,
    },
  ],
};
const MemoryChart = () => {
  const [customOptions, setCustomOptions] = useState(lineOptions);

  const onTimeChange = (value: Array<string>) => {
    const options = getLineChartOptions(value);
    setCustomOptions(options);
  };

  const dynamicLineChartOption = useDynamicChart(customOptions, {
    placeholderColor: ['legend.textStyle.color', 'xAxis.axisLabel.color', 'yAxis.axisLabel.color'],
    borderColor: ['series.0.itemStyle.borderColor', 'series.1.itemStyle.borderColor'],
  });

  return (
    <Row gutter={[16, 16]} className={Style.memoryChartPanel}>
      <Col span={12}>
        <SeriesLineChart
          title={item.title}
          subTitle={item.subTitle}
          datePicker={item.datePicker}
          lines={item.lines}
          timeRange={item.timeRange}
          step={item.step}
          xAxis={item.xAxis}
        ></SeriesLineChart>
      </Col>
    </Row>
  );
};

export default React.memo(MemoryChart);