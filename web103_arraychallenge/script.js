const people = [
    {
      firstName: 'Benjie',
      lastName: 'Cruz',
      email: 'benjie@gmail.com',
      phone: '111-111-1111',
      age: 30,
    },
    {
      firstName: 'Joanne',
      lastName: 'Gamba',
      email: 'joanne@gmail.com',
      phone: '222-222-2222',
      age: 25,
    },
    {
      firstName: 'Erickson',
      lastName: 'Oreste',
      email: 'erickson@gmail.com',
      phone: '333-333-3333',
      age: 45,
    },
    {
      firstName: 'Eimar',
      lastName: 'Sison',
      email: 'eimar@gmail.com',
      phone: '444-444-4444',
      age: 19,
    },
    {
      firstName: 'Giselle',
      lastName: 'Stewart',
      email: 'giselle@gmail.com',
      phone: '555-555-5555',
      age: 23,
    },
  ];
  
  const youngPeople = people
    .filter(person => person.age <= 25)
    .map(person => ({
      name: `${person.firstName} ${person.lastName}`,
      email: person.email
    }));
  
  console.log(youngPeople);


  const peopleAges = people.map(person => ({
    name: `${person.firstName} ${person.lastName}`,
    email: person.email,
    age: person.age
}));

console.log(peopleAges);

[
    { name: 'Benjie Cruz', email: 'benjie@gmail.com', age: 30 },
    { name: 'Joanne Gamba', email: 'joanne@gmail.com', age: 25 },
    { name: 'Erickson Oreste', email: 'erickson@gmail.com', age: 45 },
    { name: 'Eimar Sison', email: 'eimar@gmail.com', age: 19 },
    { name: 'Giselle Stewart', email: 'giselle@gmail.com', age: 23 }
  ]



