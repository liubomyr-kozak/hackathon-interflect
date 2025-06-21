import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Topic {
  id: string;
  label: string;
  section: string;
  checked: boolean;
}

interface TopicsState {
  stack: 'react' | 'dotnet' | 'frontend';
  items: Topic[];
}

const reactTopics: Topic[] = [
  { id: 'r-jsx', label: 'JSX basics', section: 'JSX', checked: false },
  { id: 'r-hooks', label: 'useState / useEffect', section: 'React Core', checked: false },
  // …
];

const dotnetTopics: Topic[] = [
  // C# Basics (15 тем)
  { id: 'd-cs-basics-variables', label: 'Змінні та типи', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-operators', label: 'Оператори', section: 'C# Basics', checked: false },
  {
    id: 'd-cs-basics-control-flow',
    label: 'Умовні оператори та цикли',
    section: 'C# Basics',
    checked: false,
  },
  { id: 'd-cs-basics-methods', label: 'Методи', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-arrays', label: 'Масиви', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-strings', label: 'Робота зі рядками', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-collections', label: 'Колекції', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-nullables', label: 'Nullable типи', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-enums', label: 'Перелічення (enums)', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-structs', label: 'Структури', section: 'C# Basics', checked: false },
  {
    id: 'd-cs-basics-exceptions',
    label: 'Обробка виключень',
    section: 'C# Basics',
    checked: false,
  },
  { id: 'd-cs-basics-events', label: 'Події', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-delegates', label: 'Делегати', section: 'C# Basics', checked: false },
  { id: 'd-cs-basics-lambda', label: 'Lambda вирази', section: 'C# Basics', checked: false },
  {
    id: 'd-cs-basics-anonymous-types',
    label: 'Анонімні типи',
    section: 'C# Basics',
    checked: false,
  },

  // OOP (10 тем)
  { id: 'd-cs-oop-classes', label: 'Класи', section: 'OOP', checked: false },
  { id: 'd-cs-oop-inheritance', label: 'Наслідування', section: 'OOP', checked: false },
  { id: 'd-cs-oop-polymorphism', label: 'Поліморфізм', section: 'OOP', checked: false },
  { id: 'd-cs-oop-interfaces', label: 'Інтерфейси', section: 'OOP', checked: false },
  { id: 'd-cs-oop-abstract-classes', label: 'Абстрактні класи', section: 'OOP', checked: false },
  { id: 'd-cs-oop-properties', label: 'Властивості', section: 'OOP', checked: false },
  { id: 'd-cs-oop-indexers', label: 'Індексатори', section: 'OOP', checked: false },
  { id: 'd-cs-oop-constructors', label: 'Конструктори', section: 'OOP', checked: false },
  { id: 'd-cs-oop-destructors', label: 'Деструктори', section: 'OOP', checked: false },
  { id: 'd-cs-oop-events', label: 'Події та делегати', section: 'OOP', checked: false },

  // .NET Core (10 тем)
  {
    id: 'd-dotnet-core-architecture',
    label: '.NET Core архітектура',
    section: '.NET Core',
    checked: false,
  },
  {
    id: 'd-dotnet-core-dependency-injection',
    label: 'Dependency Injection',
    section: '.NET Core',
    checked: false,
  },
  {
    id: 'd-dotnet-core-configuration',
    label: 'Конфігурація',
    section: '.NET Core',
    checked: false,
  },
  { id: 'd-dotnet-core-middleware', label: 'Middleware', section: '.NET Core', checked: false },
  { id: 'd-dotnet-core-logging', label: 'Логування', section: '.NET Core', checked: false },
  {
    id: 'd-dotnet-core-entity-framework',
    label: 'Entity Framework Core',
    section: '.NET Core',
    checked: false,
  },
  {
    id: 'd-dotnet-core-migrations',
    label: 'Міграції бази даних',
    section: '.NET Core',
    checked: false,
  },
  { id: 'd-dotnet-core-webapi', label: 'Створення Web API', section: '.NET Core', checked: false },
  {
    id: 'd-dotnet-core-authentication',
    label: 'Аутентифікація та авторизація',
    section: '.NET Core',
    checked: false,
  },
  {
    id: 'd-dotnet-core-testing',
    label: 'Тестування .NET Core додатків',
    section: '.NET Core',
    checked: false,
  },

  // ASP.NET (10 тем)
  { id: 'd-aspnet-mvc', label: 'ASP.NET MVC', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-razor', label: 'Razor Pages', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-routing', label: 'Маршрутизація', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-filters', label: 'Фільтри', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-model-binding', label: 'Model Binding', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-validation', label: 'Валідація', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-viewcomponents', label: 'View Components', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-tag-helpers', label: 'Tag Helpers', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-signalr', label: 'SignalR', section: 'ASP.NET', checked: false },
  { id: 'd-aspnet-websockets', label: 'WebSockets', section: 'ASP.NET', checked: false },

  // Misc (5 тем)
  {
    id: 'd-dotnet-memory-management',
    label: "Управління пам'яттю",
    section: 'Misc',
    checked: false,
  },
  {
    id: 'd-dotnet-async-await',
    label: 'Асинхронне програмування',
    section: 'Misc',
    checked: false,
  },
  { id: 'd-dotnet-reflection', label: 'Reflection', section: 'Misc', checked: false },
  { id: 'd-dotnet-linq', label: 'LINQ basics', section: 'Misc', checked: false },
  { id: 'd-dotnet-testing', label: 'Unit Testing', section: 'Misc', checked: false },
];

const frontendTopics: Topic[] = [
  // HTML (20 тем)
  { id: 'f-html-basics', label: 'HTML форматування', section: 'HTML', checked: false },
  { id: 'f-html-semantics', label: 'Семантичні теги', section: 'HTML', checked: false },
  { id: 'f-html-forms', label: 'Форми та валідація', section: 'HTML', checked: false },
  { id: 'f-html-media', label: 'Медіа теги', section: 'HTML', checked: false },
  {
    id: 'f-html-accessibility',
    label: 'Доступність (Accessibility)',
    section: 'HTML',
    checked: false,
  },
  { id: 'f-html-meta', label: 'Meta теги', section: 'HTML', checked: false },
  { id: 'f-html-links', label: 'Гіперпосилання', section: 'HTML', checked: false },
  { id: 'f-html-tables', label: 'Таблиці', section: 'HTML', checked: false },
  { id: 'f-html-audio-video', label: 'Аудіо та відео', section: 'HTML', checked: false },
  { id: 'f-html-svg', label: 'SVG графіка', section: 'HTML', checked: false },
  { id: 'f-html-iframe', label: 'Iframe', section: 'HTML', checked: false },
  { id: 'f-html-headings', label: 'Заголовки', section: 'HTML', checked: false },
  { id: 'f-html-blocks', label: 'Блочні елементи', section: 'HTML', checked: false },
  { id: 'f-html-inline', label: 'Інлайн елементи', section: 'HTML', checked: false },
  { id: 'f-html-data-attributes', label: 'Data атрибути', section: 'HTML', checked: false },
  { id: 'f-html-forms-advanced', label: 'Просунуті форми', section: 'HTML', checked: false },
  { id: 'f-html-validation', label: 'HTML валідація', section: 'HTML', checked: false },
  { id: 'f-html-history', label: 'Історія HTML', section: 'HTML', checked: false },
  { id: 'f-html-doctype', label: 'DOCTYPE', section: 'HTML', checked: false },
  {
    id: 'f-html-custom-elements',
    label: 'Користувацькі елементи',
    section: 'HTML',
    checked: false,
  },

  // CSS (40 тем)
  { id: 'f-css-selectors', label: 'CSS селектори', section: 'CSS', checked: false },
  { id: 'f-css-flexbox', label: 'Flexbox', section: 'CSS', checked: false },
  { id: 'f-css-grid', label: 'CSS Grid', section: 'CSS', checked: false },
  { id: 'f-css-animations', label: 'CSS анімації', section: 'CSS', checked: false },
  { id: 'f-css-responsive', label: 'Responsive design', section: 'CSS', checked: false },
  { id: 'f-css-positioning', label: 'Позиціонування', section: 'CSS', checked: false },
  { id: 'f-css-media-queries', label: 'Media Queries', section: 'CSS', checked: false },
  { id: 'f-css-transitions', label: 'CSS переходи', section: 'CSS', checked: false },
  { id: 'f-css-pseudo-classes', label: 'Псевдо-класи', section: 'CSS', checked: false },
  { id: 'f-css-pseudo-elements', label: 'Псевдо-елементи', section: 'CSS', checked: false },
  { id: 'f-css-variables', label: 'CSS змінні', section: 'CSS', checked: false },
  { id: 'f-css-box-model', label: 'Box Model', section: 'CSS', checked: false },
  { id: 'f-css-specificity', label: 'Специфічність', section: 'CSS', checked: false },
  { id: 'f-css-shadows', label: 'Тіні', section: 'CSS', checked: false },
  { id: 'f-css-filters', label: 'Фільтри', section: 'CSS', checked: false },
  { id: 'f-css-text-styling', label: 'Текстові стилі', section: 'CSS', checked: false },
  { id: 'f-css-layouts', label: 'Розкладки', section: 'CSS', checked: false },
  { id: 'f-css-preprocessors', label: 'Препроцесори (Sass, Less)', section: 'CSS', checked: false },
  { id: 'f-css-inheritance', label: 'Наслідування', section: 'CSS', checked: false },
  { id: 'f-css-z-index', label: 'Z-index', section: 'CSS', checked: false },
  { id: 'f-css-calc', label: 'CSS calc()', section: 'CSS', checked: false },
  { id: 'f-css-shapes', label: 'CSS форми', section: 'CSS', checked: false },
  { id: 'f-css-scrollbars', label: 'Стилізація скролбарів', section: 'CSS', checked: false },
  { id: 'f-css-object-fit', label: 'object-fit / object-position', section: 'CSS', checked: false },
  { id: 'f-css-floats', label: 'Float', section: 'CSS', checked: false },
  { id: 'f-css-clear', label: 'Clear', section: 'CSS', checked: false },
  { id: 'f-css-grid-areas', label: 'Grid Areas', section: 'CSS', checked: false },
  { id: 'f-css-writing-modes', label: 'Writing Modes', section: 'CSS', checked: false },
  { id: 'f-css-media-types', label: 'Media Types', section: 'CSS', checked: false },
  { id: 'f-css-shorthand', label: 'Шорткати CSS', section: 'CSS', checked: false },
  { id: 'f-css-flex-grow', label: 'Flex Grow / Shrink', section: 'CSS', checked: false },
  { id: 'f-css-overflow', label: 'Overflow', section: 'CSS', checked: false },
  { id: 'f-css-opacity', label: 'Opacity', section: 'CSS', checked: false },
  { id: 'f-css-blend-modes', label: 'Blend Modes', section: 'CSS', checked: false },
  { id: 'f-css-cursors', label: 'Курсори', section: 'CSS', checked: false },
  { id: 'f-css-list-styles', label: 'Списки', section: 'CSS', checked: false },
  { id: 'f-css-box-shadow', label: 'Box Shadow', section: 'CSS', checked: false },
  { id: 'f-css-scroll-snap', label: 'Scroll Snap', section: 'CSS', checked: false },
  { id: 'f-css-sticky', label: 'Position Sticky', section: 'CSS', checked: false },

  // JS (50 тем)
  { id: 'f-js-variables', label: 'JS змінні та типи', section: 'JS', checked: false },
  { id: 'f-js-functions', label: 'Функції та замикання', section: 'JS', checked: false },
  { id: 'f-js-promises', label: 'Promises', section: 'JS', checked: false },
  { id: 'f-js-async-await', label: 'Async / Await', section: 'JS', checked: false },
  { id: 'f-js-objects', label: "Об'єкти", section: 'JS', checked: false },
  { id: 'f-js-arrays', label: 'Масиви', section: 'JS', checked: false },
  { id: 'f-js-dom-manipulation', label: 'Маніпуляція DOM', section: 'JS', checked: false },
  { id: 'f-js-events', label: 'Події', section: 'JS', checked: false },
  { id: 'f-js-event-loop', label: 'Event Loop', section: 'JS', checked: false },
  { id: 'f-js-hoisting', label: 'Hoisting', section: 'JS', checked: false },
  { id: 'f-js-classes', label: 'Класи', section: 'JS', checked: false },
  { id: 'f-js-inheritance', label: 'Наслідування', section: 'JS', checked: false },
  { id: 'f-js-this', label: 'Ключове слово this', section: 'JS', checked: false },
  { id: 'f-js-closures', label: 'Замикання', section: 'JS', checked: false },
  { id: 'f-js-modules', label: 'Модулі', section: 'JS', checked: false },
  { id: 'f-js-error-handling', label: 'Обробка помилок', section: 'JS', checked: false },
  { id: 'f-js-typescript-basics', label: 'TypeScript базово', section: 'JS', checked: false },
  { id: 'f-js-generators', label: 'Генератори', section: 'JS', checked: false },
  { id: 'f-js-iterators', label: 'Ітератори', section: 'JS', checked: false },
  { id: 'f-js-map-filter-reduce', label: 'Map, Filter, Reduce', section: 'JS', checked: false },
  { id: 'f-js-fetch-api', label: 'Fetch API', section: 'JS', checked: false },
  { id: 'f-js-websockets', label: 'WebSockets', section: 'JS', checked: false },
  {
    id: 'f-js-localstorage',
    label: 'LocalStorage / SessionStorage',
    section: 'JS',
    checked: false,
  },
  { id: 'f-js-decorators', label: 'Декоратори', section: 'JS', checked: false },
  { id: 'f-js-proxies', label: 'Proxy', section: 'JS', checked: false },
  { id: 'f-js-symbols', label: 'Symbols', section: 'JS', checked: false },
  { id: 'f-js-weakmap', label: 'WeakMap', section: 'JS', checked: false },
  { id: 'f-js-weakset', label: 'WeakSet', section: 'JS', checked: false },
  { id: 'f-js-memory-management', label: "Управління пам'яттю", section: 'JS', checked: false },
  { id: 'f-js-event-delegation', label: 'Event delegation', section: 'JS', checked: false },
  { id: 'f-js-call-apply-bind', label: 'Call, Apply, Bind', section: 'JS', checked: false },
  { id: 'f-js-strict-mode', label: 'Strict Mode', section: 'JS', checked: false },
  { id: 'f-js-json', label: 'JSON', section: 'JS', checked: false },
  { id: 'f-js-rest-spread', label: 'Rest / Spread', section: 'JS', checked: false },
  { id: 'f-js-template-literals', label: 'Template Literals', section: 'JS', checked: false },
  { id: 'f-js-arrow-functions', label: 'Arrow Functions', section: 'JS', checked: false },
  { id: 'f-js-event-loop-tasks', label: 'Tasks & Microtasks', section: 'JS', checked: false },
  { id: 'f-js-dom-events', label: 'DOM Events', section: 'JS', checked: false },
  { id: 'f-js-babel', label: 'Babel', section: 'JS', checked: false },
  { id: 'f-js-webpack', label: 'Webpack basics', section: 'JS', checked: false },
  { id: 'f-js-tree-shaking', label: 'Tree shaking', section: 'JS', checked: false },
  { id: 'f-js-service-workers', label: 'Service Workers', section: 'JS', checked: false },
  { id: 'f-js-pwa', label: 'Progressive Web Apps', section: 'JS', checked: false },
  {
    id: 'f-js-closures-practical',
    label: 'Практичне застосування замикань',
    section: 'JS',
    checked: false,
  },
  {
    id: 'f-js-debouncing-throttling',
    label: 'Debouncing & Throttling',
    section: 'JS',
    checked: false,
  },
  { id: 'f-js-event-bubbling', label: 'Event bubbling', section: 'JS', checked: false },

  // JSX (15 тем)
  { id: 'f-jsx-basics', label: 'JSX синтаксис', section: 'JSX', checked: false },
  { id: 'f-jsx-props', label: 'JSX Props', section: 'JSX', checked: false },
  { id: 'f-jsx-conditional', label: 'Умовний рендеринг', section: 'JSX', checked: false },
  { id: 'f-jsx-fragments', label: 'Fragments', section: 'JSX', checked: false },
  { id: 'f-jsx-lists', label: 'Списки', section: 'JSX', checked: false },
  { id: 'f-jsx-events', label: 'Події в JSX', section: 'JSX', checked: false },
  { id: 'f-jsx-styling', label: 'Стилізація в JSX', section: 'JSX', checked: false },
  { id: 'f-jsx-refs', label: 'Refs в JSX', section: 'JSX', checked: false },
  { id: 'f-jsx-children', label: 'Children', section: 'JSX', checked: false },
  { id: 'f-jsx-hooks', label: 'Hooks з JSX', section: 'JSX', checked: false },
  { id: 'f-jsx-portals', label: 'Portals', section: 'JSX', checked: false },
  { id: 'f-jsx-error-boundaries', label: 'Error Boundaries', section: 'JSX', checked: false },
  { id: 'f-jsx-typescript', label: 'JSX з TypeScript', section: 'JSX', checked: false },
  { id: 'f-jsx-testing', label: 'Тестування JSX', section: 'JSX', checked: false },
  { id: 'f-jsx-best-practices', label: 'Кращі практики JSX', section: 'JSX', checked: false },

  // CI/CD (10 тем)
  { id: 'f-ci-git', label: 'CI з GitHub Actions', section: 'CI/CD', checked: false },
  { id: 'f-ci-pipelines', label: 'CI/CD pipeline design', section: 'CI/CD', checked: false },
  { id: 'f-ci-jenkins', label: 'Jenkins basics', section: 'CI/CD', checked: false },
  { id: 'f-ci-travis', label: 'Travis CI', section: 'CI/CD', checked: false },
  { id: 'f-ci-circleci', label: 'CircleCI basics', section: 'CI/CD', checked: false },
  { id: 'f-ci-docker-integration', label: 'Docker in CI/CD', section: 'CI/CD', checked: false },
  { id: 'f-ci-monitoring', label: 'Моніторинг pipeline', section: 'CI/CD', checked: false },
  {
    id: 'f-ci-testing-automation',
    label: 'Автоматизація тестування',
    section: 'CI/CD',
    checked: false,
  },
  {
    id: 'f-ci-secrets-management',
    label: 'Управління секретами',
    section: 'CI/CD',
    checked: false,
  },
  { id: 'f-ci-deployment-strategies', label: 'Стратегії деплою', section: 'CI/CD', checked: false },

  // Docker (10 тем)
  { id: 'f-docker-images', label: 'Docker образи', section: 'Docker', checked: false },
  { id: 'f-docker-compose', label: 'docker-compose', section: 'Docker', checked: false },
  { id: 'f-docker-networking', label: 'Docker мережі', section: 'Docker', checked: false },
  { id: 'f-docker-volumes', label: 'Docker томи', section: 'Docker', checked: false },
  { id: 'f-dockerfiles', label: 'Dockerfile', section: 'Docker', checked: false },
  { id: 'f-docker-registry', label: 'Docker Registry', section: 'Docker', checked: false },
  { id: 'f-docker-security', label: 'Безпека Docker', section: 'Docker', checked: false },
  { id: 'f-docker-swarm', label: 'Docker Swarm', section: 'Docker', checked: false },
  {
    id: 'f-docker-best-practices',
    label: 'Кращі практики Docker',
    section: 'Docker',
    checked: false,
  },
  {
    id: 'f-docker-troubleshooting',
    label: 'Вирішення проблем Docker',
    section: 'Docker',
    checked: false,
  },

  // HTTP (10 тем)
  { id: 'f-http-http1', label: 'HTTP/1.1 протокол', section: 'HTTP', checked: false },
  { id: 'f-http-headers', label: 'HTTP headers', section: 'HTTP', checked: false },
  { id: 'f-https-tls', label: 'HTTPS / TLS', section: 'HTTP', checked: false },
  { id: 'f-http-caching', label: 'Кешування', section: 'HTTP', checked: false },
  { id: 'f-http-status-codes', label: 'Коди статусу', section: 'HTTP', checked: false },
  { id: 'f-http-cookies', label: 'Cookies', section: 'HTTP', checked: false },
  { id: 'f-http-authentication', label: 'Аутентифікація', section: 'HTTP', checked: false },
  { id: 'f-http2', label: 'HTTP/2', section: 'HTTP', checked: false },
  { id: 'f-http3', label: 'HTTP/3', section: 'HTTP', checked: false },
  { id: 'f-http-proxies', label: 'Проксі', section: 'HTTP', checked: false },

  // Інші секції (25 тем) - наприклад, Web Security, Performance, Tools, Testing
  { id: 'f-security-xss', label: 'XSS атаки', section: 'Web Security', checked: false },
  { id: 'f-security-csrf', label: 'CSRF атаки', section: 'Web Security', checked: false },
  {
    id: 'f-security-csp',
    label: 'Content Security Policy',
    section: 'Web Security',
    checked: false,
  },
  { id: 'f-security-https-only', label: 'HTTPS Only', section: 'Web Security', checked: false },
  {
    id: 'f-performance-optimization',
    label: 'Оптимізація продуктивності',
    section: 'Performance',
    checked: false,
  },
  {
    id: 'f-performance-lazy-loading',
    label: 'Ледаче завантаження',
    section: 'Performance',
    checked: false,
  },
  {
    id: 'f-performance-code-splitting',
    label: 'Code splitting',
    section: 'Performance',
    checked: false,
  },
  {
    id: 'f-performance-caching-strategies',
    label: 'Стратегії кешування',
    section: 'Performance',
    checked: false,
  },
  { id: 'f-testing-jest', label: 'Jest', section: 'Testing', checked: false },
  {
    id: 'f-testing-react-testing-library',
    label: 'React Testing Library',
    section: 'Testing',
    checked: false,
  },
  { id: 'f-testing-e2e', label: 'End to End Testing', section: 'Testing', checked: false },
  { id: 'f-testing-unit', label: 'Unit Testing', section: 'Testing', checked: false },
  { id: 'f-tools-eslint', label: 'ESLint', section: 'Tools', checked: false },
  { id: 'f-tools-prettier', label: 'Prettier', section: 'Tools', checked: false },
  { id: 'f-tools-storybook', label: 'Storybook', section: 'Tools', checked: false },
  { id: 'f-tools-webpack-advanced', label: 'Webpack Advanced', section: 'Tools', checked: false },
  { id: 'f-tools-babel', label: 'Babel', section: 'Tools', checked: false },
  { id: 'f-tools-npm', label: 'npm / Yarn', section: 'Tools', checked: false },
  { id: 'f-tools-docker-dev', label: 'Docker для розробки', section: 'Tools', checked: false },
  {
    id: 'f-other-progressive-web-apps',
    label: 'Progressive Web Apps',
    section: 'Other',
    checked: false,
  },
  { id: 'f-other-webassembly', label: 'WebAssembly', section: 'Other', checked: false },
  { id: 'f-other-service-workers', label: 'Service Workers', section: 'Other', checked: false },
  {
    id: 'f-other-accessibility',
    label: 'Доступність (Accessibility)',
    section: 'Other',
    checked: false,
  },
  {
    id: 'f-other-internationalization',
    label: 'Інтернаціоналізація',
    section: 'Other',
    checked: false,
  },
  { id: 'f-other-web-components', label: 'Web Components', section: 'Other', checked: false },
];

export const markTopicsFromML = createAsyncThunk<
  { id: string; checked: boolean }[],
  void,
  { state: { topics: TopicsState } }
>('topics/markFromML', async (_, thunkAPI) => {
  const state = thunkAPI.getState().topics;
  const sample = state.items.slice(0, 3).map(t => ({ id: t.id, checked: true }));
  return sample;
});

const topicsSlice = createSlice({
  name: 'topics',
  initialState: {
    stack: 'react',
    items: frontendTopics,
  } as TopicsState,
  reducers: {
    changeStack: (state, action: PayloadAction<'react' | 'dotnet' | 'frontend'>) => {
      state.stack = action.payload;
      state.items =
        action.payload === 'react'
          ? reactTopics
          : action.payload === 'dotnet'
            ? dotnetTopics
            : frontendTopics;
    },
    toggleTopic: (state, action: PayloadAction<string>) => {
      const t = state.items.find(item => item.id === action.payload);
      if (t) t.checked = !t.checked;
    },
  },
  extraReducers: builder => {
    builder.addCase(markTopicsFromML.fulfilled, (state, action) => {
      action.payload.forEach(u => {
        const t = state.items.find(item => item.id === u.id);
        if (t) t.checked = u.checked;
      });
    });
  },
});

export const { changeStack, toggleTopic } = topicsSlice.actions;
export default topicsSlice.reducer;
