import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Table } from "react-bootstrap";
import { data, Link } from "react-router-dom";
import Loading from "./loading/Loading";
import { Dispatch, SetStateAction, useState } from "react";
import { formatDate } from "../../helper/helper";

//table header
export interface TableHeaderType {
  name: string;
  key: string;
}

//الحاجات الاساسية اللي لازم تكون تحتوي عليها ال data
export interface BaseTableDataType {
  id: number;
  disabled?: boolean;
  onDelete: (id: number) => Promise<void>;
  showDeleteButton: boolean;
  updatePath: string;
  [key: string]: any; //Index Signature => يمكن فهرسته باستخدام string
  isImage?: boolean;
  isImages?: boolean;
}

export default function CustomTable<T extends BaseTableDataType>(tableProps: {
  tableName: String;
  addPath: string;
  tableHeader: TableHeaderType[];
  data: T[];
  isLoading: boolean;
  handleSearch: (searchQuery: string) => Promise<void>;
  handelDateSearch?: (dateString: string) => Promise<void>;
}) {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  //table header elements
  const tableHeaderElements = tableProps.tableHeader.map((item) => (
    <th
      className="border-0"
      style={{
        backgroundColor: "inherit",
        color: "inherit",
        border: "inherit",
      }}
      key={item.key}
    >
      {item.name}
    </th>
  ));

  //table body elements
  const tableBodyElements = tableProps.data.map((item, index) => {
    const tableRow = (
      <tr
        key={item.id}
        style={{
          opacity: item.disabled ? "0.5" : "1",
        }}
      >
        {tableProps.tableHeader.map((headerItem) => {
          //check if image
          if (item.isImage && headerItem.key === "image") {
            return (
              <td key={headerItem.key}>
                <div
                  style={{
                    width: "100px",
                    height: "50px",
                    backgroundImage: `url(${item[headerItem.key]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "contain",
                  }}
                ></div>
              </td>
            );
          }

          //check if images
          if (
            item.isImages &&
            headerItem.key === "images" &&
            item["imageUrls"].length >= 1
          ) {
            return (
              <td key={headerItem.key}>
                <div className="d-flex align-items-center gap-2">
                  {item["imageUrls"]
                    .slice(0, 2)
                    .map((image: string, index: number) => (
                      <div
                        key={index}
                        style={{
                          width: "100px",
                          height: "50px",
                          backgroundImage: `url(${image})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "top",
                          backgroundSize: "contain",
                        }}
                      ></div>
                    ))}
                </div>
              </td>
            );
          }

          //check if date
          if (
            headerItem.key === "created_at" ||
            headerItem.key === "updated_at"
          ) {
            return (
              <td key={headerItem.key}>{formatDate(item[headerItem.key])}</td>
            );
          }

          //skip images and image columns
          if (headerItem.key === "images" || headerItem.key === "image") return;

          return <td key={headerItem.key}>{item[headerItem.key]}</td>;
        })}
        <td>
          <div className="d-flex gap-3">
            <Link to={item.updatePath}>
              <Button className="btn-secondary rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1">
                <FontAwesomeIcon size="lg" icon={faPenToSquare} />
                <p className="p-0 m-0">Edit</p>
              </Button>
            </Link>
            {item.showDeleteButton && (
              <Button
                className="btn-danger rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1"
                onClick={() => {
                  item.onDelete?.(item.id);
                }}
              >
                {isDeleteLoading ? (
                  <Loading />
                ) : (
                  <>
                    <FontAwesomeIcon size="lg" icon={faTrash} />
                    <p className="p-0 m-0">Delete</p>
                  </>
                )}
              </Button>
            )}
          </div>
        </td>
      </tr>
    );

    return tableRow;
  });

  return (
    <div className="Users">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-dark fw-bold fs-1 mb-3 ">{tableProps.tableName}</h2>
        <div className="d-flex align-items-center gap-4">
          <Form.Control
            type="search"
            placeholder="Search"
            onChange={(e) => tableProps.handleSearch(e.target.value)}
          />
          <Form.Control
            type="date"
            placeholder="Search"
            onChange={(e) => tableProps.handelDateSearch?.(e.target.value)}
          />
          <Link to={tableProps.addPath}>
            <Button className="btn-primary rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1">
              <FontAwesomeIcon size="lg" icon={faPlus} />
              <p className="p-0 m-0">Add</p>
            </Button>
          </Link>
        </div>
      </div>
      <Table
        striped
        bordered
        hover
        variant="light"
        responsive
        className="table-hover rounded-2 overflow-hidden"
      >
        <thead
          style={{
            fontSize: "15px",
          }}
        >
          <tr
            style={{
              backgroundColor: "#36314e",
              border: "0",
              color: "white",
            }}
          >
            {tableHeaderElements}
            <th
              style={{
                backgroundColor: "inherit",
                color: "inherit",
                border: "inherit",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="rounded-2">
          {tableProps.isLoading && (
            <tr>
              <td colSpan={tableHeaderElements.length + 1}>
                <Loading />
              </td>
            </tr>
          )}
          {!tableProps.isLoading && tableBodyElements.length === 0 && (
            <tr>
              <td
                className="text-center fw-bold text-secondary"
                colSpan={tableHeaderElements.length + 1}
              >
                No data found!
              </td>
            </tr>
          )}
          {!tableProps.isLoading &&
            tableBodyElements.length > 0 &&
            tableBodyElements}
        </tbody>
      </Table>
    </div>
  );
}
