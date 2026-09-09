// src/data/quizData.js
// Static quiz question bank. Each topic has questions across
// Easy / Medium / Hard difficulty levels.

export const TOPICS = [
  'JavaScript',
  'React',
  'Python',
  'DBMS',
  'Computer Networks',
  'Data Structures',
];

export const quizData = {
  JavaScript: [
    {
      id: 'js1',
      question: 'Which keyword is used to declare a block-scoped variable in JavaScript?',
      options: ['var', 'let', 'const', 'Both let and const'],
      correctAnswer: 3,
      explanation:
        'Both "let" and "const" are block-scoped, while "var" is function-scoped.',
      difficulty: 'Easy',
    },
    {
      id: 'js2',
      question: 'What does "===" check for in JavaScript?',
      options: [
        'Only value equality',
        'Only type equality',
        'Both value and type equality',
        'Neither value nor type',
      ],
      correctAnswer: 2,
      explanation:
        'The strict equality operator "===" checks both value and type, unlike "==" which performs type coercion.',
      difficulty: 'Easy',
    },
    {
      id: 'js3',
      question: 'What is a closure in JavaScript?',
      options: [
        'A function bundled with its lexical scope',
        'A loop that never ends',
        'A way to close the browser tab',
        'A CSS property',
      ],
      correctAnswer: 0,
      explanation:
        'A closure is formed when a function retains access to variables from its enclosing lexical scope even after that scope has finished executing.',
      difficulty: 'Medium',
    },
    {
      id: 'js4',
      question: 'What will "typeof null" return in JavaScript?',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctAnswer: 2,
      explanation:
        'This is a famous JavaScript quirk — "typeof null" returns "object" due to a legacy bug in the language.',
      difficulty: 'Medium',
    },
    {
      id: 'js5',
      question: 'What is the output of: Promise.resolve(1).then(v => v + 1)?',
      options: [
        'It returns a Promise resolving to 2',
        'It returns 2 immediately',
        'It throws an error',
        'It returns undefined',
      ],
      correctAnswer: 0,
      explanation:
        'Promise chaining with ".then()" always returns a new Promise, which here resolves to 2 asynchronously.',
      difficulty: 'Hard',
    },
    {
      id: 'js6',
      question: 'Which method creates a new array by applying a function to every element?',
      options: ['forEach()', 'map()', 'filter()', 'reduce()'],
      correctAnswer: 1,
      explanation:
        '"map()" returns a brand-new array with the results of calling a function on every element.',
      difficulty: 'Easy',
    },
  ],

  React: [
    {
      id: 'react1',
      question: 'What is JSX in React?',
      options: [
        'A database query language',
        'A syntax extension that lets you write HTML-like code in JavaScript',
        'A CSS framework',
        'A testing library',
      ],
      correctAnswer: 1,
      explanation:
        'JSX is a syntax extension for JavaScript that allows writing HTML-like markup directly inside JS code, which React compiles into function calls.',
      difficulty: 'Easy',
    },
    {
      id: 'react2',
      question: 'Which hook is used to manage state in a functional component?',
      options: ['useEffect', 'useState', 'useContext', 'useRef'],
      correctAnswer: 1,
      explanation:
        '"useState" is the primary hook for adding local state to a functional component.',
      difficulty: 'Easy',
    },
    {
      id: 'react3',
      question: 'What does the "useEffect" hook primarily handle?',
      options: [
        'Styling components',
        'Side effects like data fetching or subscriptions',
        'Routing between pages',
        'Managing global CSS',
      ],
      correctAnswer: 1,
      explanation:
        '"useEffect" lets you perform side effects such as data fetching, subscriptions, or manually changing the DOM after render.',
      difficulty: 'Medium',
    },
    {
      id: 'react4',
      question: 'What is the purpose of "keys" in React lists?',
      options: [
        'To style list items',
        'To help React identify which items changed, were added, or removed',
        'To encrypt list data',
        'To sort the list automatically',
      ],
      correctAnswer: 1,
      explanation:
        'Keys give elements a stable identity across renders, helping React efficiently update the DOM.',
      difficulty: 'Medium',
    },
    {
      id: 'react5',
      question: 'What problem does "React.memo" solve?',
      options: [
        'It prevents unnecessary re-renders of a component when props are unchanged',
        'It manages global state',
        'It handles routing',
        'It fetches data from an API',
      ],
      correctAnswer: 0,
      explanation:
        '"React.memo" is a higher-order component that memoizes the render output, skipping re-renders if props haven\'t changed.',
      difficulty: 'Hard',
    },
    {
      id: 'react6',
      question: 'What is "prop drilling"?',
      options: [
        'Passing props through many nested components to reach a deeply nested child',
        'A React debugging tool',
        'A way to delete props',
        'A CSS animation technique',
      ],
      correctAnswer: 0,
      explanation:
        'Prop drilling occurs when data is passed through several layers of components that don\'t need it, just to reach a deeply nested child — often solved with Context or state management.',
      difficulty: 'Hard',
    },
  ],

  Python: [
    {
      id: 'py1',
      question: 'Which of the following is used to define a function in Python?',
      options: ['function', 'def', 'func', 'define'],
      correctAnswer: 1,
      explanation: 'The "def" keyword is used to define functions in Python.',
      difficulty: 'Easy',
    },
    {
      id: 'py2',
      question: 'What data type is the result of "3 / 2" in Python 3?',
      options: ['int', 'float', 'str', 'complex'],
      correctAnswer: 1,
      explanation:
        'In Python 3, the "/" operator always performs true division and returns a float, e.g. 1.5.',
      difficulty: 'Easy',
    },
    {
      id: 'py3',
      question: 'What is a list comprehension used for?',
      options: [
        'Deleting lists',
        'Creating a new list in a concise, readable way',
        'Sorting dictionaries',
        'Reading files',
      ],
      correctAnswer: 1,
      explanation:
        'List comprehensions provide a concise syntax to create lists based on existing iterables, e.g. [x*2 for x in range(5)].',
      difficulty: 'Medium',
    },
    {
      id: 'py4',
      question: 'What does the "self" parameter represent in a Python class method?',
      options: [
        'A global variable',
        'A reference to the current instance of the class',
        'A static method marker',
        'The parent class',
      ],
      correctAnswer: 1,
      explanation:
        '"self" refers to the current object instance, allowing access to its attributes and methods.',
      difficulty: 'Medium',
    },
    {
      id: 'py5',
      question: 'What is the Global Interpreter Lock (GIL) in Python?',
      options: [
        'A security feature for encrypting code',
        'A mutex that allows only one thread to execute Python bytecode at a time',
        'A tool for managing global variables',
        'A package manager',
      ],
      correctAnswer: 1,
      explanation:
        'The GIL is a mutex in CPython that prevents multiple native threads from executing Python bytecode simultaneously, affecting CPU-bound multithreading.',
      difficulty: 'Hard',
    },
    {
      id: 'py6',
      question: 'Which module is commonly used for handling dates and times in Python?',
      options: ['time_utils', 'datetime', 'calendar_tools', 'pytime'],
      correctAnswer: 1,
      explanation:
        'The built-in "datetime" module provides classes for manipulating dates and times.',
      difficulty: 'Easy',
    },
  ],

  DBMS: [
    {
      id: 'dbms1',
      question: 'What does DBMS stand for?',
      options: [
        'Database Management System',
        'Data Backup Management Software',
        'Distributed Basic Memory System',
        'Data Block Management Server',
      ],
      correctAnswer: 0,
      explanation:
        'DBMS stands for Database Management System — software used to create, manage, and interact with databases.',
      difficulty: 'Easy',
    },
    {
      id: 'dbms2',
      question: 'What is a primary key?',
      options: [
        'A key that can have duplicate and null values',
        'A column or set of columns that uniquely identifies each row in a table',
        'An encryption key for the database',
        'A key used only for foreign relationships',
      ],
      correctAnswer: 1,
      explanation:
        'A primary key uniquely identifies each record in a table and cannot contain NULL or duplicate values.',
      difficulty: 'Easy',
    },
    {
      id: 'dbms3',
      question: 'What is the main purpose of normalization in DBMS?',
      options: [
        'To increase data redundancy',
        'To organize data and reduce redundancy and dependency issues',
        'To encrypt data',
        'To make queries slower',
      ],
      correctAnswer: 1,
      explanation:
        'Normalization organizes tables to minimize data redundancy and avoid update, insertion, and deletion anomalies.',
      difficulty: 'Medium',
    },
    {
      id: 'dbms4',
      question: 'Which normal form removes partial dependency on a composite primary key?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctAnswer: 1,
      explanation:
        'Second Normal Form (2NF) requires the table to be in 1NF and removes partial dependencies of non-key attributes on part of a composite primary key.',
      difficulty: 'Medium',
    },
    {
      id: 'dbms5',
      question: 'What does ACID stand for in the context of database transactions?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Availability, Concurrency, Integrity, Durability',
        'Atomicity, Concurrency, Isolation, Dependency',
        'Accuracy, Consistency, Independence, Durability',
      ],
      correctAnswer: 0,
      explanation:
        'ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee reliable processing of database transactions.',
      difficulty: 'Hard',
    },
    {
      id: 'dbms6',
      question: 'What is a foreign key used for?',
      options: [
        'To uniquely identify rows in the same table',
        'To link two tables together by referencing the primary key of another table',
        'To encrypt sensitive columns',
        'To index a table for faster search',
      ],
      correctAnswer: 1,
      explanation:
        'A foreign key is a column (or set of columns) that references the primary key of another table, enforcing referential integrity.',
      difficulty: 'Medium',
    },
  ],

  'Computer Networks': [
    {
      id: 'cn1',
      question: 'What does IP stand for in networking?',
      options: ['Internet Protocol', 'Internal Process', 'Information Packet', 'Interconnect Path'],
      correctAnswer: 0,
      explanation:
        'IP stands for Internet Protocol, which handles addressing and routing of packets across networks.',
      difficulty: 'Easy',
    },
    {
      id: 'cn2',
      question: 'Which layer of the OSI model is responsible for routing?',
      options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
      correctAnswer: 2,
      explanation:
        'The Network Layer (Layer 3) is responsible for logical addressing and routing packets between networks.',
      difficulty: 'Medium',
    },
    {
      id: 'cn3',
      question: 'What is the main difference between TCP and UDP?',
      options: [
        'TCP is connectionless, UDP is connection-oriented',
        'TCP is connection-oriented and reliable, UDP is connectionless and faster but unreliable',
        'They are identical protocols',
        'UDP guarantees delivery, TCP does not',
      ],
      correctAnswer: 1,
      explanation:
        'TCP establishes a connection and guarantees reliable, ordered delivery, while UDP is connectionless and faster but doesn\'t guarantee delivery.',
      difficulty: 'Medium',
    },
    {
      id: 'cn4',
      question: 'What does DNS stand for and what does it do?',
      options: [
        'Domain Name System — translates domain names into IP addresses',
        'Data Network Service — encrypts network traffic',
        'Digital Node System — manages routers',
        'Domain Node Server — stores web pages',
      ],
      correctAnswer: 0,
      explanation:
        'DNS (Domain Name System) resolves human-readable domain names into IP addresses that computers use to identify each other.',
      difficulty: 'Easy',
    },
    {
      id: 'cn5',
      question: 'What is the purpose of a subnet mask?',
      options: [
        'To encrypt IP packets',
        'To divide an IP address into network and host portions',
        'To speed up DNS lookups',
        'To assign MAC addresses',
      ],
      correctAnswer: 1,
      explanation:
        'A subnet mask separates the network portion of an IP address from the host portion, enabling subnetting.',
      difficulty: 'Hard',
    },
    {
      id: 'cn6',
      question: 'Which protocol is used to securely transfer web pages over an encrypted connection?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correctAnswer: 2,
      explanation:
        'HTTPS is HTTP layered over TLS/SSL, providing encrypted and secure communication between browser and server.',
      difficulty: 'Easy',
    },
  ],

  'Data Structures': [
    {
      id: 'ds1',
      question: 'Which data structure uses LIFO (Last In First Out) order?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1,
      explanation:
        'A Stack follows the Last In First Out (LIFO) principle — the last element added is the first one removed.',
      difficulty: 'Easy',
    },
    {
      id: 'ds2',
      question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      correctAnswer: 2,
      explanation:
        'In a balanced BST, each comparison eliminates roughly half of the remaining nodes, giving O(log n) search time.',
      difficulty: 'Medium',
    },
    {
      id: 'ds3',
      question: 'Which data structure is ideal for implementing a "Breadth-First Search" (BFS)?',
      options: ['Stack', 'Queue', 'Heap', 'Trie'],
      correctAnswer: 1,
      explanation:
        'BFS explores nodes level by level, which naturally maps to a Queue\'s FIFO (First In First Out) behavior.',
      difficulty: 'Medium',
    },
    {
      id: 'ds4',
      question: 'What is the worst-case time complexity of QuickSort?',
      options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'],
      correctAnswer: 2,
      explanation:
        'QuickSort has a worst-case time complexity of O(n^2), which occurs when the pivot selection is consistently poor (e.g., already sorted data with a naive pivot).',
      difficulty: 'Hard',
    },
    {
      id: 'ds5',
      question: 'What is a hash collision?',
      options: [
        'When two different keys map to the same hash bucket',
        'When a hash table runs out of memory',
        'When a key is deleted incorrectly',
        'When hashing takes too long',
      ],
      correctAnswer: 0,
      explanation:
        'A hash collision occurs when two distinct keys produce the same hash value, requiring a resolution strategy like chaining or open addressing.',
      difficulty: 'Hard',
    },
    {
      id: 'ds6',
      question: 'Which traversal visits nodes in the order: Left, Root, Right?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
      correctAnswer: 1,
      explanation:
        'Inorder traversal visits the left subtree, then the root, then the right subtree — and produces sorted order for a BST.',
      difficulty: 'Medium',
    },
  ],
};

export function getQuestionsForTopic(topic, count = 5) {
  const all = quizData[topic] || [];
  return all.slice(0, count);
}

/**
 * Pick questions adaptively based on a target difficulty distribution.
 * difficultyLevel: 'easy' | 'medium' | 'hard'
 */
export function getAdaptiveQuestions(topic, difficultyLevel = 'medium', count = 5) {
  const all = quizData[topic] || [];
  if (all.length === 0) return [];

  const order =
    difficultyLevel === 'easy'
      ? ['Easy', 'Easy', 'Medium', 'Easy', 'Medium']
      : difficultyLevel === 'hard'
      ? ['Hard', 'Medium', 'Hard', 'Hard', 'Medium']
      : ['Easy', 'Medium', 'Medium', 'Hard', 'Medium'];

  const pool = [...all];
  const selected = [];

  order.forEach((diff) => {
    const idx = pool.findIndex((q) => q.difficulty === diff);
    if (idx !== -1) {
      selected.push(pool[idx]);
      pool.splice(idx, 1);
    }
  });

  // Fill remaining slots with whatever is left
  while (selected.length < count && pool.length > 0) {
    selected.push(pool.shift());
  }

  return selected.slice(0, count);
}
