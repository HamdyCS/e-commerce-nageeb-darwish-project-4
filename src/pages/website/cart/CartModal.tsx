import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import ProductInCartDto from "../../../dtos/product/ProductInCart";
import ProductDto from "../../../dtos/product/ProductDto";
import { json } from "stream/consumers";
import Axios from "../../../Apis/Axios";
import { GET_PRODUCT } from "../../../Apis/Apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Counter from "../../../components/ui/counter/Counter";
interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const cart = useRef<ProductInCartDto[]>([]);
  const [productWithQuantities, setProductWithQuantities] = useState<
    { product: ProductDto; quantity: number }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const item = localStorage.getItem("cart");
        const parsedItem: ProductInCartDto[] = item ? JSON.parse(item) : [];

        cart.current = parsedItem;

        const productsInCart: { product: ProductDto; quantity: number }[] = [];

        for (let i = 0; i < cart.current.length; i++) {
          const item = cart.current[i];

          //call api to get products
          await Axios.get<ProductDto[]>(GET_PRODUCT(item.product_id)).then(
            (res) => {
              //get product
              const product = res.data[0];

              //add image urls to product
              product.imageUrls = product.images.map((image) => image.image);

              //add product to productsInCart
              productsInCart.push({ product, quantity: item.count });
            },
          );
        }

        setProductWithQuantities(productsInCart);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  function handelDeleteFromCart(id: number) {
    //remove from cart (local storage)
    const updatedCart = cart.current.filter((item) => item.product_id !== id);
    cart.current = updatedCart;
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    //remove from productsInCart
    setProductWithQuantities((prev) => prev.filter((item) => item.product.id !== id));
  }

  function handelQuantityChange(id: number, value: number): void {
    //update quantity in cart (local storage)
    const updatedCart = cart.current.map((item) => {
      if (item.product_id === id) {
        return { ...item, count: value };
      }
      return item;
    });

    cart.current = updatedCart;
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    //update quantity in productsInCart
    setProductWithQuantities((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          return { ...item, quantity: value };
        }
        return item;
      }),
    );
  }

  const productElements = productWithQuantities.map((productInCart) => (
    <Row className="align-items-center">
      <Col xs={12} lg={4}>
        <img
          src={productInCart.product.imageUrls?.[0]}
          alt=""
          className="object-fit-contain mb-3"
          height={200}
          width={"100%"}
        />
        <Counter
          min={1}
          max={productInCart.product.stock}
          value={productInCart.quantity}
          onChange={(value) =>
            handelQuantityChange(productInCart.product.id, value)
          }
        />
      </Col>
      <Col xs={12} lg={8}>
        <div className="text-truncate position-relative">
          <FontAwesomeIcon
            icon={faCircleXmark}
            cursor="pointer"
            size="2x"
            color="red"
            className="position-absolute top-0 end-0"
            onClick={() => handelDeleteFromCart(productInCart.product.id)}
          />
          <h1 className="text-truncate">{productInCart.product.title}</h1>
          <p className="text-truncate">{productInCart.product.description}</p>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="text-decoration-line-through text-black-50">
                ${productInCart.product.price}
              </span>
              <span className="text-primary fw-bold">
                ${productInCart.product.price}
              </span>
            </div>
            {/* <FontAwesomeIcon icon={faCartShopping} size="2x" cursor="pointer" /> */}
          </div>
        </div>
      </Col>
    </Row>
  ));

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>{productElements}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary">Check Out</Button>
      </Modal.Footer>
    </Modal>
  );
}
