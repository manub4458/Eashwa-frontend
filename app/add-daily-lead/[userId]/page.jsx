import React from "react";
import DailyLeadsForm from "./DailyLeadsForm";

const page = ({params}) => {
  return (
    <div>
      <DailyLeadsForm userId={params.userId} />
    </div>
  );
};

export default page;
