// src/services/aiService.js
// All Gemini API logic lives here. If VITE_GEMINI_API_KEY is missing
// or the request fails for any reason, we fall back to a local mock
// response generator so the app NEVER crashes or feels broken.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Mock knowledge base used when Gemini is unavailable.
 * Keyed by topic keyword -> level -> response sections.
 */
const MOCK_KNOWLEDGE_BASE = {
  dbms: {
    keywords: [
      'dbms',
      'database',
      'normalization',
      'sql',
      'normal form',
      'schema',
      'table',
      'primary key',
      'foreign key',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'A database is like a well-organized digital filing cabinet. DBMS (Database Management System) is the software that helps us store, organize, and retrieve that data easily. Normalization is the process of organizing data into tables so that we avoid repeating the same information over and over.',
        example:
          'Imagine a student records sheet where you write the student name every single time next to each subject. Normalization splits this into two tables — Students and Marks — connected by a Student ID, so the name is stored only once.',
        keyPoints: [
          'DBMS = software to manage data (like MySQL, PostgreSQL, Oracle).',
          'Normalization reduces data repetition (redundancy).',
          'Tables are linked using keys (Primary Key & Foreign Key).',
          'Normal forms (1NF, 2NF, 3NF) are steps/rules to organize data properly.',
        ],
        quickCheck:
          'Why do we split one big table into multiple smaller related tables?',
      },
      intermediate: {
        simpleExplanation:
          'Normalization is a systematic process of decomposing tables to eliminate data redundancy and avoid update/insertion/deletion anomalies. It is done in stages called Normal Forms (1NF, 2NF, 3NF, BCNF), each fixing a specific type of dependency issue.',
        example:
          'Consider a table storing Orders with columns: OrderID, ProductName, CustomerName, CustomerAddress. If a customer orders 3 products, their address repeats 3 times. In 3NF, we separate Customers and Orders into different tables linked by CustomerID, so the address is stored only once and stays consistent.',
        keyPoints: [
          '1NF: Eliminate repeating groups; ensure atomic column values.',
          '2NF: Remove partial dependency on a composite primary key.',
          '3NF: Remove transitive dependency (non-key depending on non-key).',
          'Goal: minimize redundancy while preserving data integrity.',
        ],
        quickCheck:
          'What type of dependency does moving from 2NF to 3NF eliminate?',
      },
      advanced: {
        simpleExplanation:
          'Normalization theory formalizes decomposition using functional dependencies (FDs) and closure sets to guarantee lossless-join and dependency-preserving decompositions. Beyond 3NF, Boyce-Codd Normal Form (BCNF) handles cases where every determinant must be a candidate key, even resolving anomalies 3NF misses.',
        example:
          'A table (Student, Course, Instructor) where Instructor -> Course (each instructor teaches only one course) but (Student, Course) is the candidate key creates an anomaly in 3NF because Instructor is not a superkey. BCNF decomposes this into (Instructor, Course) and (Student, Instructor) to remove the anomaly, verified via FD closure and lossless-join decomposition checks.',
        keyPoints: [
          'Functional Dependency (FD): X -> Y means X determines Y.',
          'BCNF requires every determinant to be a superkey.',
          'Decomposition must be lossless-join (verified via FD closures).',
          'Denormalization is sometimes intentionally used to optimize read-heavy performance.',
        ],
        quickCheck:
          'Why might BCNF decomposition sometimes fail to be dependency-preserving?',
      },
    },
  },

  react: {
    keywords: [
      'react',
      'jsx',
      'usestate',
      'useeffect',
      'hook',
      'component',
      'props',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'React is a JavaScript library used to build user interfaces using small reusable building blocks called "components". Instead of writing one giant HTML page, you build small pieces (like a Button or Card) and combine them.',
        example:
          'A "Greeting" component might just display "Hello, Sai!" — and you can reuse it anywhere, passing a different name each time using something called "props".',
        keyPoints: [
          'React apps are built using components.',
          'JSX lets you write HTML-like syntax inside JavaScript.',
          'Props pass data from parent to child components.',
          'State (useState) lets a component remember and update values.',
        ],
        quickCheck:
          'What is the difference between props and state in React?',
      },
      intermediate: {
        simpleExplanation:
          'React uses a virtual DOM to efficiently update the UI. Functional components combined with Hooks (useState, useEffect) let you manage state and side effects without writing class components.',
        example:
          'A search bar component uses useState to track the typed text, and useEffect to call an API whenever that text changes (with debouncing to avoid excessive calls).',
        keyPoints: [
          'Virtual DOM diffing minimizes real DOM updates for performance.',
          'useEffect handles side effects and cleanup (e.g., unsubscribing).',
          'Lifting state up shares state between sibling components.',
          'Context API avoids excessive prop drilling.',
        ],
        quickCheck:
          'When would you use the Context API instead of passing props?',
      },
      advanced: {
        simpleExplanation:
          'React\'s reconciliation algorithm uses fiber architecture to enable incremental rendering, prioritization, and concurrent features. Performance optimization involves memoization (React.memo, useMemo, useCallback), code-splitting, and understanding render commit phases.',
        example:
          'In a large dashboard with expensive charts, wrapping the chart component in React.memo and memoizing its computed data with useMemo prevents costly re-renders when unrelated parent state changes.',
        keyPoints: [
          'Fiber architecture enables interruptible, prioritized rendering.',
          'useMemo/useCallback prevent unnecessary recalculations and re-renders.',
          'Concurrent rendering allows React to prepare multiple UI versions.',
          'Custom hooks encapsulate and share complex stateful logic.',
        ],
        quickCheck:
          'How does React.memo differ from useMemo in what it optimizes?',
      },
    },
  },

  javascript: {
    keywords: [
      'javascript',
      'js',
      'closure',
      'promise',
      'async',
      'callback',
      'variable',
      'array',
      'function',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'JavaScript is the programming language that makes websites interactive. It lets you respond to clicks, update text on the page, and talk to servers to fetch data.',
        example:
          'When you click a "Like" button and the number increases instantly without reloading the page, that\'s JavaScript updating the page dynamically.',
        keyPoints: [
          'Variables store data (let, const, var).',
          'Functions are reusable blocks of code.',
          'JavaScript runs in the browser and can update the page live.',
          'Arrays and objects hold collections of data.',
        ],
        quickCheck:
          'What keyword would you use to declare a variable that should never change?',
      },
      intermediate: {
        simpleExplanation:
          'JavaScript is single-threaded but handles asynchronous operations using the event loop, callbacks, promises, and async/await. Closures allow functions to "remember" variables from where they were created.',
        example:
          'Fetching data from an API: `async function getData() { const res = await fetch(url); return res.json(); }` — the "await" pauses execution until the promise resolves, without blocking the whole browser.',
        keyPoints: [
          'Event loop manages async code execution order.',
          'Promises represent a value that will be available in the future.',
          'async/await is syntactic sugar over promises for cleaner code.',
          'Closures enable data privacy and function factories.',
        ],
        quickCheck:
          'What does the "await" keyword do inside an async function?',
      },
      advanced: {
        simpleExplanation:
          'Deep JavaScript understanding involves the execution context, call stack, microtask vs macrotask queues, prototypal inheritance, and memory management via garbage collection.',
        example:
          'Promise callbacks (.then) run in the microtask queue, which is always fully drained before the next macrotask (like setTimeout) — this is why `Promise.resolve().then()` runs before `setTimeout(fn, 0)`.',
        keyPoints: [
          'Microtasks (promises) have priority over macrotasks (setTimeout).',
          'Prototypal inheritance underlies JS object-oriented patterns.',
          'Closures can cause memory leaks if not managed carefully.',
          'The call stack + event loop + queues form the JS concurrency model.',
        ],
        quickCheck:
          'Why does a Promise.then() callback run before a setTimeout(fn, 0) callback?',
      },
    },
  },

  python: {
    keywords: [
      'python',
      'list',
      'dictionary',
      'def',
      'class',
      'gil',
      'pandas',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'Python is a beginner-friendly programming language known for its simple, readable syntax. It\'s widely used for web development, data science, automation, and AI.',
        example:
          'Printing "Hello World" in Python is just one line: `print("Hello World")` — no complex setup needed.',
        keyPoints: [
          'Python uses indentation instead of curly braces for blocks.',
          'Variables don\'t need explicit type declarations.',
          'Lists and dictionaries are common built-in data structures.',
          'Python has a huge ecosystem of libraries (NumPy, Pandas, Django).',
        ],
        quickCheck:
          'How does Python define the start and end of a code block?',
      },
      intermediate: {
        simpleExplanation:
          'Python supports object-oriented programming with classes, list/dict comprehensions for concise data transformations, and powerful built-in functions like map, filter, and zip.',
        example:
          'A list comprehension `[x**2 for x in range(10) if x % 2 == 0]` creates squares of even numbers from 0-9 in a single readable line.',
        keyPoints: [
          'Classes and objects model real-world entities.',
          'List/dict comprehensions replace verbose loops.',
          'Exception handling (try/except) manages runtime errors gracefully.',
          'Virtual environments isolate project dependencies.',
        ],
        quickCheck:
          'What is the advantage of using a list comprehension over a for loop?',
      },
      advanced: {
        simpleExplanation:
          'Advanced Python involves understanding the GIL\'s effect on multithreading, generators and iterators for memory-efficient processing, decorators for behavior modification, and metaclasses for class customization.',
        example:
          'Using a generator function with "yield" to process a huge file line-by-line without loading it entirely into memory: `def read_large_file(f):\\n    for line in f:\\n        yield line.strip()`',
        keyPoints: [
          'GIL limits true parallel CPU-bound threading (use multiprocessing instead).',
          'Generators enable lazy evaluation and reduce memory usage.',
          'Decorators wrap functions to add behavior without modifying their code.',
          'Async I/O (asyncio) enables high-concurrency I/O-bound applications.',
        ],
        quickCheck:
          'Why would you use multiprocessing instead of threading for a CPU-heavy task in Python?',
      },
    },
  },

  networks: {
    keywords: [
      'network',
      'tcp',
      'udp',
      'ip address',
      'osi',
      'dns',
      'http',
      'router',
      'protocol',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'Computer Networks is the study of how computers communicate with each other — like how your phone connects to the internet and loads a webpage.',
        example:
          'When you type a website address, your computer sends a request across the network to a server, which sends back the webpage data — similar to mailing a letter and getting a reply.',
        keyPoints: [
          'IP address = a unique address for a device on a network.',
          'DNS translates website names into IP addresses.',
          'Data travels in small units called packets.',
          'Routers direct traffic between networks.',
        ],
        quickCheck:
          'What does DNS do when you type a website name into your browser?',
      },
      intermediate: {
        simpleExplanation:
          'Networking is organized into layers (the OSI model), each handling a specific responsibility — from physical cables to application-level protocols like HTTP. TCP and UDP are the two main transport-layer protocols, differing in reliability vs speed.',
        example:
          'Video calls use UDP because losing a few frames is acceptable for speed, while file downloads use TCP because every byte must arrive correctly and in order.',
        keyPoints: [
          'OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
          'TCP = reliable, ordered, connection-oriented.',
          'UDP = fast, connectionless, no delivery guarantee.',
          'Routing determines the path packets take across networks.',
        ],
        quickCheck:
          'Why would a live video call prefer UDP over TCP?',
      },
      advanced: {
        simpleExplanation:
          'Advanced networking covers congestion control algorithms (TCP Reno, Cubic), subnetting/CIDR for efficient address allocation, and security protocols like TLS handshakes that establish encrypted channels.',
        example:
          'TCP\'s congestion control uses a "slow start" phase, exponentially increasing the congestion window until packet loss is detected, then backing off — balancing throughput and network fairness.',
        keyPoints: [
          'CIDR notation (e.g., /24) enables flexible subnetting beyond classful addressing.',
          'TLS handshake establishes a secure symmetric key via asymmetric cryptography.',
          'Congestion control algorithms prevent network collapse under high load.',
          'BGP is the protocol that routes traffic between autonomous systems on the internet.',
        ],
        quickCheck:
          'What problem does TCP\'s "slow start" mechanism solve?',
      },
    },
  },

  dataStructures: {
    keywords: [
      'data structure',
      'array',
      'stack',
      'queue',
      'tree',
      'linked list',
      'graph',
      'sorting',
      'algorithm',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'A data structure is a way of organizing and storing data so it can be used efficiently. Think of it like choosing the right container — a box, a shelf, or a queue line — depending on what you need to do with your items.',
        example:
          'A Stack is like a pile of plates — you can only add or remove from the top. A Queue is like a line at a ticket counter — first person in line is served first.',
        keyPoints: [
          'Arrays store items in continuous memory with index access.',
          'Stacks follow Last-In-First-Out (LIFO).',
          'Queues follow First-In-First-Out (FIFO).',
          'Linked Lists connect elements using pointers/references.',
        ],
        quickCheck:
          'Which is served first in a queue — the first person or the last person to join?',
      },
      intermediate: {
        simpleExplanation:
          'Trees and graphs model hierarchical and networked relationships. Binary Search Trees enable fast search/insert/delete when balanced, and traversal algorithms (BFS/DFS) explore these structures systematically.',
        example:
          'A file system is a tree — folders contain subfolders and files. Searching for a file uses DFS (going deep into folders) or BFS (checking each level before going deeper).',
        keyPoints: [
          'BST: left child < parent < right child (enables O(log n) search when balanced).',
          'BFS explores level-by-level using a Queue.',
          'DFS explores depth-first using a Stack (or recursion).',
          'Graphs can be represented via adjacency lists or matrices.',
        ],
        quickCheck:
          'Which traversal technique uses a Queue: BFS or DFS?',
      },
      advanced: {
        simpleExplanation:
          'Advanced data structures include self-balancing trees (AVL, Red-Black) that guarantee O(log n) operations, heaps for priority-based access, and hash tables with collision resolution strategies for near O(1) average lookups.',
        example:
          'A priority queue implemented as a Min-Heap efficiently powers Dijkstra\'s shortest path algorithm, always extracting the next-closest node in O(log n) time.',
        keyPoints: [
          'Red-Black/AVL trees maintain balance to guarantee O(log n) worst case.',
          'Heaps enable efficient priority queue operations (insert/extract-min in O(log n)).',
          'Hash table collisions are resolved via chaining or open addressing.',
          'Amortized analysis explains why operations like dynamic array resizing average out to O(1).',
        ],
        quickCheck:
          'Why does a Min-Heap make Dijkstra\'s algorithm more efficient?',
      },
    },
  },

  // ---------------------------------------------------------
  // NEW: DATA SCIENCE
  // ---------------------------------------------------------
  dataScience: {
    keywords: [
      'data science',
      'data scientist',
      'data analysis',
      'data analytics',
      'data visualization',
      'data cleaning',
      'data preprocessing',
      'dataset',
      'numpy',
      'matplotlib',
      'exploratory data analysis',
      'eda',
      'machine learning',
      'regression',
      'classification',
      'clustering',
    ],
    responses: {
      beginner: {
        simpleExplanation:
          'Data Science is the process of using data to find useful information, patterns, and insights. It combines programming, statistics, and data visualization to help us understand data and make better decisions.',
        example:
          'Imagine a college wants to know why some students get higher marks. A data scientist can collect students\' marks, attendance, study hours, and other information, analyze the data, and find patterns that may explain the results.',
        keyPoints: [
          'Data Science helps us find useful information from data.',
          'It uses programming, statistics, and visualization.',
          'Python is widely used in Data Science.',
          'Common tools include NumPy, Pandas, and Matplotlib.',
        ],
        quickCheck:
          'What is the main purpose of Data Science?',
      },

      intermediate: {
        simpleExplanation:
          'Data Science involves collecting, cleaning, analyzing, and visualizing data to discover patterns and support decision-making. It can also use machine learning models to make predictions from historical data.',
        example:
          'A company can analyze customer purchase data to predict which customers are likely to buy a new product. The data is first cleaned and explored, useful features are selected, and then a machine learning model can be trained.',
        keyPoints: [
          'Data cleaning removes errors and missing or inconsistent values.',
          'Exploratory Data Analysis (EDA) helps discover patterns and relationships.',
          'Data visualization makes trends easier to understand.',
          'Machine learning can be used for prediction and classification.',
        ],
        quickCheck:
          'Why is data cleaning important before analyzing a dataset?',
      },

      advanced: {
        simpleExplanation:
          'Advanced Data Science focuses on extracting reliable insights from complex datasets using statistical methods, feature engineering, machine learning, model evaluation, and optimization. The goal is to build models that generalize well to unseen data.',
        example:
          'For predicting house prices, a data scientist may clean the dataset, engineer features such as price per square foot, split the data into training and testing sets, train a regression model, and evaluate it using metrics such as MAE or RMSE.',
        keyPoints: [
          'Feature engineering can improve machine learning model performance.',
          'Training and testing data help evaluate model generalization.',
          'Regression predicts continuous values, while classification predicts categories.',
          'Model evaluation metrics help measure prediction quality.',
        ],
        quickCheck:
          'What is the difference between regression and classification?',
      },
    },
  },
};

