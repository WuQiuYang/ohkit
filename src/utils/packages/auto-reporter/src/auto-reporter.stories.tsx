import type { Meta, StoryObj } from '@storybook/react';
import {useState, useEffect} from 'react';
import {useRuntime} from '@ohkit/react-helper';

import { AutoReporter, AutoReporterConstructorProps } from './auto-reporter';

const AutoReporterDemo = (props: Partial<AutoReporterConstructorProps>) => {
  const {duration = 5000, maxTimes = 5, beforeUploadConfirm, reportPipe} = props;
  const [count, setCount] = useState(0);
  const [reportTimes, setReportTimes] = useState(0);
  const [runtime] = useRuntime({
    autoReporter: new AutoReporter({
      onReport: async () => {
        reportPipe && await new Promise((resolve) => setTimeout(resolve, 2000));
        setReportTimes(++runtime.reportTimes);
        setCount(0);
      },
      duration,
      maxTimes,
      beforeUploadConfirm,
    }),
    reportTimes,
  }, ['reportTimes']);
  useEffect(() => {
    runtime.autoReporter.updateConfig({
      duration,
      maxTimes,
      beforeUploadConfirm
    });
  }, [duration, maxTimes, beforeUploadConfirm])
  return <div>
    <h1>change {maxTimes}次或者change后延迟{duration}毫秒会触发report事件</h1>
    {beforeUploadConfirm && <h2>change后立即关闭当前页面试试</h2>}
    {reportPipe && <h2>可以快速点击change和flush，感受report的串行</h2>}
    <p><b>trigger report times: {reportTimes}</b></p>
    <p><b>change times: {count}</b></p>
    <p>      
      <button onClick={() => {
        setCount(count + 1);
        runtime.autoReporter.change();
      }}>change</button>
      <button onClick={() => {
        setCount(0);
        runtime.autoReporter.reset();
      }}>reset</button>
      <button onClick={() => {
        runtime.autoReporter.flush();
      }}>flush</button>
    </p>
  </div>;
}

const meta = {
  component: AutoReporterDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof AutoReporterDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // duration: 3000,
    // maxTimes: 3,
  },
};

export const BeforeUploadConfirm: Story = {
  args: {
    maxTimes: 3,
    duration: 3000,
    beforeUploadConfirm: true
  },
};

export const ReportPipe: Story = {
  args: {
    maxTimes: 3,
    duration: 3000,
    reportPipe: true
  },
};
