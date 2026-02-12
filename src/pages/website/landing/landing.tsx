import React from "react";
import LatestSaleProducts from "../products/LatestSaleProducts";
import TopRatedProducts from "../products/TopRatedProducts";
import LatestProducts from "../products/LatestProducts";
import { Col, Row } from "react-bootstrap";

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
      <div className="pb-5">
        <LatestSaleProducts />
      </div>
      <div className="pb-5">
        <Row className="g-5">
          <Col xs={12} lg={6}>
            <TopRatedProducts />
          </Col>
          <Col xs={12} lg={6}>
            <LatestProducts />
          </Col>
        </Row>
      </div>
    </div>
  );
}
