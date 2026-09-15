export const DEMO_PROJECT = {
  name: 'Student Management System',
  language: 'Java',
  files: 42,
  classes: 24,
  functions: 96,
  modules: 8,
  dependencies: 17,
  dbTables: 6,
  apiEndpoints: 10,
  loc: 12480,
  isDemo: true
};

export const RECENT_PROJECTS = [
  { id: '1', name: 'Student Management System', lang: 'Java', files: 42, modules: 8, status: 'Completed', date: '2026-09-10' },
  { id: '2', name: 'Library Management', lang: 'Python', files: 31, modules: 6, status: 'Completed', date: '2026-09-08' },
  { id: '3', name: 'Online Store', lang: 'JavaScript', files: 56, modules: 10, status: 'Completed', date: '2026-09-05' },
];

export const DASHBOARD_STATS = [
  { num: '42', label: 'Files Analyzed' },
  { num: '24', label: 'Classes Identified' },
  { num: '96', label: 'Functions Extracted' },
  { num: '8', label: 'Modules Detected' },
  { num: '17', label: 'Dependencies Found' },
  { num: '6', label: 'Database Tables' },
];

export const ANALYSIS_STEPS = [
  'Reading source files',
  'Detecting programming language',
  'Finding classes and functions',
  'Detecting modules',
  'Finding dependencies',
  'Analyzing database',
  'Recovering architecture',
  'Generating report'
];

export const FILE_TREE = {
  name: 'StudentManagement',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'controller',
          type: 'folder',
          children: [
            { name: 'StudentController.java', type: 'file' },
            { name: 'CourseController.java', type: 'file' },
          ]
        },
        {
          name: 'service',
          type: 'folder',
          children: [
            { name: 'StudentService.java', type: 'file' },
            { name: 'CourseService.java', type: 'file' },
          ]
        },
        {
          name: 'model',
          type: 'folder',
          children: [
            { name: 'Student.java', type: 'file' },
            { name: 'Course.java', type: 'file' },
          ]
        },
        {
          name: 'repository',
          type: 'folder',
          children: [
            { name: 'StudentRepository.java', type: 'file' },
          ]
        },
      ]
    },
    { name: 'database', type: 'folder', children: [] },
    { name: 'tests', type: 'folder', children: [] },
    { name: 'pom.xml', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]
};

export const FILE_META = {
  'StudentController.java': {
    type: 'Java Class',
    module: 'Student Management',
    loc: 210,
    classes: 1,
    functions: 6,
    dependencies: 'StudentService',
    imports: ['Student', 'StudentService', 'ResponseEntity', 'List', 'Autowired']
  },
  'CourseController.java': {
    type: 'Java Class',
    module: 'Course Management',
    loc: 180,
    classes: 1,
    functions: 5,
    dependencies: 'CourseService',
    imports: ['Course', 'CourseService', 'ResponseEntity', 'List']
  },
  'StudentService.java': {
    type: 'Java Class',
    module: 'Student Management',
    loc: 260,
    classes: 1,
    functions: 5,
    dependencies: 'StudentRepository',
    imports: ['Student', 'StudentRepository', 'List', 'Optional']
  },
  'CourseService.java': {
    type: 'Java Class',
    module: 'Course Management',
    loc: 230,
    classes: 1,
    functions: 7,
    dependencies: 'CourseRepository',
    imports: ['Course', 'CourseRepository', 'List']
  },
  'Student.java': {
    type: 'Java Model Entity',
    module: 'Student Management',
    loc: 95,
    classes: 1,
    functions: 4,
    dependencies: 'None',
    imports: ['Entity', 'Id', 'Table', 'Column']
  },
  'Course.java': {
    type: 'Java Model Entity',
    module: 'Course Management',
    loc: 80,
    classes: 1,
    functions: 4,
    dependencies: 'None',
    imports: ['Entity', 'Id', 'Table', 'Column']
  },
  'StudentRepository.java': {
    type: 'Java Interface (Spring Data)',
    module: 'Student Management',
    loc: 60,
    classes: 1,
    functions: 3,
    dependencies: 'Student',
    imports: ['Student', 'JpaRepository']
  },
  'pom.xml': {
    type: 'Maven Build Config',
    module: 'Build System',
    loc: 118,
    classes: 0,
    functions: 0,
    dependencies: 'spring-boot-starter-web, spring-boot-starter-data-jpa',
    imports: ['spring-boot-starter-web', 'spring-boot-starter-data-jpa', 'mysql-connector-j']
  },
  'README.md': {
    type: 'Documentation File',
    module: 'Documentation',
    loc: 40,
    classes: 0,
    functions: 0,
    dependencies: 'None',
    imports: []
  },
};

