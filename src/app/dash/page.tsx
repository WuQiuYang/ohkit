"use client";

import React from "react";
import {Checkbox} from 'antd';

export function List() {
  const [list, setList] = React.useState([
    {
      value: 1,
      label: "1",
      checked: true,
      onChange (c: boolean) {
        // item.checked = c;
        list[0].checked = c;
        setList([...list]);
      },
    },
    {
      value: 2,
      label: "2",
      checked: false,
      onChange (c: boolean) {
        // item.checked = c;
        list[1].checked = c;
        setList([...list]);
      },
    },
  ]);

//   const handelChange = (c: boolean) => {
//     // item.checked = c;
//     setList([...list]);
//   };
  return (
    <div>
      {list.map((item, index) => {
        const { checked, label, value, onChange } = item;
        return (
            <Checkbox key={value} checked={checked} name={label} onChange={(evt) => onChange(evt.target.checked)}/>
        );
      })}
    </div>
  );
}

export default List;
