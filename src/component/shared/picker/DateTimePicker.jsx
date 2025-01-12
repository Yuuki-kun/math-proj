import React from "react";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const DateTimePicker = ({ placeholder }) => {
  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  return (
    <Space direction="vertical" size={12}>
      <DatePicker
        placeholder={placeholder}
        showTime
        onChange={(value, dateString) => {
          console.log("Selected Time: ", value);
          console.log("Formatted Selected Time: ", dateString);
        }}
        onOk={onOk}
      />
    </Space>
  );
};

export default DateTimePicker;