const GENERIC_FALLBACK = {
  beginner: {
    simpleExplanation:
      'This is an interesting topic! While I don\'t have a specific pre-built explanation for this exact question, here\'s a general approach: break the concept into small parts, understand each part with a simple real-world comparison, then connect them together.',
    example:
      'For example, think of any technical concept as a recipe — you need to know the ingredients (basic building blocks) before you can understand the final dish (the full concept).',
    keyPoints: [
      'Start with the core definition of the concept.',
      'Look for a real-world analogy to make it relatable.',
      'Practice with small examples before tackling complex ones.',
      'Revisit the concept from different sources for a fuller picture.',
    ],
    quickCheck:
      'Can you explain this topic in your own words using a simple real-world example?',
  },

  intermediate: {
    simpleExplanation:
      'This topic likely connects multiple underlying concepts together. Try identifying the key mechanism at play, and how it interacts with related ideas you\'ve already learned.',
    example:
      'Consider how this concept might be used in a real project — what problem does it solve, and what would happen if it didn\'t exist?',
    keyPoints: [
      'Identify the core mechanism or process involved.',
      'Connect it to concepts you already understand.',
      'Think about trade-offs — why is this approach used over alternatives?',
      'Try applying it to a small practice problem.',
    ],
    quickCheck:
      'What problem does this concept solve, and what would happen without it?',
  },

  advanced: {
    simpleExplanation:
      'At an advanced level, this topic likely involves nuanced trade-offs, edge cases, and performance or design considerations that go beyond the basic definition.',
    example:
      'Try researching how this concept is used in production systems or research papers to understand its real-world complexity and constraints.',
    keyPoints: [
      'Consider edge cases and failure scenarios.',
      'Analyze performance/scalability trade-offs.',
      'Compare this concept with alternative approaches.',
      'Explore how it\'s applied in real-world, large-scale systems.',
    ],
    quickCheck:
      'What are the trade-offs of this approach compared to alternative solutions?',
  },
};

