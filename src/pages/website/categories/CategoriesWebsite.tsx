import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CategoryDto from "../../../dtos/category/CategoryDto";
import Skeleton from "react-loading-skeleton";

export default function CategoriesWebsite() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Axios.get<CategoryDto[]>(CATEGORIES).then(
          (res) => res.data,
        );

        setCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const skeletonElements = Array.from({ length: 20 }).map(() => (
    <div
      className="mb-4  d-flex gap-4 align-items-center text-decoration-none border rounded p-2"
      style={{ width: "100%", height: "70px" }}
    >
      <Skeleton width={"50px"} height={"52px"} />
      <div className="flex-grow-1">
        <Skeleton height={"52px"} />
      </div>
    </div>
  ));

  const categoryElements = categories.map((category) => (
    <Link
      key={category.id}
      to={`/categories/${category.id}`}
      className="text-black d-flex gap-4 align-items-center text-decoration-none border rounded p-2 "
      style={{
        height: "70px",
      }}
    >
      <img
        src={category.image}
        alt="category"
        className="h-100 object-fit-contain"
        style={{
          width: "50px",
        }}
      />
      {category.title}
    </Link>
  ));

  return (
    <div className="d-flex gap-4 flex-column">
      {isLoading ? skeletonElements : categoryElements}
    </div>
  );
}
