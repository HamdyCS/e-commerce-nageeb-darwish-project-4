import React, {
  Activity,
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UserDto from "../../../dtos/auth/UserDto";
import Axios from "../../../Apis/Axios";
import {
  GET_CATEGORY,
  GET_USER,
  UPDATE_CATEGORY,
  UPDATE_USER,
} from "../../../Apis/Apis";
import Loading from "../../../components/ui/loading/Loading";
import { Button, Dropdown, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UpdateUserDto from "../../../dtos/auth/UpdateUserDto";
import { getRoleNameByRoleNumber, Role } from "../../../dtos/auth/Role";
import CategoryDto from "../../../dtos/categories/CategoryDto";
import { url } from "inspector";

interface FormType {
  title: string;
  image: File;
}

export default function UpdateCategory() {
  const { id: categoryId } = useParams();

  const [form, setForm] = useState<FormType>({} as FormType);

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [isActionDone, setIsActionDone] = useState<boolean>(false);

  const navigate = useNavigate();

  //get category info by id
  useEffect(() => {
    async function fetchData() {
      if (!categoryId) return;

      try {
        //call api
        const data = await Axios.get<CategoryDto>(
          `${GET_CATEGORY(Number(categoryId))}`,
        ).then((res) => res.data);

        //update form
        const newForm: FormType = {
          ...form,
          title: data.title,
        };

        setForm(newForm);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //fire alert when action done
  useEffect(() => {
    if (!isActionDone) return;

    Swal.fire({
      icon: "success",
      title: "Category updated successfully",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/dashboard/categories"));
  }, [isActionDone]);

  //handel form change
  function handelFormChange(event: ChangeEvent<HTMLInputElement>): void {
    const newForm = {
      ...form,
      [event.target.name]: event.target.value,
    };

    if (event.target.name === "image") {
      const files = event.target.files;
      if (files && files.length > 0) {
        newForm.image = files[0];
      }
    }

    //update user form state
    setForm(newForm);
  }

  //handel form submit
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!form.title) {
      setError("Title is required");
      return;
    }
    if (!form.image) {
      setError("Image is required");
      return;
    }

    try {
      setLoading(true);

      //form data
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("image", form.image);

      //call api
      const data = await Axios.post(
        `${UPDATE_CATEGORY(Number(categoryId))}`,
        formData,
      ).then((res) => res.data);

      //set to true to show alert
      setIsActionDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //check if loading
  if (loading)
    return (
      <div className="flex justify-content-center">
        <Loading />
      </div>
    );

  //check if not loading and user not found
  if (!loading && !form.title) {
    return <Navigate to="/dashboard/categories/page/404" replace />;
  }

  return (
    <div>
      {loading && <Loading />}
      <Activity mode={loading ? "hidden" : "visible"}>
        <div>
          <h2 className="fw-bold mb-3 text-center">Update Category</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="id">
              <Form.Label disabled>Id</Form.Label>
              <Form.Control
                disabled
                type="text"
                name="id"
                placeholder="id"
                value={categoryId}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="title"
                onChange={handelFormChange}
                value={form.title}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <div className="mb-3 d-flex align-items-center gap-3">
                <div
                  style={{
                    display: form.image ? "block" : "none",
                    backgroundImage: form.image
                      ? `url(${URL.createObjectURL(form.image)})`
                      : "",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    width: "100px",
                    height: "100px",
                  }}
                ></div>
                <Form.Control
                  className="flex-grow-1"
                  type="file"
                  accept="image/*"
                  name="image"
                  placeholder="image"
                  onChange={handelFormChange}
                />
              </div>
            </Form.Group>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Update Category
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