function findTopicMatch(question) {
  const lowerQuestion = question.toLowerCase();

  for (const key of Object.keys(MOCK_KNOWLEDGE_BASE)) {
    const entry = MOCK_KNOWLEDGE_BASE[key];

    if (entry.keywords.some((kw) => lowerQuestion.includes(kw))) {
      return entry;
    }
  }

  return null;
}

/**
 * Local mock AI response generator — used whenever the Gemini API
 * is unavailable, unconfigured, or fails.
 */
function getMockResponse(question, level = 'beginner') {
  const normalizedLevel = ['beginner', 'intermediate', 'advanced'].includes(
    level
  )
    ? level
    : 'beginner';

  const match = findTopicMatch(question);

  const content = match
    ? match.responses[normalizedLevel]
    : GENERIC_FALLBACK[normalizedLevel];

  return {
    ...content,
    source: 'mock',
  };
}

/**
 * Attempt to call the Gemini API. Throws on failure so the caller
 * can gracefully fall back to the mock system.
 */
async function callGeminiAPI(question, level) {
  const prompt = `You are an AI learning mentor for a student at "${level}" knowledge level.
A student asked: "${question}"

Respond ONLY with a valid JSON object (no markdown, no code fences) with EXACTLY these keys:
{
  "simpleExplanation": "a clear explanation suited to a ${level} level student",
  "example": "a practical or real-world example",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "quickCheck": "one short question to test understanding"
}`;

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Gemini API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini API returned an empty response');
  }

  const cleaned = rawText.replace(/```json|```/g, '').trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.simpleExplanation || !parsed.keyPoints) {
    throw new Error('Gemini API response missing required fields');
  }

  return {
    ...parsed,
    source: 'gemini',
  };
}

/**
 * Main entry point used by the UI. Always resolves successfully —
 * NEVER throws — falling back to the mock system on any failure.
 */
export async function askAI(question, level = 'beginner') {
  if (!question || !question.trim()) {
    return getMockResponse('general study help', level);
  }

  if (!GEMINI_API_KEY) {
    return getMockResponse(question, level);
  }

  try {
    return await callGeminiAPI(question, level);
  } catch (error) {
    console.warn(
      '[aiService] Gemini API unavailable, using mock response:',
      error.message
    );

    return getMockResponse(question, level);
  }
}

export function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY);
}