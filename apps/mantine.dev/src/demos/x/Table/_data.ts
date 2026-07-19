export interface Person {
  age: number
  city: string
  email: string
  firstName: string
  lastName: string
}

export const people: Person[] = [
  { firstName: 'Jane', lastName: 'Doe', age: 30, city: 'Austin', email: 'jane.doe@example.com' },
  {
    firstName: 'John',
    lastName: 'Smith',
    age: 25,
    city: 'Denver',
    email: 'john.smith@example.com',
  },
  {
    firstName: 'Mary',
    lastName: 'Jones',
    age: 42,
    city: 'Seattle',
    email: 'mary.jones@example.com',
  },
  { firstName: 'Bob', lastName: 'Brown', age: 28, city: 'Boston', email: 'bob.brown@example.com' },
  {
    firstName: 'Alice',
    lastName: 'Green',
    age: 35,
    city: 'Portland',
    email: 'alice.green@example.com',
  },
  { firstName: 'Tom', lastName: 'White', age: 51, city: 'Chicago', email: 'tom.white@example.com' },
]
