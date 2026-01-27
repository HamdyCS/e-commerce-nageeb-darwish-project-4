import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CATEGORIES, DELETE_CATEGORY } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import Loading from "../../../components/ui/loading/Loading";
import CategoryDto from "../../../dtos/categories/CategoryDto";
interface TableDataType extends CategoryDto, BaseTableDataType {}
export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [isDeletedDone, setIsDeletedDone] = useState<boolean>(false);

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        //call api to get categories
        const data = await Axios.get<CategoryDto[]>(CATEGORIES).then(
          (res) => res.data,
        );

        data && setCategories(data);
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
      title: "Deleteted category successfuly.",
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
      `Are you sure you want to delete this category Id: ${id}`,
    );
    if (!confirm) return;

    try {
      //call api
      const data = await Axios.delete(`${DELETE_CATEGORY(id)}`).then(
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
    { name: "Image", key: "image" },
  ];

  //table data
  const tableData: TableDataType[] = categories.map((category) => {
    return {
      ...category,
      onDelete: handelDelete,
      updatePath: `/dashboard/categories/${category.id}`,
      showDeleteButton: true,
      isImage: true,
    };
  });

  return (
    <div className="catigories">
      {loading && <Loading />}
      {!loading && (
        <CustomTable
          tableName="Categories"
          addPath="/dashboard/categories/add"
          tableHeader={tableHeader}
          data={tableData}
        />
      )}
    </div>
  );
}
