import { Breadcrumb } from "antd";
import React from "react";

const BreadcrumbNavigation = ({ items }) => {
  return <Breadcrumb separator=">" items={items} />;
};

export default BreadcrumbNavigation;
