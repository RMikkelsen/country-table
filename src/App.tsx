

import { EuiBasicTable, EuiPanel } from '@elastic/eui';
import './App.css';
import { gql, useQuery } from '@apollo/client';



interface Country {
  code?: string;
  name?: string;
  emoji?: string;
  continent: {
    name?: string;
  }
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

  if (loading) return <p>Loading Countries...</p>;
  if (error) return <p>Error Loading Countries!</p>;

  const countries: Country[] =
    data?.countries?.map((country: Country) => ({
      code: country.code,
      name: country.name,
      emoji: country.emoji,
      continent: country.continent.name,
    })) || [];

    console.log(countries, 'countries');
    console.log(JSON.stringify(countries, null, 2), 'Mapped countries array');

  const columns = [
    {
      field: 'code',
      name: 'Code',
      sortable: true,
    },
    {
      field: 'name',
      name: 'Name',
      sortable: true,
    },
    {
      field: 'emoji',
      name: 'Emoji',
    },
    {
      field: 'continent',
      name: 'Continent',
      sortable: true,
    },
  ];

  // const sorting: EuiTableSortingType<Country> = {
  //   sort: {
  //     field: 'name',
  //     direction: 'asc',
  //   },
  // };

  return (
    <EuiPanel>
      <EuiBasicTable
        items={countries}
        columns={columns}
        // sorting={sorting}
      />
    </EuiPanel>

  );
}

export default App;
