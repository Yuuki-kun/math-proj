import React, { useState } from "react";
import { Flex, Divider, Form, Radio, Skeleton, Space, Switch } from "antd";

const ClassesSkeletonLoading = () => {
  const [block, setBlock] = useState(false);
  const [size, setSize] = useState("default");
  return (
    <div
      className="d-flex flex-wrap align-items-center justify-content-start card-fade-in"
      style={{ gap: "24px" }}
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton.Node
          active
          style={{
            width: 225,
            height: 250,
          }}
        />
      ))}
    </div>
  );
};

export default ClassesSkeletonLoading;
