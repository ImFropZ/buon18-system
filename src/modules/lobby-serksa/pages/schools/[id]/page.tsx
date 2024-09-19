import React from "react";

export default function Page({ params }: { params: any }) {
  return <div>School: {params.id}</div>;
}
