import React, { useEffect, useState } from "react";
import ProductDto from "../../../dtos/product/ProductDto";
import Axios from "../../../Apis/Axios";
import { LATEST_SALE_PRODUCTS } from "../../../Apis/Apis";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReguiler } from "@fortawesome/free-regular-svg-icons";
import Skeleton from "react-loading-skeleton";

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

  return (
    <div>
      <h2 className="text-center mb-4 fw-bold fs-1">Latest Sale Products</h2>

      <Row className="g-4">
        {products.map((product) => {
          const starElements = [];
          const numberOfStars = Math.round(product.rating);

          for (let i = 1; i <= 5; i++) {
            if (i <= numberOfStars)
              starElements.push(<FontAwesomeIcon icon={faStarSolid} />);
            else starElements.push(<FontAwesomeIcon icon={faStarReguiler} />);
          }

          return (
            <Col lg={4} md={6} xs={12} key={product.id}>
              <div className=" shadow rounded border p-4 h-100">
                <img src={product.imageUrls?.[0]} alt="" className="w-100 object-fit-contain mb-3" height={200} />
                <h1 className="text-truncate">{product.title}</h1>
                <p className="text-truncate">{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Discount: ${product.discount}</p>
                <div>{starElements}</div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
