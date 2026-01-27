import { Activity, FormEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ADD_CATEGORY } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Loading from "../../../components/ui/loading/Loading";
import AddCategoryDto from "../../../dtos/categories/AddCategoryDto";

export default function AddCategory() {
  const [form, setForm] = useState<AddCategoryDto>({} as AddCategoryDto);

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isActionDone, setIsActionDone] = useState<boolean>(false);

  const navigate = useNavigate();

  //use it when registerDone is true
  useEffect(() => {
    if (!isActionDone) return;

    Swal.fire({
      icon: "success",
      title: "Added New cateigory Successful",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/dashboard/categories"));
  }, [isActionDone, navigate]);

  //handel form changes
  function handelFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form, [e.target.name]: e.target.value };

    if (e.target.name === "image") {
      const files = e.target.files;

      if (files && files.length > 0) newForm.image = files[0];
    }
    //update form state
    setForm(newForm);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

      console.log(form.image);

      //form data
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("image", form.image);

      //call api
      const data = await Axios.post(ADD_CATEGORY, formData).then(
        (res) => res.data,
      );

      console.log(data);

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

  return (
    <div>
      {loading && <Loading />}
      <Activity mode={loading ? "hidden" : "visible"}>
        <div>
          <h2 className="fw-bold mb-3 text-center">Add Category</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
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

            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handelFormChange}
              />
            </Form.Group>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Add Category
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
