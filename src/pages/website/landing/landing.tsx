import React from "react";
import LatestSaleProducts from "../products/LatestSaleProducts";

export default function Landing() {
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "90vh",
        }}
      >
        <h1 className="text-center">Welecome To My E-Commerce web site</h1>
      </div>
      <div className="py-5">
        <LatestSaleProducts />
      </div>
    </div>
  );
}