export const MODULES_DATA = [
  {
    name: 'Authentication',
    files: 5,
    classes: 4,
    functions: 15,
    desc: 'Handles user login, session validation, JWT generation, and role-based access control for student and admin users.',
    key: ['LoginController', 'AuthService', 'UserSession', 'PasswordEncoderUtil']
  },
  {
    name: 'Student Management',
    files: 8,
    classes: 6,
    functions: 25,
    desc: 'Manages student records, profile updates, enrollment tracking, and student demographic data.',
    key: ['StudentController', 'StudentService', 'StudentRepository', 'Student', 'StudentDTO', 'StudentValidator']
  },
  {
    name: 'Course Management',
    files: 6,
    classes: 4,
    functions: 18,
    desc: 'Handles course creation, syllabus updates, prerequisite checks, and course catalog listings.',
    key: ['CourseController', 'CourseService', 'CourseRepository', 'Course']
  },
  {
    name: 'Attendance',
    files: 5,
    classes: 3,
    functions: 12,
    desc: 'Tracks and records daily student attendance for each course session with report aggregations.',
    key: ['AttendanceController', 'AttendanceService', 'AttendanceRecord']
  },
  {
    name: 'Database',
    files: 6,
    classes: 4,
    functions: 14,
    desc: 'Manages database connections, JPA repository configurations, transactions, and schema migrations.',
    key: ['DatabaseConfig', 'ConnectionManager', 'MigrationRunner', 'QueryHelper']
  },
  {
    name: 'Reports',
    files: 4,
    classes: 3,
    functions: 12,
    desc: 'Generates academic transcripts, attendance summaries, and administrative PDF/CSV reports.',
    key: ['ReportGenerator', 'ReportController', 'ExportUtil']
  },
  {
    name: 'Security & API Gateway',
    files: 4,
    classes: 3,
    functions: 10,
    desc: 'Intercepts incoming HTTP traffic, enforces CORS, rate limiting, and authenticates requests.',
    key: ['SecurityConfig', 'JwtFilter', 'CorsRegistry']
  },
  {
    name: 'Notification Service',
    files: 4,
    classes: 3,
    functions: 10,
    desc: 'Dispatches automated email notifications and course alerts to enrolled students.',
    key: ['NotificationController', 'EmailService', 'TemplateEngine']
  }
];

export const DEPENDENCY_LAYERS = [
  { name: 'Frontend', desc: 'The presentation layer — views and pages users interact with.', meta: '4 files' },
  { name: 'Controller', desc: 'Receives incoming HTTP requests and routes them to services.', meta: '6 files · StudentController, CourseController' },
  { name: 'Service', desc: 'Contains core business logic and transaction management.', meta: '6 files · StudentService, CourseService' },
  { name: 'Repository', desc: 'Handles data access, JPA queries, and persistence.', meta: '4 files · StudentRepository, CourseRepository' },
  { name: 'Database', desc: 'Stores persistent relational application data.', meta: '6 tables' },
];

export const DOMAIN_FLOW_NODES = [
  { name: 'StudentController', desc: 'REST Controller receiving student API endpoints.' },
  { name: 'StudentService', desc: 'Business service applying validation and student logic.' },
  { name: 'StudentRepository', desc: 'Data Access Object extending JpaRepository.' },
  { name: 'Student Database', desc: 'Relational storage table: student.' },
];

export const ARCHITECTURE_LAYERS = [
  { title: 'USER', desc: 'Students, faculty members, and system administrators.' },
  { title: 'PRESENTATION LAYER', desc: 'UI views and API endpoints receiving incoming user actions.' },
  { title: 'CONTROLLER LAYER', desc: 'Receives REST requests, validates payloads, and routes actions.' },
  { title: 'SERVICE LAYER', desc: 'Applies domain business rules, authorization checks, and core calculations.' },
  { title: 'REPOSITORY LAYER', desc: 'Abstracts data access logic using Spring Data JPA Repositories.' },
  { title: 'DATABASE', desc: 'MySQL / PostgreSQL database storing persistent relational schemas.' },
];

export const DB_TABLES = [
  {
    name: 'Student',
    fields: [
      { name: 'student_id', isPk: true, type: 'BIGINT' },
      { name: 'name', isPk: false, type: 'VARCHAR(100)' },
      { name: 'email', isPk: false, type: 'VARCHAR(100)' },
      { name: 'department', isPk: false, type: 'VARCHAR(50)' },
    ]
  },
  {
    name: 'Course',
    fields: [
      { name: 'course_id', isPk: true, type: 'BIGINT' },
      { name: 'course_name', isPk: false, type: 'VARCHAR(100)' },
      { name: 'credits', isPk: false, type: 'INT' },
    ]
  },
  {
    name: 'Enrollment',
    fields: [
      { name: 'enrollment_id', isPk: true, type: 'BIGINT' },
      { name: 'student_id', isPk: false, type: 'BIGINT (FK)' },
      { name: 'course_id', isPk: false, type: 'BIGINT (FK)' },
    ]
  },
  {
    name: 'Attendance',
    fields: [
      { name: 'attendance_id', isPk: true, type: 'BIGINT' },
      { name: 'student_id', isPk: false, type: 'BIGINT (FK)' },
      { name: 'date', isPk: false, type: 'DATE' },
      { name: 'status', isPk: false, type: 'VARCHAR(20)' },
    ]
  },
  {
    name: 'Department',
    fields: [
      { name: 'dept_id', isPk: true, type: 'BIGINT' },
      { name: 'dept_name', isPk: false, type: 'VARCHAR(100)' },
      { name: 'code', isPk: false, type: 'VARCHAR(10)' },
    ]
  },
  {
    name: 'UserAccount',
    fields: [
      { name: 'user_id', isPk: true, type: 'BIGINT' },
      { name: 'username', isPk: false, type: 'VARCHAR(50)' },
      { name: 'role', isPk: false, type: 'VARCHAR(30)' },
    ]
  }
];

export const UML_CLASSES = [
  {
    name: 'Student',
    attributes: ['studentId: Long', 'name: String', 'email: String', 'department: String'],
    methods: ['+ login(): Boolean', '+ viewProfile(): StudentDTO']
  },
  {
    name: 'Course',
    attributes: ['courseId: Long', 'courseName: String', 'credits: Integer'],
    methods: ['+ addCourse(): void', '+ updateCourse(): Course']
  },
  {
    name: 'Enrollment',
    attributes: ['enrollmentId: Long', 'studentId: Long', 'courseId: Long'],
    methods: ['+ enroll(): void', '+ cancel(): Boolean']
  }
];
