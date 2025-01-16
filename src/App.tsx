import {
  Comparators,
  Criteria,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiPanel,
  EuiTableSortingType,
} from "@elastic/eui";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";



interface Country {
  code?: string;
  name?: string;
  emoji?: string;
  continent: {
    name?: string;
  };
}

const COUNTRY = gql`
  query GetCountry {
    countries {
      code
      name
      emoji
      continent {
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(COUNTRY);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<keyof Country>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (loading) return <p>Loading Countries...</p>;
  if (error) return <p>Error Loading Countries!</p>;

  const countries: Country[] =
    data?.countries?.map((country: Country) => ({
      code: country.code,
      name: country.name,
      emoji: country.emoji,
      continent: country.continent.name,
    })) || [];

  const columns: Array<EuiBasicTableColumn<Country>> = [
    {
      field: "code",
      name: "Code",
      sortable: true,
    },
    {
      field: "name",
      name: "Name",
      sortable: true,
    },
    {
      field: "emoji",
      name: "Emoji",
    },
    {
      field: "continent",
      name: "Continent",
      sortable: true,
      render: (continent: string) => <strong>{continent}</strong>,
    },
  ];

  const onTableChange = ({ page, sort }: Criteria<Country>) => {
    if (page) {
      const { index: pageIndex, size: pageSize } = page;
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    }
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  // Manually handle sorting and pagination of data
  const findUsers = (
    users: Country[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Country,
    sortDirection: 'asc' | 'desc'
  ) => {
    let items;

    if (sortField) {
      items = users
        .slice(0)
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    } else {
      items = users;
    }

    let pageOfItems;

    if (!pageIndex && !pageSize) {
      pageOfItems = items;
    } else {
      const startIndex = pageIndex * pageSize;
      pageOfItems = items.slice(
        startIndex,
        Math.min(startIndex + pageSize, users.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: users.length,
    };
  };

  const { pageOfItems, totalItemCount } = findUsers(
    countries,
    pageIndex,
    pageSize,
    sortField,
    sortDirection
  );

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [3, 5, 8],
  };

  const sorting: EuiTableSortingType<Country> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    }
  };

  console.log(sorting, "sorting");
  console.log(pagination, "pagination");
  console.log(onTableChange, "onTableChange");

  return (
    <EuiPanel hasShadow hasBorder>
      <EuiBasicTable
        className="table"
        items={pageOfItems}
        columns={columns}
        // sorting={sorting}
        // pagination={pagination}
        // onChange={onTableChange}
      />
    </EuiPanel>
  );
}

export default App;
