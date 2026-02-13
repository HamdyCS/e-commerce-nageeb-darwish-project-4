import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CATEGORIES,
  COUNT_PRODUCTS,
  DELETE_CATEGORY,
  DELETE_PRODUCT,
  PRODUCTS,
  SEARCH_PRODUCTS,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import CategoryDto from "../../../dtos/category/CategoryDto";
import ProductDto from "../../../dtos/product/ProductDto";
import { Default_PAGE_SIZE } from "../../../config";
import Pagination from "../../../components/ui/pagination/Pagination";
import { formatDate } from "../../../helper/helper";

interface TableDataType extends ProductDto, BaseTableDataType {}
export default function Products() {
  const [products, setProducts] = useState<ProductDto[]>([]);
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

  //get products
  useEffect(() => {
    async function fetchData() {
      try {
        !loading && setLoading(true);

        //call api to get products
        const data: { data: ProductDto[]; total: number } = await Axios.get(
          `${PRODUCTS}?limit=${pageSize}&page=${currentPageNumber}`,
        ).then((res) => res.data);

        const dataWithImageUrls: ProductDto[] = data.data.map((item) => {
          return {
            ...item,
            imageUrls: item.images.map((image) => image.image),
          };
        });

        setCountOfItems(data.total);

        setProducts(dataWithImageUrls);
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
        const data: ProductDto[] = await Axios.post(
          `${SEARCH_PRODUCTS}?title=${searchQuery}`,
        ).then((res) => res.data);

        const dataWithImageUrls: ProductDto[] = data.map((item) => {
          return {
            ...item,
            imageUrls: item.images.map((image) => image.image),
          };
        });

        setProducts(dataWithImageUrls);
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
        const data: ProductDto[] = await Axios.get(PRODUCTS).then(
          (res) => res.data.data,
        );

        const dataWithImageUrls: ProductDto[] = data.map((item) => {
          return {
            ...item,
            imageUrls: item.images.map((image) => image.image),
          };
        });

        const filterData = dataWithImageUrls.filter(
          (product) => formatDate(product.created_at) === formatDate(dateQuery),
        );

        setProducts(filterData);
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

  //handel date search
  async function handelDateSearch(dateString: string) {
    setDateQuery(dateString);
  }

  //tableHeader
  const tableHeader: TableHeaderType[] = [
    { name: "Id", key: "id" },
    { name: "Title", key: "title" },
    { name: "Images", key: "images" },
    { name: "Description", key: "description" },
    { name: "Price", key: "price" },
    { name: "Discount", key: "discount" },
    { name: "About", key: "About" },
    { name: "Category", key: "category" },
    { name: "Rating", key: "rating" },
    { name: "Created At", key: "created_at" },
    { name: "Updated At", key: "updated_at" },
  ];

  //table data
  const tableData: TableDataType[] = products.map((product) => {
    return {
      ...product,
      onDelete: handelDelete,
      updatePath: `/dashboard/products/${product.id}`,
      showDeleteButton: true,
      isImages: true,
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
