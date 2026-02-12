import React, { useEffect, useState } from "react";
import ProductDto from "../../../dtos/product/ProductDto";
import Axios from "../../../Apis/Axios";
import { LATEST_SALE_PRODUCTS } from "../../../Apis/Apis";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReguiler } from "@fortawesome/free-regular-svg-icons";
import Skeleton from "react-loading-skeleton";
import Loading from "../../../components/ui/loading/Loading";

export default function LatestSaleProducts() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //get products
  useEffect(() => {
    async function fetchData() {
      try {
        //call api to get products
        const data: ProductDto[] = await Axios.get<ProductDto[]>(
          `${LATEST_SALE_PRODUCTS}`,
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

  //loading
  if (isLoading)
    return (
      <Row className="g-4">
        <Col lg={4} md={6} xs={12}>
          <Skeleton height={"200px"} width={"100%"} className="mb-3" />
          <Skeleton height={"50px"} width={"100%"} className="mb-3" count={4} />
        </Col>
        <Col lg={4} md={6} xs={12}>
          <Skeleton height={"200px"} width={"100%"} className="mb-3" />
          <Skeleton height={"50px"} width={"100%"} className="mb-3" count={4} />
        </Col>{" "}
        <Col lg={4} md={6} xs={12}>
          <Skeleton height={"200px"} width={"100%"} className="mb-3" />
          <Skeleton height={"50px"} width={"100%"} className="mb-3" count={4} />
        </Col>
      </Row>
    );

  return (
    <div>
      <h2 className="text-center mb-4 fw-bold fs-1">Latest Sale Products</h2>

      <Row className="g-4">
        {products.map((product) => {
          const starElements = [];
          const numberOfStars = Math.round(product.rating);

          for (let i = 1; i <= 5; i++) {
            if (i <= numberOfStars)
              starElements.push(<FontAwesomeIcon key={i} icon={faStarSolid} />);
            else starElements.push(<FontAwesomeIcon key={i} icon={faStarReguiler} />);
          }

          return (
            <React.Fragment key={product.id}>
              <Col lg={4} md={6} xs={12}>
                <div className=" shadow rounded border p-4 h-100">
                  <img
                    src={product.imageUrls?.[0]}
                    alt=""
                    className="w-100 object-fit-contain mb-3"
                    height={200}
                  />
                  <h1 className="text-truncate">{product.title}</h1>
                  <p className="text-truncate">{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Discount: ${product.discount}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>{starElements}</div>
                    <FontAwesomeIcon icon={faCartShopping} cursor="pointer" />
                  </div>
                </div>
              </Col>
            </React.Fragment>
          );
        })}
      </Row>
    </div>
  );
}
