import { faStar as faStarReguiler } from "@fortawesome/free-regular-svg-icons";
import {
  faCartShopping,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ImageGallery, { GalleryItem } from "react-image-gallery";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { GET_PRODUCT } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Counter from "../../../components/ui/counter/Counter";
import ProductDto from "../../../dtos/product/ProductDto";
import ProductInCartDto from "../../../dtos/product/ProductInCart";

export default function Product() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDto>({} as ProductDto);
  const [images, setImages] = useState<GalleryItem[]>([]);

  const [quantity, setQuantity] = useState(1);

  let starElements = [];

  useEffect(() => {
    async function fetchData() {
      try {
        //call api to get products
        const data: ProductDto = await Axios.get<ProductDto[]>(
          GET_PRODUCT(Number(id)),
        ).then((res) => res.data[0]);

        const images: GalleryItem[] = data.images.map((image) => ({
          original: image.image,
          thumbnail: image.image,
        }));

        setProduct(data);
        setImages(images);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //handel add to cart
  function handelAddToCart() {
    const item = localStorage.getItem("cart");

    //cast item to ProductInCart
    const cart: ProductInCartDto[] = item ? JSON.parse(item) : [];

    //get product from cart
    const productInCart = cart.find((item) => item.product_id === product.id);

    let updatedCart: ProductInCartDto[];

    if (productInCart) {
      //update product in cart
      updatedCart = cart.map((item) => {
        if (item.product_id === product.id) {
          return { ...item, count: quantity };
        }
        return item;
      });
    } else {
      //add product to cart
      updatedCart = [...cart, { product_id: product.id, count: quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  //add stars
  if (product.id) {
    const numberOfStars = Math.round(product.rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= numberOfStars)
        starElements.push(<FontAwesomeIcon key={i} icon={faStarSolid} />);
      else starElements.push(<FontAwesomeIcon key={i} icon={faStarReguiler} />);
    }
  }

  //skelton
  const skeltonElement = (
    <Row className="align-items-center gap-sm-5 gap-md-0">
      <Col xs={12} md={6}>
        <Skeleton height={"200px"} width={"100%"} className="mb-3" />
        <div className="d-flex align-items-center gap-3 overflow-hidden mb-3 mb-lg-0">
          <Skeleton width={"100px"} height={"50px"} />
          <Skeleton width={"100px"} height={"50px"} />
          <Skeleton width={"100px"} height={"50px"} />
          <Skeleton width={"100px"} height={"50px"} />
        </div>
      </Col>
      <Col xs={12} md={6}>
        <Skeleton width={"100%"} height={"20px"} className="mb-3" />
        <Skeleton width={"100%"} height={"20px"} className="mb-3" />
        <Skeleton width={"100%"} height={"20px"} className="mb-3" />
        <Skeleton width={"100%"} height={"20px"} className="mb-3" />
        <div
          className="my-3"
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "black",
          }}
        />
        <div className="d-flex align-items-center gap-3 justify-content-between">
          <Skeleton width={"100px"} height={"50px"} />
          <Skeleton width={"100px"} height={"50px"} />
        </div>
      </Col>
    </Row>
  );

  return (
    <div>
      {loading ? (
        skeltonElement
      ) : (
        <Row className="align-items-center gap-sm-5 gap-md-0">
          <Col xs={12} md={6}>
            <div>{images.length > 0 && <ImageGallery items={images} />}</div>
          </Col>
          <Col xs={12} md={6}>
            <div
              className="  p-4 h-100 mb-3  gap-3 text-decoration-none "
              key={product.id}
              style={{
                fontSize: "30px",
              }}
            >
              <div className="text-truncate">
                <h1 className="text-truncate">{product.title}</h1>
                <p className="text-truncate">{product.description}</p>
                <p
                  className="text-truncate text-black-50"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  {product.About}
                </p>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-decoration-line-through text-black-50">
                    ${product.price}
                  </span>
                  <span className="text-primary fw-bold">${product.price}</span>
                </div>
                <div
                  className="my-3"
                  style={{
                    height: "1px",
                    width: "100%",
                    backgroundColor: "black",
                  }}
                />
                <p className="mb-3 text-black-50 fs-5">
                  There is only {product.stock} left
                </p>
                <div className="d-flex align-items-center justify-content-between">
                  <div>{starElements}</div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <Counter
                      min={1}
                      max={product.stock}
                      value={quantity}
                      onChange={(value) => setQuantity(value)}
                    />
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      cursor="pointer"
                      onClick={handelAddToCart}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
