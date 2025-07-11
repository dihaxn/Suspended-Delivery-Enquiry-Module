import { ApiResponse } from '@cookers/queries';
import { faker } from '@faker-js/faker';
import { SortingState } from '@tanstack/react-table';

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  createdAt: number;
};

export type SystemImprovement = {
  id: number;
  systemName: number;
  status: 'Open' | 'Close' | 'Completed';
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (index: number): Person => {
  return {
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    createdAt: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>(['relationship', 'complicated', 'single'])[0],
  };
};

export function makeDataPerson(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth];
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      };
    });
  };

  return makeDataLevel();
}

const dataPerson = makeDataPerson(1000);

export function makeDataSystem(...lens: number[]) {
  const makeDataLevel = (depth = 0): SystemImprovement[] => {
    const len = lens[depth];
    return range(len).map((d): SystemImprovement => {
      return {
        ...newSystem(d),
      };
    });
  };

  return makeDataLevel();
}

const newSystem = (index: number): SystemImprovement => {
  return {
    id: index + 1,
    systemName: faker.number.int(100),
    status: faker.helpers.shuffle<SystemImprovement['status']>(['Open', 'Close', 'Completed'])[0],
  };
};

const dataSystem = makeDataSystem(200);

export const fetchData = async <T>(start: number, size: number, sorting: SortingState, tableType: string): Promise<ApiResponse<T>> => {
  let data: any

  // Check if T is 'A' and pass 'A' string as a parameter
  console.log('Parameter A passed', isTypePerson<T>());
  if (tableType === 'Person') {
    data = dataPerson;
  } else {
    data = dataSystem;
  }

  if (data.length === 0) {
    return {
      data: [],
      totalRowCount: 0,
      nextPage: 0,
      currentPage: 0
    };
  }

  const dbData = [...data] as T[]; // Cast dbData to T[]
  if (sorting.length) {
    const sort = sorting[0];
    const { id, desc } = sort as { id: keyof T; desc: boolean };
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1;
      }
      return a[id] > b[id] ? 1 : -1;
    });
  }

  // Simulate a backend API
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    data: dbData.slice(start, start + size),
    totalRowCount: dbData.length,
      nextPage: 0,
      currentPage: 0

  };
};

// Type guard to check if T is 'A'
function isTypePerson<T>(): T extends 'Person' ? true : false {
  return false as unknown as T extends 'Person' ? true : false;
}
