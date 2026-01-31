import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CATEGORIES,
  DELETE_CATEGORY,
  DELETE_PRODUCT,
  PRODUCTS,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import CategoryDto from "../../../dtos/category/CategoryDto";
import ProductDto from "../../../dtos/product/ProductDto";

interface TableDataType extends ProductDto, BaseTableDataType {}
export default function Products() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [isDeletedDone, setIsDeletedDone] = useState<boolean>(false);

  //get products
  useEffect(() => {
    async function fetchData() {
      try {
        //call api to get products
        const data = await Axios.get<ProductDto[]>(PRODUCTS).then(
          (res) => res.data,
        );

        data && setProducts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [counter]);

  //run alert
  useEffect(() => {
    if (!isDeletedDone) return;

    Swal.fire({
      allowEscapeKey: true,
      showCancelButton: true,
      showConfirmButton: false,
      icon: "success",
      title: "Deleteted product successfuly.",
    }).then(() => {
      //reset is deleted done
      setIsDeletedDone(false);

      //increase counter to run useEffect get all categories again
      setCounter((prev) => prev + 1);

      //set Loading to true
      setLoading(true);
    });
  }, [isDeletedDone]);

  //handel delete
  async function handelDelete(id: number) {
    //confirm to delete
    const confirm = window.confirm(
      `Are you sure you want to delete this product Id: ${id}`,
    );
    if (!confirm) return;

    try {
      //call api
      const data = await Axios.delete(`${DELETE_PRODUCT(id)}`).then(
        (res) => res.data,
      );

      //set is deleted done to run alret
      setIsDeletedDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //tableHeader
  const tableHeader: TableHeaderType[] = [
    { name: "Id", key: "id" },
    { name: "Title", key: "title" },
    { name: "Description", key: "description" },
    { name: "Price", key: "price" },
    { name: "Discount", key: "discount" },
    { name: "About", key: "About" },
    { name: "Category", key: "category" },
    { name: "Rating", key: "rating" },
  ];

  //table data
  const tableData: TableDataType[] = products.map((category) => {
    return {
      ...category,
      onDelete: handelDelete,
      updatePath: `/dashboard/products/${category.id}`,
      showDeleteButton: true,
    };
  });

  return (
    <div className="Products">
      <CustomTable
        tableName="Products"
        addPath="/dashboard/products/add"
        tableHeader={tableHeader}
        data={tableData}
        isLoading={loading}
      />
    </div>
  );
}
