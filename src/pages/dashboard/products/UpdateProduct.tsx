import { faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Activity,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ADD_PRODUCT_IMAGE,
  CATEGORIES,
  DELETE_PRODUCT_IMAGE,
  GET_PRODUCT,
  UPDATE_PRODUCT,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Loading from "../../../components/ui/loading/Loading";
import CategoryDto from "../../../dtos/category/CategoryDto";
import ProductDto from "../../../dtos/product/ProductDto";
import ProductImageDto from "../../../dtos/product/ProductImageDto";

export default function UpdateProduct() {
  //states
  const [product, setProduct] = useState<ProductDto>({} as ProductDto);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isActionDone, setIsActionDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //ids of images from backend (come from server)
  const [productImageIdsToDelete, setProductImageIdsToDelete] = useState<
    number[]
  >([]);

  const [counter, setCounter] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  //params
  const productId = Number(useParams().id);

  //ref
  const progress = useRef<HTMLDivElement[]>([]);

  //ids of images from front end
  const imageIds = useRef<number[]>([]);

  const navigate = useNavigate();

  const focusElement = useRef<HTMLSelectElement | null>(null);

  //useEffects

  //handel focus
  useEffect(() => {
    focusElement.current?.focus();
  }, []);

  //get product
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (!productId) {
          navigate("dashboard/products/page/404");
          return;
        }

        //call api
        const data = await Axios.get<ProductDto[]>(GET_PRODUCT(productId)).then(
          (res) => res.data[0],
        );

        setProduct(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        //call api
        const data = await Axios.get<CategoryDto[]>(CATEGORIES).then(
          (res) => res.data,
        );

        setCategories(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //use it when registerDone is true
  useEffect(() => {
    if (!isActionDone) return;

    Swal.fire({
      icon: "success",
      title: "Updating Product Successful",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/dashboard/products"));
  }, [isActionDone, navigate]);

  //handels

  //handel select category change => and add new product
  async function handelSelectCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    setError("");

    const newForm = { ...product, [e.target.name]: e.target.value };
    setProduct(newForm);
  }

  //handel image change (send images)
  async function handelInputImagesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files === null) return;

    const imageFilesArray = (files.length > 0 && Array.from(files)) || [];

    setImages((prev) => [...prev, ...imageFilesArray]);

    //send images

    for (let index = 0; index < imageFilesArray.length; index++) {
      const image = imageFilesArray[index];
      try {
        const formData = new FormData();

        formData.append("product_id", productId.toString());
        formData.append("image", image);

        //get index of progress
        const imageIndex = images.length === 0 ? index : images.length + index;

        //call api
        const data = await Axios.post<ProductImageDto>(
          ADD_PRODUCT_IMAGE,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              //calc uploading precent
              const loaded = progressEvent.loaded || 0; //ما تم رفعه
              const total = progressEvent.total || 0; // حجم الملف
              const uploadingPrecent = Math.floor(
                (loaded / total) * 100,
              ).toString();

              //update progress width
              progress.current[imageIndex].style.width = `${uploadingPrecent}%`;

              //update progress label
              progress.current[imageIndex].dataset.label =
                `${uploadingPrecent}%`;
            },
          },
        ).then((res) => res.data);

        //add image id to ref
        imageIds.current[imageIndex] = data.id;

        //increase counter to re render to show delete image button
        setCounter((prev) => prev + 1);
      } catch (err) {
        console.log(error);
      }
    }
  }

  //handel delete product image
  function handelDeleteProductImage(imageId: number) {
    setProductImageIdsToDelete((prev) => [...prev, imageId]);
  }

  //handel delete new image
  async function handelDeleteNewImage(indexOfId: number, image: File) {
    const imageId = imageIds.current[indexOfId];

    //check if found id
    if (!imageId) return;
    try {
      setLoading(true);

      //call api
      await Axios.delete(DELETE_PRODUCT_IMAGE(imageId));

      //remove image from form
      setImages((prev) => prev.filter((img) => img !== image));
      imageIds.current = imageIds.current.filter((id) => id !== imageId);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  //handel form changes
  function handelFormChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");

    const newForm = { ...product, [e.target.name]: e.target.value };

    setProduct(newForm);
  }

  //handel submit (edit product)
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!(product.category > 0)) {
      setError("Category is required");
      return;
    }

    if (!product.title) {
      setError("Title is required");
      return;
    }
    if (!product.description) {
      setError("Description is required");
      return;
    }
    if (!product.price) {
      setError("Price is required");
      return;
    }
    if (!product.discount) {
      setError("Discount is required");
      return;
    }
    if (!product.About) {
      setError("About is required");
      return;
    }

    try {
      setLoading(true);

      if (!productId) {
        return;
      }

      //remove product images
      for (let i = 0; i < productImageIdsToDelete.length; i++) {
        //call api
        await Axios.delete(DELETE_PRODUCT_IMAGE(productImageIdsToDelete[i]));
      }

      //update product

      //call api
      const data = await Axios.post(UPDATE_PRODUCT(productId), product).then(
        (res) => res.data,
      );

      //set to true to show alert
      setIsActionDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //mapping

  //category options
  const categoryOptionELements = categories.map((category) => (
    <option value={category.id} className="text-capitalize" key={category.id}>
      {category.title}
    </option>
  ));

  //images
  //product images

  const productImageElements = product.images?.map((image, index) => {
    //check if user want to delete this image
    if (productImageIdsToDelete.some((id) => image.id === id)) return;

    return (
      <div
        className="rounded 25 mb-3  p-3  text-center overflow-hidden"
        style={{
          border: "1px solid blue ",
          width: "300px",
          height: "300px",
        }}
        key={index}
      >
        <img
          src={image.image}
          alt={image.image}
          className="mb-3 flex-grow-1"
          style={{
            height: "200px",
            width: "100%",
            objectFit: "contain",
            objectPosition: "start",
          }}
        />
        <div>
          <Button
            variant="danger"
            onClick={() => handelDeleteProductImage(image.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  });

  //new images
  const imageElements = images.map((image, index) => {
    const imageId = imageIds.current[index];
    const isFound = imageId > 0;

    const sizeKB = image.size / 1024;
    const sizeMB = sizeKB / 1024;
    return (
      <div
        className="rounded 25 mb-3  p-3 "
        style={{
          border: "1px solid blue ",
        }}
        key={index}
      >
        <div className="d-block d-lg-flex align-items-center w-100 gap-5 overflow-hidden  mb-3 mb-lg-0">
          <div>
            <p className="mb-3">
              <span className="fw-bold ">Name: </span> {image.name}
            </p>
            {sizeMB >= 1 ? (
              <p className="mb-3">
                <span className="fw-bold">Size (MB): </span> {sizeMB.toFixed(2)}
                MB
              </p>
            ) : (
              <p className="mb-3">
                <span className="fw-bold">Size (KB): </span> {sizeKB.toFixed(2)}
                KB
              </p>
            )}

            <Button
              variant="danger"
              onClick={() => handelDeleteNewImage(index, image)}
              disabled={!isFound}
            >
              Delete
            </Button>
          </div>
          <img
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="mb-3 flex-grow-1"
            style={{
              height: "200px",
              width: "100%",
              objectFit: "contain",
              objectPosition: "start",
            }}
          />
        </div>
        <div
          className="custom-progress-bar rounded w-100 mt-3"
          style={{
            height: "20px",
            backgroundColor: "#e9ecef",
          }}
        >
          <div
            className="inner-progress rounded"
            ref={(e) => {
              if (e === null) return;

              //save progress element
              progress.current[index] = e;
            }}
          />
        </div>
      </div>
    );
  });

  return (
    <div>
      {loading && (
        <div className="d-flex justify-content-center">
          <Loading />
        </div>
      )}
      <Activity mode={loading ? "hidden" : "visible"}>
        <div>
          <h2 className="fw-bold mb-3 text-center">Update Product</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                name="category"
                ref={focusElement}
                value={product.category}
                onChange={handelSelectCategoryChange}
              >
                <option value={0} disabled>
                  Select Category
                </option>
                {categoryOptionELements}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Title..."
                onChange={handelFormChange}
                value={product.title}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="description..."
                onChange={handelFormChange}
                value={product.description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="price..."
                onChange={handelFormChange}
                value={product.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="discount"
                placeholder="discount..."
                onChange={handelFormChange}
                value={product.discount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="About">
              <Form.Label>About</Form.Label>
              <Form.Control
                type="text"
                name="About"
                placeholder="About..."
                onChange={handelFormChange}
                value={product.About}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="images">
              <Form.Label
                className="w-100border d-flex align-items-center justify-content-center rounded "
                style={{
                  border: "5px dashed blue",
                  backgroundColor: "white",
                  height: "200px",
                  cursor: "pointer",
                }}
              >
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faImages}
                    color="blue"
                    size="5x"
                    className="mb-3"
                  />
                  <h3 className="mb-0" style={{ color: "blue" }}>
                    Select Images
                  </h3>
                </div>
              </Form.Label>
              <Form.Control
                type="file"
                name="images"
                accept="image/*"
                multiple
                hidden
                onChange={handelInputImagesChange}
                className="d-none"
              />
            </Form.Group>

            <div className="mb-3">
              <h3 className="fw-bold mb-3">Images</h3>

              <div className="d-flex flex-column flex-lg-row justify-content-center    align-items-center  justify-content-lg-start gap-3">
                {productImageElements}
              </div>
              {imageElements}
            </div>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Update Product
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
