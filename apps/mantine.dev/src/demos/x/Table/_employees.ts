export interface Employee {
  department: string
  jobTitle: string
  name: string
  salary: number
  state: string
}

const NAMES = [
  'Jane Doe',
  'John Smith',
  'Mary Jones',
  'Bob Brown',
  'Alice Green',
  'Tom White',
  'Sara Khan',
  'Mike Reyes',
  'Lena Cohen',
  'Omar Ito',
  'Nina Novak',
  'Paul Diaz',
]
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Support']
const TITLES: Record<string, string[]> = {
  Engineering: ['Engineer', 'Senior Engineer', 'Engineering Manager'],
  Sales: ['Account Executive', 'Sales Manager'],
  Marketing: ['Content Strategist', 'Marketing Manager'],
  Support: ['Support Agent', 'Support Lead'],
}
const STATES = ['CA', 'TX', 'NY', 'WA', 'CO', 'FL']

export const employees: Employee[] = Array.from({ length: 48 }, (_, i) => {
  const department = DEPARTMENTS[i % DEPARTMENTS.length]
  const titles = TITLES[department]
  return {
    name: NAMES[i % NAMES.length],
    department,
    jobTitle: titles[i % titles.length],
    salary: 60_000 + ((i * 7919) % 90) * 1000,
    state: STATES[(i * 5) % STATES.length],
  }
})
