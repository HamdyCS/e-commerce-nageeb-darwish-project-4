import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CATEGORIES,
  COUNT_CATEGORIES,
  DELETE_CATEGORY,
  SEARCH_CATEGORIES,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import Pagination from "../../../components/ui/pagination/Pagination";
import { Default_PAGE_SIZE } from "../../../config";
import CategoryDto from "../../../dtos/category/CategoryDto";
import { formatDate } from "../../../helper/helper";
interface TableDataType extends CategoryDto, BaseTableDataType {}
export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [isDeletedDone, setIsDeletedDone] = useState<boolean>(false);

  //search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  //date search state
  const [dateQuery, setDateQuery] = useState<string>("");

  //pagination states
  const [pageSize, setPageSize] = useState<number>(Default_PAGE_SIZE);
  const [countOfItems, setCountOfItems] = useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        !loading && setLoading(true);

        //call api to get categories
        const data: { data: CategoryDto[]; total: number } = await Axios.get(
          `${CATEGORIES}?limit=${pageSize}&page=${currentPageNumber}`,
        ).then((res) => res.data);

        setCountOfItems(data.total);

        data && setCategories(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [counter, currentPageNumber, pageSize]);

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

  //search categories
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        //if search query is empty
        if (!searchQuery) {
          setCounter((prev) => prev + 1);
          return;
        }

        //call api to search categories
        const data = await Axios.post<CategoryDto[]>(
          `${SEARCH_CATEGORIES}?title=${searchQuery}`,
        ).then((res) => res.data);

        setCategories(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const timer1 = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer1);
  }, [searchQuery]);

  //search by date
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        //if search query is empty
        if (!dateQuery) {
          setCounter((prev) => prev + 1);
          return;
        }

        //call api to search categories
        const data: CategoryDto[] = await Axios.get(CATEGORIES).then(
          (res) => res.data.data,
        );

        const filterData = data.filter(
          (category) =>
            formatDate(category.created_at) === formatDate(dateQuery),
        );

        setCategories(filterData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateQuery]);

  //handel search
  async function handleSearch(searchQuery: string) {
    setSearchQuery(searchQuery);
  }
  //handel date search
  async function handelDateSearch(dateString: string) {
    setDateQuery(dateString);
  }

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
    { name: "Created At", key: "created_at" },
    { name: "Updated At", key: "updated_at" },
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
      <CustomTable
        tableName="Categories"
        addPath="/dashboard/categories/add"
        tableHeader={tableHeader}
        data={tableData}
        isLoading={loading}
        handleSearch={handleSearch}
        handelDateSearch={handelDateSearch}
      />
      {!searchQuery && (
        <Pagination
          setCurrentPageNumber={setCurrentPageNumber}
          pageNumber={currentPageNumber}
          countOfItems={countOfItems}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
}
