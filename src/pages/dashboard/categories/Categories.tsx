import { useEffect, useState } from "react";
import { CATEGORIES } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import Loading from "../../../components/ui/loading/Loading";
import CategoryDto from "../../../dtos/categories/CategoryDto";
interface TableDataType extends CategoryDto, BaseTableDataType {
  id: number;
}
export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);

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

  //const handel delete
  async function handelDelete(id: number | string) {
    console.log("Delete function");
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
