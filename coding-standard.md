# Introduction

Cookers Coding Standards! This document outlines the best practices and guidelines for writing clean, maintainable, and efficient code in our projects. By adhering to these standards, we aim to ensure consistency across our codebase, improve collaboration among team members, and reduce the likelihood of bugs and technical debt.

Our coding standards cover a wide range of topics, including:

- Best Practices of ReactJS with TypeScript
- TypeScript Guidance
- Source Organization

Whether you are a new team member or an experienced developer, this document serves as a valuable resource to help you write high-quality code that aligns with our team's conventions and expectations.

Let's dive in and explore the best practices and guidelines that will help us build robust and scalable applications together!

# Table of Contents

1. [Best Practices of ReactJS with TypeScript](#1-best-practices-of-reactjs-with-typescript)
   1. [Enable Strict Mode](#11-enable-strict-mode)
   2. [Type Annotations for Props and State](#12-type-annotations-for-props-and-state)
   3. [Functional Components and React Hooks](#13-functional-components-and-react-hooks)
   4. [Use TypeScript Utility Types](#14-use-typescript-utility-types)
   5. [Avoid Any Type](#15-avoid-any-type)
   6. [Error Handling with Custom Types](#16-error-handling-with-custom-types)
   7. [Use Generic Components](#17-use-generic-components)
   8. [Avoid Unnecessary Type Assertions](#18-avoid-unnecessary-type-assertions)
   9. [Consistent Naming Conventions](#19-consistent-naming-conventions)
   10. [Use Third-Party Libraries with TypeScript Support](#110-use-third-party-libraries-with-typescript-support)
   11. [Optimization Techniques](#111-optimization-techniques)
   12. [Component Design Patterns](#112-component-design-patterns)
   13. [Debounce and Throttle Event Handlers](#113-debounce-and-throttle-event-handlers)
   14. [Conditional Rendering](#114-conditional-rendering)
   15. [Callback Props](#115-callback-props)
   16. [Immutability](#116-immutability)
   17. [Best Practices of File, Folder Code Naming Styles](#117-best-practices-of-file-folder-code-naming-styles)
2. [Typescript Guidance](#2-typescript-guidance)
   1. [Type Inference](#21-type-inference)
   2. [Data Immutability](#22-data-immutability)
   3. [Template Literal Types](#23-template-literal-types)
   4. [Type any & unknown](#24-type-any--unknown)
   5. [Type & Non-nullability Assertions](#25-type--non-nullability-assertions)
   6. [Type Definition](#26-type-definition)
   7. [Array Types](#27-array-types)
   8. [Functions](#28-functions)
   9. [Enums & Const Assertion](#29-enums--const-assertion)
   10. [Type Union & Boolean Flags](#210-type-union--boolean-flags)
   11. [Abbreviations & Acronyms](#211-abbreviations--acronyms)
   12. [Comments](#212-comments)
3. [Source Organization](#3-source-organization)
   1. [Code Collocation](#31-code-collocation)
   2. [Imports](#32-imports)
4. [Conclusion](#4-conclusion)

# 1. Best Practices of ReactJS with TypeScript

## 1. Enable Strict Mode

Enable strict mode in the TypeScript configuration to enforce strict type checking and catch potential errors at compile-time. This can be done by setting `"strict": true` in the `tsconfig.json` file.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 2. Type Annotations for Props and State

Always provide type annotations for component props and state to ensure type safety and improve code readability. Use interfaces or types to define the shape of props and state objects.

```typescript
interface MyComponentProps {
  name: string;
  age: number;
}

interface MyComponentState {
  isOpen: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ name, age }) => {
  // Component implementation
};
```

## 3. Functional Components and React Hooks

Prefer functional components over class components whenever possible. Use React hooks (e.g., `useState`, `useEffect`) to manage state and lifecycle behavior in functional components.

```typescript
import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialCount: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Do something when count changes
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## 4. Use TypeScript Utility Types

Take advantage of TypeScript's utility types to simplify common type transformations. Utility types like `Partial`, `Required`, `Pick`, and `Omit` can be used to modify and compose types efficiently.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>; // All properties become optional
type;

RequiredUser = Required<User>; // All properties become required
type UserWithoutEmail = Omit<User, 'email'>; // Exclude 'email' property
```

## 5. Avoid Any Type

Avoid using the any type as much as possible. Instead, provide explicit types or use union types to handle cases where the type can be more than one possibility.

```typescript
const fetchData = (): Promise<User[]> => {
  // Fetch user data from an API
};

const handleData = (data: User[] | null) => {
  // Handle data
};
```

## 6. Error Handling with Custom Types

Use custom types to represent different error states in asynchronous operations. This allows for more expressive error handling and ensures the proper handling of error cases.

```typescript
type AsyncResult<T, E> = { loading: boolean; data: T | null; error: E | null };

const fetchUserData = (): AsyncResult<User[], string> => {
  // Fetch user data and handle errors
};
```

## 7. Use Generic Components

Create generic components to enhance reusability and type safety. Generic components can handle different data types while maintaining type checking at compile-time.

```typescript
interface ListItem<T> {
  item: T;
}

const ListItemComponent: React.FC<ListItem<User>> = ({ item }) => {
  // Render item
};
```

## 8. Avoid Unnecessary Type Assertions

Avoid using type assertions (`as`) unless absolutely necessary. Instead, leverage TypeScript's type inference capabilities and provide explicit types to ensure type safety.

```typescript
const result: number = calculateValue() as number; // Unnecessary type assertion

const result: number = calculateValue(); // Preferred approach with explicit type
```

## 9. Consistent Naming Conventions

Follow consistent naming conventions for components, props, and variables. Use meaningful and descriptive names to improve code readability and maintainability.

```typescript
interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Component implementation
};

const getUserData = (): Promise<User> => {
  // Fetch user data
};
```

## 10. Use Third-Party Libraries with TypeScript Support

Prefer third-party libraries that provide TypeScript support and type definitions. TypeScript support ensures better integration with your codebase and helps catch potential issues early on.

Ensure that the installed types match the library version and use the correct import statements to import types from the library.

```typescript
import { Button } from 'third-party-library'; // Importing component
import { User } from 'third-party-library/types'; // Importing types
```

## 11. Optimization Techniques

To optimize ReactJS applications, consider the following techniques:

- Use the React.memo Higher Order Component (HOC) to memoize functional components and prevent unnecessary re-renders.
- Utilize the useCallback hook to memoize event handlers and prevent unnecessary re-creation of functions.
- Use the useMemo hook to memoize expensive computations and avoid redundant calculations.

```typescript
const MyComponent: React.FC<Props> = React.memo(({ propA, propB }) => {
  // Component implementation
});
```

## 12. Component Design Patterns

Consider using the following component design patterns to structure your ReactJS

application:

- **Container-Component Pattern:** Separate container components (smart components) responsible for handling data and business logic from presentational components (dumb components) responsible for rendering UI elements.
- **Render Prop Pattern:** Use the render prop pattern to share code and data between components by passing a function as a prop that returns JSX.
- **Higher-Order Component (HOC) Pattern:** Use HOCs to add additional functionality or modify behavior of existing components.
- **Provider Pattern:** Use React context API to provide data and state to multiple components without prop drilling.

```typescript

```

## 13. Debounce and Throttle Event Handlers

When handling events that can trigger frequent updates (e.g., scroll, resize), consider using debounce or throttle techniques to optimize performance and prevent excessive updates.

```typescript
import { debounce } from 'lodash';

const handleScroll = debounce(() => {
  // Handle scroll event
}, 200);

window.addEventListener('scroll', handleScroll);
```

## 14. Conditional Rendering

Use conditional rendering techniques to control the visibility and behavior of components based on certain conditions. This can be achieved using conditional statements, ternary operators, or logical && operator.

```typescript
const MyComponent: React.FC<Props> = ({ isLoggedIn }) => {
  return isLoggedIn ? <AuthenticatedComponent /> : <GuestComponent />;
};
```

## 15. Callback Props

Event handler (callback) props are prefixed as `on*` - e.g. `onClick`.
Event handler implementation functions are prefixed as `handle*` - e.g. `handleClick`

```typescript
// ❌ Avoid inconsistent callback prop naming
<Button click={actionClick} />
<MyComponent userSelectedOccurred={triggerUser} />

// ✅ Use prop prefix 'on*' and handler prefix 'handle*'
<Button onClick={handleClick} />
<MyComponent onUserSelected={handleUserSelected} />
```

## 16. Immutability

Follow the principle of immutability when updating state or props. Avoid directly mutating objects or arrays, as it can lead to unexpected behavior. Instead, create new copies of objects or arrays using immutable techniques like spread operators or immutable libraries.

```typescript
const updateItem = (index: number, newItem: Item) => {
  const updatedItems = [...items];
  updatedItems[index] = newItem;
  setItems(updatedItems);
};
```

## Best Practices of File, Folder Code Naming Styles

- **Camel Case**

```typescript
let firstName = 'John';
let lastName = 'Doe';

function printFullName(firstName, lastName) {
  let fullName = firstName + ' ' + lastName;
  console.log(fullName);
}
```

- Pascal Case

```typescript
class Person {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  printFullName(): void {
    let fullName = this.firstName + ' ' + this.lastName;
    console.log(fullName);
  }
}
```

- Kebab Case : IMPORTANT

All files and folders should follow Kebab Case

```jsx
<div className="user-profile">
  <p>This is a user profile.</p>
</div>
```

# 2. Typescript Guidance

## Introduction

TypeScript Style Guide provides a concise set of conventions and best practices to create consistent, maintainable code.

## 1. Type Inference

As rule of thumb, explicitly declare a type when it help narrows it.

```typescript
// ❌ Avoid - Don't explicitly declare a type, it can be inferred.
const userRole: string = 'admin'; // Type 'string'
const employees = new Map<string, number>([['Gabriel', 32]]);
const [isActive, setIsActive] = useState<boolean>(false);

// ✅ Use type inference.
const USER_ROLE = 'admin'; // Type 'admin'
const employees = new Map([['Gabriel', 32]]); // Type 'Map<string, number>'
const [isActive, setIsActive] = useState(false); // Type 'boolean'

// ❌ Avoid - Don't infer a (wide) type, it can be narrowed.
const employees = new Map(); // Type 'Map<any, any>'
employees.set('Lea', 17);
type UserRole = 'admin' | 'guest';
const [userRole, setUserRole] = useState('admin'); // Type 'string'

// ✅ Use explicit type declaration to narrow the type.
const employees = new Map<string, number>(); // Type 'Map<string, number>'
employees.set('Gabriel', 32);
type UserRole = 'admin' | 'guest';
const [userRole, setUserRole] = useState<UserRole>('admin'); // Type 'UserRole'
```

## 2. Data Immutability

Majority of the data should be immutable with use of `Readonly`, `ReadonlyArray`.

Using readonly type prevents accidental data mutations, which reduces the risk of introducing bugs related to unintended side effects.

When performing data processing always return new array, object etc. To keep cognitive load for future developers low, try to keep data objects small.
As an exception mutations should be used sparingly in cases where truly necessary: complex objects, performance reasoning etc.

```typescript
// ❌ Avoid data mutations
const removeFirstUser = (users: Array<User>) => {
  if (users.length === 0) {
    return users;
  }
  return users.splice(1);
};

// ✅ Use readonly type to prevent accidental mutations
const removeFirstUser = (users: ReadonlyArray<User>) => {
  if (users.length === 0) {
    return users;
  }
  return users.slice(1);
  // Using arr.splice(1) errors - Function 'splice' does not exist on 'users'
};
```

## 3. Template Literal Types

Embrace using template literal types, instead of just (wide) `string` type.
Template literal types have many applicable use cases e.g. API endpoints, routing, internationalization, database queries, CSS typings

```typescript
// ❌ Avoid
const userEndpoint = '/api/usersss'; // Type 'string' - Since typo 'usersss', route doesn't exist and results in runtime error
// ✅ Use
type ApiRoute = 'users' | 'posts' | 'comments';
type ApiEndpoint = `/api/${ApiRoute}`; // Type ApiEndpoint = "/api/users" | "/api/posts" | "/api/comments"
const userEndpoint: ApiEndpoint = '/api/users';

// ❌ Avoid
const homeTitle = 'translation.homesss.title'; // Type 'string' - Since typo 'homesss', translation doesn't exist and results in runtime error
// ✅ Use
type LocaleKeyPages = 'home' | 'about' | 'contact';
type TranslationKey = `translation.${LocaleKeyPages}.${string}`; // Type TranslationKey = `translation.home.${string}` | `translation.about.${string}` | `translation.contact.${string}`
const homeTitle: TranslationKey = 'translation.home.title';

// ❌ Avoid
const color = 'blue-450'; // Type 'string' - Since color 'blue-450' doesn't exist and results in runtime error
// ✅ Use
type BaseColor = 'blue' | 'red' | 'yellow' | 'gray';
type Variant = 50 | 100 | 200 | 300 | 400;
type Color = `${BaseColor}-${Variant}` | `#${string}`; // Type Color = "blue-50" | "blue-100" | "blue-200" ... | "red-50" | "red-100" ... | #${string}
const iconColor: Color = 'blue-400';
const customColor: Color = '#AD3128';
```

## 4. Type any & unknown

`any` data type must not be used as it represents literally “any” value that TypeScript defaults to and skips type checking since it cannot infer the type. As such, `any` is dangerous, it can mask severe programming errors.

When dealing with ambiguous data type use `unknown`, which is the type-safe counterpart of `any`.
unknown doesn't allow dereferencing all properties (anything can be assigned to `unknown`, but `unknown` isn’t assignable to anything).

```typescript
// ❌ Avoid any
const foo: any = 'five';
const bar: number = foo; // no type error

// ✅ Use unknown
const foo: unknown = 5;
const bar: number = foo; // type error - Type 'unknown' is not assignable to type 'number'

// Narrow the type before dereferencing it using:
// Type guard
const isNumber = (num: unknown): num is number => {
  return typeof num === 'number';
};
if (!isNumber(foo)) {
  throw Error(`API provided a fault value for field 'foo':${foo}. Should be a number!`);
}
const bar: number = foo;

// Type assertion
const bar: number = foo as number;
```

## 5. Type & Non-nullability Assertions

Type assertions `user as User` and non-nullability assertions `user!.name` are unsafe. Both only silence TypeScript compiler and increase the risk of crashing application at runtime.
They can only be used as an exception (e.g. third party library types mismatch, dereferencing `unknown` etc.) with a strong rational for why it's introduced into the codebase.

```typescript
type User = { id: string; username: string; avatar: string | null };
// ❌ Avoid type assertions
const user = { name: 'Nika' } as User;
// ❌ Avoid non-nullability assertions
renderUserAvatar(user!.avatar); // Runtime error

const renderUserAvatar = (avatar: string) => {...}
```

## 6. Type Definition

TypeScript offers two options for type definitions - `type` and `interface`. As they come with some functional differences in most cases they can be used interchangeably. We try to limit syntax difference and pick one for consistency.

All types must be defined with `type` alias

```typescript
// ❌ Avoid interface definitions
interface UserRole = 'admin' | 'guest'; // invalid - interface can't define (commonly used) type unions

interface UserInfo {
  name: string;
  role: 'admin' | 'guest';
}

// ✅ Use type definition
type UserRole = 'admin' | 'guest';

type UserInfo = {
  name: string;
  role: UserRole;
};

```

## 7. Array Types

Array types must be defined with generic syntax

```typescript
// ❌ Avoid
const x: string[] = ['foo', 'bar'];
const y: readonly string[] = ['foo', 'bar'];

// ✅ Use
const x: Array<string> = ['foo', 'bar'];
const y: ReadonlyArray<string> = ['foo', 'bar'];
```

## 8. Functions

Function conventions should be followed as much as possible (some of the conventions derive from functional programming basic concepts):

### General

Function:

- should have single responsibility.
- should be stateless where the same input arguments return same value every single time.
- should accept at least one argument and return data.
- should not have side effects, but be pure. Implementation should not modify or access variable value outside its local environment (global state, fetching etc.).

### Single Object Arg

To keep function readable and easily extensible for the future (adding/removing args), strive to have single object as the function arg, instead of multiple args.

As an exception this does not apply when having only one primitive single arg (e.g. simple functions isNumber(value), implementing currying etc.).

```typescript
// ❌ Avoid having multiple arguments
transformUserInput('client', false, 60, 120, null, true, 2000);

// ✅ Use options object as argument
transformUserInput({
  method: 'client',
  isValidated: false,
  minLines: 60,
  maxLines: 120,
  defaultInput: null,
  shouldLog: true,
  timeout: 2000,
});
```

### Required & Optional Args

**Strive to have majority of args required and use optional sparingly.**
If the function becomes too complex, it probably should be broken into smaller pieces.
An exaggerated example where implementing 10 functions with 5 required args each, is better then implementing one "can do it all" function that accepts 50 optional args.

### Args as Discriminated Union

When applicable use discriminated union type to eliminate optional args, which will decrease complexity on function API and only necessary/required args will be passed depending on its use case.

```typescript
// ❌ Avoid optional args as they increase complexity of function API
type StatusParams = {
  data?: Products;
  title?: string;
  time?: number;
  error?: string;
};

// ✅ Strive to have majority of args required, if that's not possible,
// use discriminated union for clear intent on function usage
type StatusSuccessParams = {
  status: 'success';
  data: Products;
  title: string;
};

type StatusLoadingParams = {
  status: 'loading';
  time: number;
};

type StatusErrorParams = {
  status: 'error';
  error: string;
};

type StatusParams = StatusSuccessParams | StatusLoadingParams | StatusErrorParams;

export const parseStatus = (params: StatusParams) => {...
```

## 9. Enums & Const Assertion

Const assertion must be used over enum.

While enums can still cover use cases as const assertion would, we tend to avoid it. Some of the reasonings as mentioned in TypeScript documentation - Const enum pitfalls, Objects vs Enums, Reverse mappings

```typescript
// ❌ Avoid using enums
enum UserRole {
  GUEST,
  MODERATOR,
  ADMINISTRATOR,
}

enum Color {
  PRIMARY = '#B33930',
  SECONDARY = '#113A5C',
  BRAND = '#9C0E7D',
}

// ✅ Use const assertion
const USER_ROLES = ['guest', 'moderator', 'administrator'] as const;
type UserRole = (typeof USER_ROLES)[number]; // Type "guest" | "moderator" | "administrator"

// Use satisfies if UserRole type is already defined - e.g. database schema model
type UserRoleDB = ReadonlyArray<'guest' | 'moderator' | 'administrator'>;
const AVAILABLE_ROLES = ['guest', 'moderator'] as const satisfies UserRoleDB;

const COLOR = {
  primary: '#B33930',
  secondary: '#113A5C',
  brand: '#9C0E7D',
} as const;
type Color = typeof COLOR;
type ColorKey = keyof Color; // Type "primary" | "secondary" | "brand"
type ColorValue = Color[ColorKey]; // Type "#B33930" | "#113A5C" | "#9C0E7D"
```

## 10. Type Union & Boolean Flags

Embrace type unions, especially when type union options are mutually exclusive, instead multiple boolean flag variables.

Boolean flags have a tendency to accumulate over time, leading to confusing and error-prone code, since they hide the actual app state.

```typescript
// ❌ Avoid introducing multiple boolean flag variables
const isPending, isProcessing, isConfirmed, isExpired;

// ✅ Use type union variable
type UserStatus = 'pending' | 'processing' | 'confirmed' | 'expired';
const userStatus: UserStatus;
```

## 11. Abbreviations & Acronyms

Treat acronyms as whole words, with capitalized first letter only.

```typescript
// ❌ Avoid
const FAQList = ['qa-1', 'qa-2'];
const generateUserURL(params) => {...}
const GetWin(params) => {...}

// ✅ Use
const FaqList = ['qa-1', 'qa-2'];
const generateUserUrl(params) => {...}
const GetWindow(params) => {...}
```

## 12. Comments

In general try to avoid comments, by writing expressive code and name things what they are.

Use comments when you need to add context or explain choices that cannot be expressed through code (e.g. config files).
Comments should always be complete sentences. As rule of thumb try to explain `why` in comments, not `how` and `what`.

```typescript
// ❌ Avoid
// convert to minutes
const m = s * 60;
// avg users per minute
const myAvg = u / m;

// ✅ Use - Expressive code and name things what they are
const SECONDS_IN_MINUTE = 60;
const minutes = seconds * SECONDS_IN_MINUTE;
const averageUsersPerMinute = noOfUsers / minutes;

// ✅ Use - Add context to explain why in comments
// TODO: Filtering should be moved to the backend once API changes are released.
// Issue/PR - https://github.com/foo/repo/pulls/55124
const filteredUsers = frontendFiltering(selectedUsers);
// Use Fourier transformation to minimize information loss - https://github.com/dntj/jsfft#usage
const frequencies = signal.FFT();
```

# 3. Source Organization

## Code Collocation

- Every application or package in monorepo has project files/folders organized and grouped by feature.
- Collocate code as close as possible to where it's relevant.
- Deep folder nesting should not represent an issue.

## 1. Imports

Import paths can be relative, starting with `./` or `../`, or they can be absolute `@common/utils`.

To make import statements more readable and easier to understand:

- **Relative** imports `./sortItems` must be used when importing files within the same feature, that are 'close' to each other, which also allows moving feature around the codebase without introducing changes in these imports.
- **Absolute** imports `@common/utils` must be used in all other cases.
- All imports must be auto sorted by tooling

```typescript
// ❌ Avoid
import { bar, foo } from '../../../../../../distant-folder';

// ✅ Use
import { locationApi } from '@services/locationApi';

import { foo } from '../../foo';
import { bar } from '../bar';
import { baz } from './baz';
```

# Conclusion

By following these best practices, you can enhance your ReactJS with TypeScript projects, improve code quality, maintainability, and performance, and leverage the full potential of these technologies. Remember to adapt these practices based on your project's specific needs and requirements.
