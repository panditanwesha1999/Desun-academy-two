/* Blog content. Swap this file for a CMS / API feed later: same fields. Only post 1 has a full body; the rest show their excerpt. */
window.DESUN_POSTS=[
 {
  "id": 1,
  "title": "Essential API Best Practices for Beginners Learning Web Development",
  "date": "2026-11-19",
  "read": 6,
  "img": "api",
  "topic": "Web Development",
  "cat": "IT Job Insights",
  "excerpt": "Eleven plain-English habits that keep your first API calls clean, secure and easy to debug: methods, endpoints, JSON, status codes and CORS.",
  "cover": "api-cover.jpg",
  "hue": "#0369A1"
 },
 {
  "id": 2,
  "title": "Job-Oriented Courses in Kolkata: How to Choose a Course When You Are Unsure Which…",
  "date": "2026-11-17",
  "read": 8,
  "img": "career-path",
  "topic": "Career Development",
  "cat": "Career Development",
  "excerpt": "Not sure which course leads to a job? A practical way to compare options by outcome, projects and placement support, not by hype.",
  "cover": "career-path.jpg",
  "hue": "#0F7600"
 },
 {
  "id": 3,
  "title": "Trending Software Courses: What Should You Build After Training?",
  "date": "2026-11-04",
  "read": 6,
  "img": "trending",
  "topic": "Software Training",
  "cat": "Skill-based Learning",
  "excerpt": "The portfolio projects that actually get interview calls once your software course ends.",
  "cover": "trending.jpg",
  "hue": "#0D9488"
 },
 {
  "id": 4,
  "title": "Software Training Institute in Kolkata: When Impressive Projects Teach You…",
  "date": "2026-11-04",
  "read": 6,
  "img": "projects",
  "topic": "Software Training",
  "cat": "it institute",
  "excerpt": "Why a project that looks impressive only counts if it taught you something you can explain in an interview.",
  "cover": "projects.jpg",
  "hue": "#4F46E5"
 },
 {
  "id": 5,
  "title": "Social Media Marketing Courses in Kolkata That Go Beyond Content Creation",
  "date": "2026-10-29",
  "read": 6,
  "img": "dm",
  "topic": "Digital Marketing",
  "cat": "Digital Marketing Insights",
  "excerpt": "Strategy, analytics and paid campaigns: what a social media course should cover beyond posting.",
  "cover": "dm.jpg",
  "hue": "#EA580C"
 },
 {
  "id": 6,
  "title": "From Recruitment to HR Analytics: How Career-Oriented Courses in…",
  "date": "2026-10-28",
  "read": 6,
  "img": "hr",
  "topic": "HR",
  "cat": "Career Development",
  "excerpt": "How modern HR courses are moving from recruitment basics to people analytics and what that means for freshers.",
  "cover": "hr.jpg",
  "hue": "#0F7600"
 },
 {
  "id": 7,
  "title": "7 UI/UX Mistakes Beginners Make in a UI…",
  "date": "2026-10-28",
  "read": 6,
  "img": "uiux",
  "topic": "UI/UX Design",
  "cat": "UI/UX Design",
  "excerpt": "Common beginner mistakes in interface design and how to spot them in your own portfolio.",
  "cover": "uiux.jpg",
  "hue": "#C026D3"
 },
 {
  "id": 8,
  "title": "Digital Marketing Training and Placement: Why AI…",
  "date": "2026-09-24",
  "read": 6,
  "img": "ai-placement",
  "topic": "Digital Marketing",
  "cat": "AI in Software Development",
  "excerpt": "Why AI-assisted workflows are changing what recruiters expect from digital marketing freshers.",
  "cover": "ai-placement.jpg",
  "hue": "#7C3AED"
 },
 {
  "id": 9,
  "title": "Software Training Institute in Kolkata for…",
  "date": "2026-09-24",
  "read": 5,
  "img": "product",
  "topic": "Software Training",
  "cat": "it institute",
  "excerpt": "What to look for in a software training institute if you want to work on real product-style projects.",
  "cover": "product.jpg",
  "hue": "#4F46E5"
 },
 {
  "id": 10,
  "title": "Best Graphic Design Institute in Kolkata: How…",
  "date": "2026-09-23",
  "read": 6,
  "img": "graphic",
  "topic": "Graphic Design",
  "cat": "Graphic Design",
  "excerpt": "How to judge a graphic design institute by the portfolios its students leave with.",
  "cover": "graphic.jpg",
  "hue": "#DB2777"
 },
 {
  "id": 11,
  "title": "Best Training Institute in Kolkata for Turning Job…",
  "date": "2026-09-23",
  "read": 7,
  "img": "it-jobs",
  "topic": "IT Jobs",
  "cat": "IT Job Insights",
  "excerpt": "From training to offer letter: what separates institutes that convert learners into hires.",
  "cover": "it-jobs.jpg",
  "hue": "#0369A1"
 },
 {
  "id": 12,
  "title": "From Instagram Posts to Paid Campaigns: What…",
  "date": "2026-09-15",
  "read": 5,
  "img": "smm",
  "topic": "Digital Marketing",
  "cat": "Digital Marketing Insights",
  "excerpt": "The step from organic posting to paid campaigns, and the numbers you need to understand first.",
  "cover": "smm.jpg",
  "hue": "#EA580C"
 }
];
window.DESUN_BODY={1:{html:"\n<p>If you are learning web development, you will meet APIs sooner than you expect. A login form, a product list, a weather widget: almost every real page asks some server for data. The good news is that you do not need advanced backend knowledge to use APIs well. You need a handful of habits, practised early, so that they are second nature when your projects get bigger.</p>\n<p>This guide walks through what an API is, how a request travels, which HTTP methods matter and the habits that separate tidy beginner code from fragile code.</p>\n\n<h2 id=\"understand\">What should beginners understand about APIs first?</h2>\n<p>An API (Application Programming Interface) is an agreed way for one piece of software to ask another for something. Your front end is the client. The server holds the data and the rules. The API is the menu: it lists what you can ask for and in what format the answer will come back.</p>\n<p>You do not need to know how the server is built. You only need to know what to ask, how to ask it and what the answer looks like.</p>\n\n<h2 id=\"cycle\">How does the request and response cycle work?</h2>\n<p>Every API call follows the same loop, whether it fetches a weather report or saves an order.</p>\n<figure><img src=\"assets/img/blog/api-flow.jpg\" alt=\"Diagram of the request and response cycle between client, server and database\" loading=\"lazy\"><figcaption>The loop: client, request, server, database, response, page.</figcaption></figure>\n<ol>\n<li><b>Client</b>: your page or app decides it needs data.</li>\n<li><b>Request</b>: it sends a request to an endpoint (a URL) with a method, optional headers and sometimes a body.</li>\n<li><b>Server</b>: checks the request and applies its rules.</li>\n<li><b>Database</b>: the server reads or writes the data it needs.</li>\n<li><b>Response (JSON)</b>: the server answers with a status code and, usually, JSON data your page then shows.</li>\n</ol>\n<p>Four words to remember: <b>endpoint</b> (where), <b>headers</b> (extra information such as the data format or a key), <b>body</b> (the data you send) and <b>response</b> (what comes back).</p>\n\n<h2 id=\"methods\">Which HTTP methods should you know?</h2>\n<figure><img src=\"assets/img/blog/api-http.jpg\" alt=\"Table of common HTTP methods\" loading=\"lazy\"></figure>\n<ul>\n<li><b>GET</b>: read data. It should never change anything.</li>\n<li><b>POST</b>: create something new, such as a new user or order.</li>\n<li><b>PUT or PATCH</b>: update existing data. PUT replaces it, PATCH changes part of it.</li>\n<li><b>DELETE</b>: remove data.</li>\n</ul>\n<p>The MDN Web Docs have a clear reference on each method if you want the full detail.</p>\n\n<h2 id=\"practices\">Essential API best practices every beginner should follow</h2>\n<h3 id=\"p1\">1. Choose the right HTTP method</h3>\n<p>Use GET to read and POST to create. A common beginner mistake is sending everything as POST because it seems to work. It works until someone else has to maintain it.</p>\n<h3 id=\"p2\">2. Keep endpoints simple</h3>\n<p>Name endpoints after things, not actions: <code>/products</code> for the list and <code>/products/12</code> for one item. The method already says what you are doing, so the URL does not need to.</p>\n<h3 id=\"p3\">3. Understand JSON and handle responses properly</h3>\n<p>Most APIs speak JSON. Parse it, check that the fields you expect exist, and decide what your page shows if they do not. Never assume the data arrives in perfect shape.</p>\n<h3 id=\"p4\">4. Write clean requests with fetch and async/await</h3>\n<p>Modern JavaScript makes requests readable. <code>fetch</code> with <code>async/await</code> reads top to bottom like normal code, and a single <code>try/catch</code> around it handles failures in one place.</p>\n<h3 id=\"p5\">5. Check status codes and handle errors</h3>\n<p>The status code tells you what happened before you read a single field of data.</p>\n<ul>\n<li><b>200</b> OK and <b>201</b> Created: success.</li>\n<li><b>400</b> Bad request: something in your request was wrong.</li>\n<li><b>401</b> and <b>403</b>: you are not logged in, or not allowed.</li>\n<li><b>404</b> Not found: the thing you asked for does not exist.</li>\n<li><b>500</b> Server error: not your fault, but your page should still cope.</li>\n</ul>\n<p>Show users a friendly message, such as &ldquo;We could not load your orders. Please try again,&rdquo; instead of a blank screen or a raw error.</p>\n<h3 id=\"p6\">6. Keep API keys and credentials secure</h3>\n<figure><img src=\"assets/img/blog/api-keys.jpg\" alt=\"Keeping API keys out of front-end code\" loading=\"lazy\"></figure>\n<p>Never paste a secret key into front-end code or a public repository: anyone can read it. Keep keys on the server or in environment variables, and rotate a key immediately if it leaks.</p>\n<h3 id=\"p7\">7. Read the documentation and test before you integrate</h3>\n<p>Spend ten minutes in the docs and test the call in a tool such as Postman, or watch it in your browser&rsquo;s Network tab, before you write any page code around it. You will find out what the data really looks like.</p>\n<h3 id=\"p8\">8. Understand basic CORS restrictions</h3>\n<figure><img src=\"assets/img/blog/api-cors.jpg\" alt=\"CORS explained: browser blocks requests from other origins unless the server allows them\" loading=\"lazy\"></figure>\n<p>If your request works in Postman but fails in the browser with a CORS error, the server has not allowed your page&rsquo;s origin. That is a server setting, not a bug in your fetch code. Knowing this saves hours of confusion.</p>\n\n<h2 id=\"real\">How to apply API best practices in real projects</h2>\n<p>Once the habits are familiar, use them where they matter: connecting a front end to your own backend, and using third-party APIs such as weather, maps, payments and authentication. Third-party APIs teach you the most because you have to read someone else&rsquo;s documentation.</p>\n<table><thead><tr><th>Beginner project</th><th>Skills it builds</th></tr></thead><tbody>\n<tr><td>Weather dashboard</td><td>GET requests, JSON parsing, error states, API keys</td></tr>\n<tr><td>Product catalogue</td><td>Lists and single items, clean endpoints, loading states</td></tr>\n<tr><td>Basic CRUD application</td><td>GET, POST, PUT/PATCH, DELETE and status codes together</td></tr>\n</tbody></table>\n\n<h2 id=\"mistakes\">Common API mistakes beginners should avoid</h2>\n<ul>\n<li>Using the wrong HTTP method because it &ldquo;still works&rdquo;.</li>\n<li>Ignoring the status code and reading data from a failed response.</li>\n<li>Putting API keys directly in front-end code.</li>\n<li>Skipping the documentation and guessing field names.</li>\n<li>Showing raw errors, or nothing at all, when a call fails.</li>\n<li>Making the same request again and again instead of reusing the result.</li>\n</ul>\n\n<h2 id=\"course\">Learning API integration through a web development course in Kolkata</h2>\n<p>Reading about APIs helps, but the habits stick when you build with them. A good web development course should teach fundamentals first, then make you use them in practical projects until the request, the response and the error case feel routine.</p>\n<p>If you want that kind of guided practice, Desun Academy&rsquo;s Web Design &amp; Front-End Development course with AI covers API integration inside live projects, with mentors reviewing your work.</p>\n\n<h2 id=\"faq\">Frequently asked questions</h2>\n",faqs:[["What are the most important API skills for beginners?", "Choosing the right HTTP method, reading JSON, using fetch with async/await, checking status codes and keeping keys secure. Those five cover most everyday work."], ["Do I need backend knowledge to use APIs?", "No. You can use APIs from the front end without writing a server. Learning backend basics later helps you understand why APIs behave the way they do."], ["How can I practise API skills?", "Build small projects: a weather dashboard, a product catalogue and a basic CRUD app. Each one adds a new habit from this guide."], ["Which tools can I use to test APIs?", "Postman is the most common. Your browser’s Network tab is free and shows exactly what your page sends and receives."]],tags:["API Best Practices", "Front-end JavaScript", "web development course in Kolkata"]}};
