import { faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  Activity,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ADD_PRODUCT,
  ADD_PRODUCT_IMAGE,
  CATEGORIES,
  DELETE_PRODUCT_IMAGE,
  UPDATE_PRODUCT,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Loading from "../../../components/ui/loading/Loading";
import CategoryDto from "../../../dtos/category/CategoryDto";
import AddEditProductDto from "../../../dtos/product/AddEditProductDto";
import ProductDto from "../../../dtos/product/ProductDto";
import ProductImageDto from "../../../dtos/product/ProductImageDto";

export default function AddProduct() {
  const [form, setForm] = useState<AddEditProductDto>({
    category: 0,
  } as AddEditProductDto);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isActionDone, setIsActionDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [counter, setCounter] = useState<number>(0);
  const [newProductId, setNewProductId] = useState<number>(0);

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const progress = useRef<HTMLDivElement[]>([]);
  const imageIds = useRef<number[]>([]);

  const navigate = useNavigate();

  const focusElement = useRef<HTMLSelectElement | null>(null);

  //useEffects

  //handel focus
  useEffect(() => {
    focusElement.current?.focus();
  }, []);

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
      title: "Adding New Product Successful",
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

    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);

    //check if create new product
    if (newProductId !== 0) return;

    //create new product
    try {
      setLoading(true);

      const dummyAddProductDto: AddEditProductDto = {
        title: "title",
        description: "description",
        price: 0,
        discount: 0,
        About: "About",
        category: newForm.category,
      };

      const data = await Axios.post<ProductDto>(
        ADD_PRODUCT,
        dummyAddProductDto,
      ).then((res) => res.data);

      setNewProductId(data.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

        formData.append("product_id", newProductId.toString());
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

  //handel delete image
  async function handelDeleteImage(indexOfId: number, image: File) {
    const imageId = imageIds.current[indexOfId];

    //check if found id
    if (!imageId) return;
    try {
      setLoading(true);

      //call api
      await Axios.delete(DELETE_PRODUCT_IMAGE(imageId));

      //remove image from form
      setImages((prev) => prev.filter((img) => img != image));
      imageIds.current = imageIds.current.filter((id) => id !== imageId);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  //handel form changes
  function handelFormChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");

    const newForm = { ...form, [e.target.name]: e.target.value };

    setForm(newForm);
  }

  //handel submit (edit product)
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!(form.category > 0)) {
      setError("Category is required");
      return;
    }

    if (!form.title) {
      setError("Title is required");
      return;
    }
    if (!form.description) {
      setError("Description is required");
      return;
    }
    if (!form.price) {
      setError("Price is required");
      return;
    }
    if (!form.discount) {
      setError("Discount is required");
      return;
    }
    if (!form.About) {
      setError("About is required");
      return;
    }
    if (images.length === 0) {
      setError("Images is required");
      return;
    }

    if (newProductId === 0) {
      setError("Unexpected error");
      return;
    }

    try {
      setLoading(true);
      //call api
      const data = await Axios.post(UPDATE_PRODUCT(newProductId), form).then(
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
        <div className="d-block d-lg-flex align-items-center w-100 gap-5 overflow-hidden">
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
              onClick={() => handelDeleteImage(index, image)}
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
          <h2 className="fw-bold mb-3 text-center">Add Product</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                ref={focusElement}
                value={form.category}
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
                disabled={newProductId === 0}
                type="text"
                name="title"
                placeholder="Title..."
                onChange={handelFormChange}
                value={form.title}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                disabled={newProductId === 0}
                type="text"
                name="description"
                placeholder="description..."
                onChange={handelFormChange}
                value={form.description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                disabled={newProductId === 0}
                type="number"
                name="price"
                placeholder="price..."
                onChange={handelFormChange}
                value={form.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                disabled={newProductId === 0}
                type="number"
                name="discount"
                placeholder="discount..."
                onChange={handelFormChange}
                value={form.discount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="About">
              <Form.Label>About</Form.Label>
              <Form.Control
                disabled={newProductId === 0}
                type="text"
                name="About"
                placeholder="About..."
                onChange={handelFormChange}
                value={form.About}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="images">
              <Form.Label
                disabled={newProductId === 0}
                className="w-100border d-flex align-items-center justify-content-center rounded "
                style={{
                  border: newProductId === 0 ? "none" : "5px dashed blue",
                  backgroundColor: newProductId === 0 ? "#e9ecef" : "white",
                  height: "200px",
                  cursor: newProductId === 0 ? "default" : "pointer",
                }}
              >
                <div
                  className="text-center"
                  style={{
                    filter: newProductId === 0 ? "grayscale(1)" : "none",
                  }}
                >
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
                disabled={newProductId === 0}
                type="file"
                name="images"
                accept="image/*"
                multiple
                hidden
                onChange={handelInputImagesChange}
                className="d-none"
              />
            </Form.Group>

            {images.length > 0 && (
              <div className="mb-3">
                <h3 className="fw-bold mb-3">Images</h3>
                {imageElements}
              </div>
            )}

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={newProductId === 0}
              >
                Add Product
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
