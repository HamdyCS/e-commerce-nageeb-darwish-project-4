import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CategoryDto from "../../../dtos/category/CategoryDto";

export default function CategoriesWebsite() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Axios.get<CategoryDto[]>(CATEGORIES).then(
          (res) => res.data,
        );

        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const categoryElements = categories.map((category) => (
    <Link
      to={`/categories/${category.id}`}
      className="text-black d-block align-items-center text-decoration-none border rounded p-2 "
    >
      {category.title}
    </Link>
  ));

  return <div className="d-flex gap-4 flex-column">{categoryElements}</div>;
}
