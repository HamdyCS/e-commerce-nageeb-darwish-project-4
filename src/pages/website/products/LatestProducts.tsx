import { faStar as faStarReguiler } from "@fortawesome/free-regular-svg-icons";
import {
  faCartShopping,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { LATEST_PRODUCTS, LATEST_SALE_PRODUCTS } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import ProductDto from "../../../dtos/product/ProductDto";
import { Link } from "react-router-dom";

export default function LatestProducts() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //get products
  useEffect(() => {
    async function fetchData() {
      try {
        //call api to get products
        const data: ProductDto[] = await Axios.get<ProductDto[]>(
          `${LATEST_PRODUCTS}`,
        ).then((res) => res.data);

        const dataWithImageUrls: ProductDto[] = data.map((item) => {
          return {
            ...item,
            imageUrls: item.images.map((image) => image.image),
          };
        });

        setProducts(dataWithImageUrls);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const skeletonElments = Array.from({ length: 3 }).map((_, index) => (
    <div
      className="  rounded  p-4 h-100 mb-3  gap-3"
      style={{
        borderBottom: index === 2 ? "none " : "1px black solid",
      }}
      key={index}
    >
      <Row className="mb-3">
        <Col xs={12} lg={4}>
          <Skeleton height={"200px"} width={"100%"} className="mb-3" />
        </Col>
        <Col xs={12} lg={8}>
          <Skeleton height={"50px"} width={"100%"} className="mb-3" count={5} />
        </Col>
      </Row>
    </div>
  ));

  return (
    <div
      className=""
      style={{
        border: "gold 2px solid",
      }}
    >
      <h2
        className="text-center mb-4 fw-bold fs-1 "
        style={{
          backgroundColor: "gold",
          color: "black",
          padding: "10px",
        }}
      >
        Latest Products
      </h2>
      {isLoading
        ? skeletonElments
        : products.map((product, index) => {
            const starElements = [];
            const numberOfStars = Math.round(product.rating);

            for (let i = 1; i <= 5; i++) {
              if (i <= numberOfStars)
                starElements.push(
                  <FontAwesomeIcon key={i} icon={faStarSolid} />,
                );
              else
                starElements.push(
                  <FontAwesomeIcon key={i} icon={faStarReguiler} />,
                );
            }

            return (
              <Link
                to={`/products/${product.id}`}
                className="p-4 h-100 mb-3  gap-3 text-decoration-none text-dark d-block"
                style={{
                  borderBottom:
                    index === products.length - 1 ? "none" : "1px black solid",
                }}
                key={product.id}
              >
                <Row>
                  <Col xs={12} lg={4}>
                    <img
                      src={product.imageUrls?.[0]}
                      alt=""
                      className="object-fit-contain mb-3"
                      height={200}
                      width={"100%"}
                    />
                  </Col>
                  <Col xs={12} lg={8}>
                    <div className="text-truncate">
                      <h1 className="text-truncate">{product.title}</h1>
                      <p className="text-truncate">{product.description}</p>
                      <p>Price: ${product.price}</p>
                      <p>Discount: ${product.discount}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>{starElements}</div>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          cursor="pointer"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Link>
            );
          })}
    </div>
  );
}
