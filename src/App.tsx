import {
  Comparators,
  Criteria,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiPanel,
  EuiProvider,
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
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<keyof Country>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [filterText, setFilterText] = useState("");

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
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value.toLowerCase());
    setPageIndex(0); // Reset to the first page after filtering
  };

  //  sorting and pagination of data
  const findCountry = (
    countries: Country[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Country,
    sortDirection: "asc" | "desc",
    filterText: string
  ) => {
    // Filter by search query
    const filteredCountries = countries.filter(
      (country) =>
        country.code?.toLowerCase().includes(filterText) ||
        country.name?.toLowerCase().includes(filterText) ||
        country.continent?.toString()?.toLowerCase().includes(filterText)
    );

    // Sort the data
    let sortedCountries = filteredCountries;
    if (sortField) {
      sortedCountries = filteredCountries
        .slice()
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    }

    // Paginate the data
    const startIndex = pageIndex * pageSize;
    const paginatedCountries = sortedCountries.slice(
      startIndex,
      Math.min(startIndex + pageSize, sortedCountries.length)
    );

    return {
      pageOfItems: paginatedCountries,
      totalItemCount: countries.length,
    };
  };

  const { pageOfItems, totalItemCount } = findCountry(
    countries,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    filterText
  );

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [10, 20, 40],
  };

  const sorting: EuiTableSortingType<Country> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  console.log(pagination, sorting);
  return (
    <EuiProvider>
      <EuiPanel hasShadow hasBorder>
        <h1 className="header">Table Country List</h1>
        {/* <EuiFieldSearch
          placeholder="Search by Code, Name, or Continent"
          value={filterText}
          onChange={handleSearch}
          isClearable
          aria-label="Filter countries"
          fullWidth
        /> */}
        <input
          type="text"
          placeholder="Search by Code, Name, or Continent"
          value={filterText}
          onChange={handleSearch}
          className="filterInput"
        />
        <EuiBasicTable
          className="table"
          items={pageOfItems}
          columns={columns}
          // sorting={sorting}
          // pagination={pagination}
          onChange={onTableChange}
        />
        <div>Total Countries Shown: {pageOfItems.length} / {countries.length}</div>
      </EuiPanel>
    </EuiProvider>
  );
}

export default App;
