import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- Helper Components & Icons ---
// Using inline SVGs for icons as per single-file requirement.
const icons = {
  upload: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>,
  link: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>,
  arrowRight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  target: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-goal"><path d="M12 13V2l8 4-8 4"/><path d="M12 22v-8"/><path d="M20 12v8l-8 4-8-4v-8"/><path d="M4 12l8-4 8 4"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>,
  brain: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A3 3 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A3 3 0 1 1 12 18Z"/><path d="M12 12v6"/><path d="M12 2v3"/><path d="M12 9a3 3 0 0 0-3 3"/><path d="M12 15a3 3 0 0 1 3-3"/><path d="m15 12-3-3"/><path d="m11.5 14.5-3-3"/><path d="m12.5 9.5 3 3"/><path d="M9 12a3 3 0 0 1 3 3"/><path d="M6.003 5.125A3 3 0 0 1 9 5"/><path d="M17.997 5.125A3 3 0 0 0 15 5"/><path d="M6.003 18.875A3 3 0 0 0 9 19"/><path d="M17.997 18.875A3 3 0 0 1 15 19"/></svg>,
  bot: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  send: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  book: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-marked"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m14 14-4-4 4-4"/></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  video: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 2 12 2s9.5 4 9.5 5a24.12 24.12 0 0 1 0 10c0 1-5 5-9.5 5s-9.5-4-9.5-5Z"/><path d="m10 8 6 4-6 4Z"/></svg>,
  article: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  docs: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  tutorial: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer-square"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/></svg>,
  blog: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>,
  menu: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  compass: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
};


// --- Main Application Component ---
export default function App() {
    const [page, setPage] = useState('landing'); // 'landing', 'comparison', 'roadmap', 'study'
    const [userResume, setUserResume] = useState(null);
    const [targetProfile, setTargetProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPersonalityTest, setShowPersonalityTest] = useState(false);
    const [futureSelfPersona, setFutureSelfPersona] = useState('Your Future Self');
    const [comparisonData, setComparisonData] = useState(null);
    const [roadmapData, setRoadmapData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // MOCK API: Generates resume comparison data
    const getMockApiAnalysis = () => {
        return [
            {
                sectionName: "Education",
                comparisons: [{ id: 'edu_cgpa', name: "CGPA", user: { details: "7.0" }, target: { details: "9.5/10.0" }, analysis: "Area for Improvement: Focus on improving your CGPA. If not possible, compensate with exceptional project and internship experiences.", path: "Prioritize coursework and seek academic help if needed. Complement your GPA with strong, practical projects." }, { id: 'edu_coursework', name: "Relevant Coursework", user: null, target: { details: "Data Structures & Algorithms, System Design, Operating Systems, etc." }, analysis: "Missing Section: You should add a 'Relevant Coursework' section to your resume to showcase foundational knowledge.", path: "Add a 'Relevant Coursework' section to your resume. List key courses like DS & Algo, OS, DBMS, and Computer Networks." }]
            },
            {
                sectionName: "Skills - Programming Languages",
                comparisons: [{ id: 'lang_cpp', name: "C++", user: { level: "Listed" }, target: { level: "Expert" }, analysis: "Gap in proficiency.", path: "Move from basic knowledge to advanced topics like C++17 features, multithreading, and memory management." }, { id: 'lang_go', name: "Go", user: null, target: { level: "Advanced" }, analysis: "Missing language. It's heavily used in the target's projects for backend services.", path: "Start from zero. Follow the official 'A Tour of Go' and build a simple REST API." }, { id: 'lang_python', name: "Python", user: { level: "Listed" }, target: { level: "Proficient" }, analysis: "Gap in practical application.", path: "Go beyond syntax. Build complex applications or scripts, and learn major libraries (like FastAPI, used in a target project)." }, { id: 'lang_rust', name: "Rust", user: null, target: { level: "Intermediate" }, analysis: "Missing modern systems language.", path: "Start from zero. Learning Rust shows initiative and understanding of memory safety." }, { id: 'lang_js_ts', name: "JavaScript/TypeScript", user: { level: "Used in a project" }, target: { level: "Proficient" }, analysis: "Not formally listed as a skill.", path: "Formally add JavaScript to your skills section and begin learning TypeScript, as it is the industry standard." }]
            },
            {
                sectionName: "Skills - Core CS Concepts",
                comparisons: [{ id: 'core_ds_algo', name: "Data Structures & Algorithms", user: null, target: { level: "Deep Knowledge" }, analysis: "Critical Missing Section: Target has proven knowledge through competitive programming.", path: "Start with intensive practice on platforms like LeetCode. Aim to solve 1-2 problems daily." }, { id: 'core_sys_design', name: "System Design", user: null, target: { level: "Proficient" }, analysis: "Critical Missing Section.", path: "Start from zero. Study common patterns (load balancing, caching, databases) and practice with case studies from resources like 'Grokking the System Design Interview'." }, { id: 'core_dist_computing', name: "Distributed Computing, Concurrency & Multithreading", user: null, target: { level: "Proficient" }, analysis: "Critical Missing Section for advanced roles.", path: "Start from zero. These are advanced topics. Try building a project that requires handling multiple processes or threads safely, e.g., a multi-threaded web crawler." }]
            },
        ];
    }
    
    // MOCK API: Generates the detailed, Notion-style roadmap data
    const getMockRoadmapData = () => {
        return {
          "roadmaps": [
            {
              "skill": "C++",
              "phases": [
                {
                  "phase_name": "Phase 1: The Foundation (Beginner)",
                  "subjects": [
                    { "subject_name": "C++ Basics", "topics": [ { "topic_name": "Introduction to C++: History, 'Hello World,' compilation process, basic syntax.", "resources": [ { "type": "Video", "title": "C++ Tutorial for Beginners - freeCodeCamp", "url": "https://www.youtube.com/watch?v=vLnPwxZdW4Y" }, { "type": "Article", "title": "C++ Introduction - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/c-plus-plus/" }, {"type": "Blog", "title": "C++ Basics - learncpp.com", "url": "https://www.learncpp.com/cpp-tutorial/introduction-to-c-programming/"} ] }, { "topic_name": "Variables, Data Types, and Operators", "resources": [ { "type": "Video", "title": "Variables and Data Types in C++ - CodeBeauty", "url": "https://www.youtube.com/watch?v=i_nC-22Pazc" }, { "type": "Blog", "title": "C++ Data Types - Programiz", "url": "https://www.programiz.com/cpp-programming/data-types" }, {"type": "Interactive Tutorial", "title": "C++ Variables - W3Schools", "url": "https://www.w3schools.com/cpp/cpp_variables.asp"} ] }, { "topic_name": "Control Flow: if-else, switch, for, while loops.", "resources": [ { "type": "Video", "title": "Control Structures in C++ - The Cherno", "url": "https://www.youtube.com/watch?v=__WHPUh_dJg" }, { "type": "Article", "title": "C++ Control Flow - learncpp.com", "url": "https://www.learncpp.com/cpp-tutorial/introduction-to-if-else-statements/" }, {"type": "Blog", "title": "C++ if...else and Loops - Programiz", "url": "https://www.programiz.com/cpp-programming/if-else"} ] } ] },
                    { "subject_name": "Object-Oriented Programming (OOP) in C++", "topics": [ { "topic_name": "Classes and Objects", "resources": [ { "type": "Video", "title": "Classes and Objects in C++ - The Cherno", "url": "https://www.youtube.com/watch?v=2nczG3f2-1s" }, { "type": "Blog", "title": "C++ Classes and Objects - Tutorialspoint", "url": "https://www.tutorialspoint.com/cplusplus/cpp_classes_objects.htm" }, { "type": "Article", "title": "C++ Classes and Objects - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/c-classes-and-objects/" } ] }, { "topic_name": "The Four Pillars of OOP", "resources": [ { "type": "Video", "title": "OOP in C++ - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=EE-xtCF3T94" }, { "type": "Article", "title": "OOP in C++ - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/" }, {"type": "Blog", "title": "Understanding the Pillars of OOP - Medium", "url": "https://medium.com/@hamzzza.ahmed95/the-4-pillars-of-object-oriented-programming-ddd18fbb8964"} ] } ] }
                  ]
                },
                { "phase_name": "Phase 2: Deepening Knowledge (Intermediate)", "subjects": [ { "subject_name": "Advanced C++ Concepts", "topics": [ { "topic_name": "Pointers and Memory Management", "resources": [ { "type": "Video", "title": "Pointers in C++ - The Cherno", "url": "https://www.youtube.com/watch?v=i_wE1U5g5fA" }, { "type": "Article", "title": "C++ Pointers - learncpp.com", "url": "https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/" }, {"type": "Blog", "title": "A Guide to C++ Pointers - freeCodeCamp", "url": "https://www.freecodecamp.org/news/a-beginners-guide-to-pointers-in-c/"} ] }, { "topic_name": "Standard Template Library (STL)", "resources": [ { "type": "Video", "title": "The C++ STL - The Cherno", "url": "https://www.youtube.com/watch?v=2eQl-5T-d-c" }, { "type": "Blog", "title": "C++ STL - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/the-c-standard-template-library-stl/" }, {"type": "Interactive Tutorial", "title": "C++ STL - HackerEarth", "url": "https://www.hackerearth.com/practice/notes/standard-template-library/"} ] } ] } ] },
                { "phase_name": "Phase 3: Mastery (Advanced)", "subjects": [ { "subject_name": "High-Performance C++", "topics": [ { "topic_name": "Concurrency and Multithreading", "resources": [ { "type": "Video", "title": "Multithreading in C++ - The Cherno", "url": "https://www.youtube.com/watch?v=wXBzB402-4A" }, { "type": "Blog", "title": "C++ Multithreading - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/multithreading-in-cpp/" }, {"type": "Article", "title": "Concurrency in C++ - docs.microsoft.com", "url": "https://docs.microsoft.com/en-us/cpp/parallel/concrt/concurrency-runtime-cpp"} ] }, { "topic_name": "Performance Optimization", "resources": [ { "type": "Video", "title": "Optimizing C++ - CppCon", "url": "https://www.youtube.com/watch?v=eh6oxN3K8f4" }, {"type": "Blog", "title": "C++ Performance Tuning - Medium", "url": "https://medium.com/swlh/c-performance-tuning-tricks-5e45a0349970"} ] } ] } ] }
              ]
            },
            {
              "skill": "Go (Golang)",
              "phases": [
                 { "phase_name": "Phase 1: The Basics (Beginner)", "subjects": [ { "subject_name": "Go Fundamentals", "topics": [ { "topic_name": "Getting Started: Installation, GOPATH, 'Hello World'", "resources": [ { "type": "Video", "title": "Go Tutorial for Beginners - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=YS4e4q9oEdb" }, { "type": "Official Docs", "title": "A Tour of Go", "url": "https://go.dev/tour/welcome/1" }, {"type": "Blog", "title": "Setting up Go - golang.org", "url": "https://golang.org/doc/install"} ] }, { "topic_name": "Packages, Variables, and Functions", "resources": [ { "type": "Video", "title": "Go Programming - A Step by Step Guide - Tech With Tim", "url": "https://www.youtube.com/watch?v=22s15xfaYso" }, { "type": "Article", "title": "Go by Example: Variables", "url": "https://gobyexample.com/variables" }, {"type": "Interactive Tutorial", "title": "Go by Example", "url": "https://gobyexample.com/"} ] } ] } ] },
                 { "phase_name": "Phase 2: Building Blocks (Intermediate)", "subjects": [ { "subject_name": "Concurrency in Go", "topics": [ { "topic_name": "Goroutines", "resources": [ { "type": "Video", "title": "Go Goroutines Explained - Jake Wright", "url": "https://www.youtube.com/watch?v=LvgVSSpwND8" }, {"type": "Blog", "title": "Diving Deep into Goroutines - Medium", "url": "https://medium.com/@ashish_b_s/diving-deep-into-go-lang-goroutines-234bc7d1c2e"} ] }, { "topic_name": "Channels", "resources": [ { "type": "Video", "title": "Go Channels Explained - Jake Wright", "url": "https://www.youtube.com/watch?v=LFHsdofD4oE" }, {"type": "Article", "title": "Go Channels Explained - golangbot.com", "url": "https://golangbot.com/channels/"} ] } ] }, { "subject_name": "Building Applications", "topics": [ { "topic_name": "Creating a Simple Web Server", "resources": [ { "type": "Article", "title": "Writing a simple web application in Go", "url": "https://golang.org/doc/articles/wiki/" }, {"type": "Video", "title": "Build a REST API with Go - freeCodeCamp", "url": "https://www.youtube.com/watch?v=d_L64g6jC7w"} ] }, { "topic_name": "Testing in Go", "resources": [ { "type": "Official Docs", "title": "Testing - The Go Programming Language", "url": "https://golang.org/pkg/testing/" }, {"type": "Blog", "title": "Effective Testing in Go - Dave Cheney", "url": "https://dave.cheney.net/2019/05/07/prefer-table-driven-tests"} ] } ] } ] }
              ]
            },
            {
                "skill": "Python",
                "phases": [
                    { "phase_name": "Phase 1: Python Fundamentals", "subjects": [ { "subject_name": "Core Python", "topics": [ { "topic_name": "Syntax, Data Types, and Control Flow", "resources": [ { "type": "Video", "title": "Python for Beginners - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=rfscVS0vtbw" }, {"type": "Blog", "title": "Python Basics on Real Python", "url": "https://realpython.com/python-first-steps/"} ] }, { "topic_name": "Data Structures: Lists, tuples, dictionaries, sets.", "resources": [ { "type": "Blog", "title": "Data Structures in Python - Real Python", "url": "https://realpython.com/python-data-structures/" }, {"type": "Video", "title": "Python Data Structures - CS Dojo", "url": "https://www.youtube.com/watch?v=R-HLU9A50aA"} ] }, { "topic_name": "Functions and OOP", "resources": [ { "type": "Video", "title": "OOP in Python - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=Ej_02QuJSg4" }, {"type": "Article", "title": "OOP in Python - Real Python", "url": "https://realpython.com/python3-object-oriented-programming/"} ] } ] } ] },
                    { "phase_name": "Phase 2: Real-World Applications", "subjects": [ { "subject_name": "Web Development", "topics": [ { "topic_name": "Learning FastAPI", "resources": [ { "type": "Video", "title": "FastAPI Course - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=7t2alSnE2-I" }, { "type": "Official Docs", "title": "FastAPI Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/" }, {"type": "Blog", "title": "Building APIs with FastAPI - Medium", "url": "https://medium.com/data-science-group-iitr/building-apis-with-fastapi-49b01518b0c8"} ] } ] }, { "subject_name": "Advanced Python", "topics": [ { "topic_name": "Decorators, Generators, Context Managers", "resources": [ { "type": "Blog", "title": "Primer on Python Decorators - Real Python", "url": "https://realpython.com/primer-on-python-decorators/" }, {"type": "Video", "title": "Advanced Python Concepts - freeCodeCamp", "url": "https://www.youtube.com/watch?v=0-S78-4s7jY"} ] } ] } ] }
                ]
            },
            {
                "skill": "Rust",
                "phases": [
                    { "phase_name": "Phase 1: Rust Fundamentals", "subjects": [ { "subject_name": "Core Concepts", "topics": [ { "topic_name": "Installation and 'Hello, World!'", "resources": [ { "type": "Official Docs", "title": "The Rust Programming Language Book", "url": "https://doc.rust-lang.org/book/ch01-01-installation.html" }, {"type": "Video", "title": "Rust in 100 Seconds - Fireship", "url": "https://www.youtube.com/watch?v=5C_HPTJg5ek"} ] }, { "topic_name": "Variables, Data Types, and Functions", "resources": [ { "type": "Video", "title": "Rust Crash Course - Traversy Media", "url": "https://www.youtube.com/watch?v=zF34dRivLOw" }, {"type": "Official Docs", "title": "The Rust Book - Variables", "url": "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html"} ] }, { "topic_name": "Ownership, Borrowing, and Lifetimes", "resources": [ { "type": "Article", "title": "Understanding Ownership in Rust", "url": "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html" }, {"type": "Video", "title": "Rust's Ownership Model Explained - Let's Get Rusty", "url": "https://www.youtube.com/watch?v=VFIv1dC3y6Y"} ] } ] } ] },
                    { "phase_name": "Phase 2: Intermediate Rust", "subjects": [ { "subject_name": "Building with Rust", "topics": [ { "topic_name": "Structs, Enums, and Pattern Matching", "resources": [ { "type": "Article", "title": "Defining and Instantiating Structs", "url": "https://doc.rust-lang.org/book/ch05-01-defining-structs.html" }, {"type": "Video", "title": "Structs and Enums in Rust - Let's Get Rusty", "url": "https://www.youtube.com/watch?v=d4z20tK4-II"} ] }, { "topic_name": "Error Handling", "resources": [ { "type": "Article", "title": "Recoverable Errors with Result", "url": "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html" }, {"type": "Blog", "title": "Rust Error Handling - BurntSushi", "url": "https://blog.burntsushi.net/rust-error-handling/"} ] }, { "topic_name": "Concurrency", "resources": [ { "type": "Article", "title": "Fearless Concurrency", "url": "https://doc.rust-lang.org/book/ch16-00-concurrency.html" }, {"type": "Video", "title": "Concurrency in Rust - Ryan Levick", "url": "https://www.youtube.com/watch?v=1_2g2TseW3c"} ] } ] } ] }
                ]
            },
            {
                "skill": "JavaScript/TypeScript",
                "phases": [
                    { "phase_name": "Phase 1: JavaScript Foundations", "subjects": [ { "subject_name": "Core JavaScript", "topics": [ { "topic_name": "The Basics: Variables, data types, control flow.", "resources": [ { "type": "Article", "title": "JavaScript Basics - MDN", "url": "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics" }, {"type": "Interactive Tutorial", "title": "JavaScript - freeCodeCamp", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"} ] }, { "topic_name": "The DOM", "resources": [ { "type": "Video", "title": "JavaScript DOM Manipulation - Traversy Media", "url": "https://www.youtube.com/watch?v=0x8Dpy2i69A" }, {"type": "Official Docs", "title": "MDN - Intro to the DOM", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"} ] }, { "topic_name": "Asynchronous JavaScript", "resources": [ { "type": "Article", "title": "Asynchronous JavaScript - MDN", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" }, {"type": "Video", "title": "Async JS Crash Course - Traversy Media", "url": "https://www.youtube.com/watch?v=PoRJizFvM7s"} ] } ] } ] },
                    { "phase_name": "Phase 2: Mastering TypeScript", "subjects": [ { "subject_name": "TypeScript Essentials", "topics": [ { "topic_name": "Introduction to TypeScript", "resources": [ { "type": "Official Docs", "title": "TypeScript for JavaScript Programmers", "url": "https://www.typescriptlang.org/docs/handbook/typescript-for-javascript-programmers.html" }, {"type": "Video", "title": "TypeScript Course for Beginners - freeCodeCamp", "url": "https://www.youtube.com/watch?v=30LWjhZzg50"} ] }, { "topic_name": "Types, Interfaces, and Classes", "resources": [ { "type": "Video", "title": "TypeScript Types vs Interfaces - Fireship", "url": "https://www.youtube.com/watch?v=OdWBIHe3kSg" }, {"type": "Blog", "title": "TypeScript Interfaces vs Types - LogRocket", "url": "https://blog.logrocket.com/types-vs-interfaces-in-typescript/"} ] }, { "topic_name": "Advanced Types and Generics", "resources": [ { "type": "Article", "title": "Generics in TypeScript", "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html" }, {"type": "Video", "title": "Advanced TypeScript - Matt Pocock", "url": "https://www.youtube.com/watch?v=dLPgQRbV10M"} ] } ] } ] }
                ]
            },
            {
              "skill": "Data Structures & Algorithms",
              "phases": [
                { "phase_name": "Phase 1: Core Concepts", "subjects": [ { "subject_name": "Core Data Structures", "topics": [ { "topic_name": "Linear Data Structures", "resources": [ { "type": "Video", "title": "Data Structures Course - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=RBSGKlAcrqk" }, {"type": "Blog", "title": "Linear Data Structures Explained - Medium", "url": "https://medium.com/@binary.thinkers/data-structures-linear-data-structures-93765377445" } ] }, { "topic_name": "Non-Linear Data Structures", "resources": [ { "type": "Article", "title": "Graph Data Structure - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" }, {"type": "Video", "title": "Introduction to Trees - mycodeschool", "url": "https://www.youtube.com/watch?v=oSWTXtMglKE"} ] } ] }, { "subject_name": "Essential Algorithms", "topics": [ { "topic_name": "Sorting and Searching", "resources": [ { "type": "Video", "title": "Sorting Algorithms - CS50", "url": "https://www.youtube.com/watch?v=3Gy-2s4T134" }, {"type": "Interactive Tutorial", "title": "Sorting Algorithms - VisuAlgo", "url": "https://visualgo.net/en/sorting"} ] }, { "topic_name": "Graph Algorithms", "resources": [ { "type": "Video", "title": "Graph Traversal Algorithms - WilliamFiset", "url": "https://www.youtube.com/watch?v=09_LlHjoEiY&list=PLDV1Zeh2NRQBL_6-H0n3cs12-m4-S_1fP" }, {"type": "Article", "title": "Graph Traversal Algorithms - Programiz", "url": "https://www.programiz.com/dsa/graph-traversal"} ] }, { "topic_name": "Dynamic Programming", "resources": [ { "type": "Video", "title": "Dynamic Programming - freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=oBt53YbR9Kk" }, {"type": "Blog", "title": "Demystifying Dynamic Programming - freeCodeCamp", "url": "https://www.freecodecamp.org/news/demystifying-dynamic-programming-3ef3d6229e91/"} ] } ] } ] }
              ]
            },
            {
              "skill": "System Design",
              "phases": [
                { "phase_name": "Phase 1: Foundational Concepts", "subjects": [ { "subject_name": "Core Principles & Building Blocks", "topics": [ { "topic_name": "Key Principles", "resources": [ { "type": "Video", "title": "System Design for Beginners - Gaurav Sen", "url": "https://www.youtube.com/watch?v=bU-q1OJ0eys" }, { "type": "Article", "title": "System Design Primer - GitHub", "url": "https://github.com/donnemartin/system-design-primer" }, {"type": "Blog", "title": "System Design 101 - ByteByteGo", "url": "https://bytebytego.com/courses/system-design-interview-an-insider-s-guide/system-design-101"} ] }, { "topic_name": "Building Blocks", "resources": [ { "type": "Video", "title": "Load Balancing and Caching - Gaurav Sen", "url": "https://www.youtube.com/watch?v=K0Ta65O5szs" }, {"type": "Article", "title": "Caching Strategies - AWS", "url": "https://aws.amazon.com/caching/caching-strategies/"} ] } ] }, { "subject_name": "Case Studies", "topics": [ { "topic_name": "Designing a URL Shortener", "resources": [ { "type": "Video", "title": "Design a URL Shortener - Gaurav Sen", "url": "https://www.youtube.com/watch?v=fQr4I-uhsAc" }, {"type": "Blog", "title": "How to Design a URL Shortener - ByteByteGo", "url": "https://bytebytego.com/courses/system-design-interview-an-insider-s-guide/design-a-url-shortener"} ] }, { "topic_name": "Designing a Social Media Feed", "resources": [ { "type": "Video", "title": "Design a Social Media Feed - CodeKarle", "url": "https://www.youtube.com/watch?v=y2-m_uEwS2I" }, {"type": "Article", "title": "System Design: Instagram - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/system-design-instagram/"} ] } ] } ] }
              ]
            },
             {
              "skill": "Distributed Computing, Concurrency & Multithreading",
              "phases": [
                { "phase_name": "Phase 1: Fundamental Concepts", "subjects": [ { "subject_name": "Concurrency vs. Parallelism", "topics": [ { "topic_name": "Understanding the Difference", "resources": [ { "type": "Video", "title": "Concurrency vs Parallelism - Rob Pike", "url": "https://www.youtube.com/watch?v=oV9rvVarpGs" }, {"type": "Article", "title": "Concurrency vs. Parallelism - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/difference-between-concurrency-and-parallelism/"} ] } ] }, { "subject_name": "Distributed Systems", "topics": [ { "topic_name": "Key Concepts: CAP Theorem, Consensus", "resources": [ { "type": "Video", "title": "What is the CAP Theorem? - ByteByteGo", "url": "https://www.youtube.com/watch?v=k-Y2Zl6i9MM" }, {"type": "Blog", "title": "Understanding the CAP Theorem - IBM", "url": "https://www.ibm.com/cloud/learn/cap-theorem"} ] }, { "topic_name": "Communication: RPC, Message Queues", "resources": [ { "type": "Video", "title": "gRPC vs REST - Fireship", "url": "https://www.youtube.com/watch?v=AymXg2760g8" }, {"type": "Article", "title": "gRPC vs REST APIs - Google Cloud", "url": "https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them"} ] } ] }, { "subject_name": "Multithreading", "topics": [ { "topic_name": "Race Conditions, Deadlocks, Mutexes", "resources": [ { "type": "Video", "title": "Race Conditions and Deadlocks - Jacob Sorber", "url": "https://www.youtube.com/watch?v=KzKung02s1o" }, {"type": "Blog", "title": "Common Concurrency Problems - Baeldung", "url": "https://www.baeldung.com/java-concurrency-thread-safety-problems-solutions"} ] } ] } ] }
              ]
            }
          ]
        };
    };

    const handleStartRoadmap = () => {
        if (!userResume || !targetProfile) {
            alert("Please provide both your current profile and a target profile.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const comparison = getMockApiAnalysis();
            const roadmap = getMockRoadmapData();
            setComparisonData(comparison);
            setRoadmapData(roadmap);
            setIsLoading(false);
            setPage('comparison');
        }, 3000); 
    };
    
    const handleStartPersonalityTest = () => setShowPersonalityTest(true);
    const handleCompletePersonalityTest = (persona) => {
        setFutureSelfPersona(persona);
        setShowPersonalityTest(false);
    }

    // This is passed to the study area to provide the content
    const studyPlan = useMemo(() => {
        if (!roadmapData) return [];
        // Flatten the roadmap into a sequential list of topics for the study area
        return roadmapData.roadmaps.flatMap(skill => 
            skill.phases.flatMap(phase => 
                phase.subjects.flatMap(subject => 
                    subject.topics.map(topic => ({
                        skill: skill.skill,
                        phase: phase.phase_name,
                        subject: subject.subject_name,
                        ...topic
                    }))
                )
            )
        );
    }, [roadmapData]);

    const handleSetPage = (newPage) => {
        setPage(newPage);
        setIsSidebarOpen(false); // Close sidebar on navigation
    }

    return (
        <div className="bg-white text-gray-900 font-sans h-screen flex flex-col md:flex-row selection:bg-yellow-500/30 overflow-x-hidden">
            <Sidebar currentPage={page} setPage={handleSetPage} onStartPersonalityTest={handleStartPersonalityTest} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0"> {/* Added min-w-0 for flex child */}
                 {/* Mobile Header */}
                 <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 text-blue-600">{icons.compass}</div>
                             <h1 className="text-xl font-bold text-black">Final Plan</h1>
                        </div>
                        <button onClick={() => setIsSidebarOpen(true)} className="p-1">
                            {icons.menu}
                        </button>
                    </div>
                </header>
                <main className="flex-1 transition-all duration-300 overflow-y-auto">
                    {page === 'landing' && <LandingPage onStart={handleStartRoadmap} userResume={userResume} setUserResume={setUserResume} targetProfile={targetProfile} setTargetProfile={setTargetProfile} isLoading={isLoading} />}
                    {page === 'comparison' && <ComparisonView comparisonData={comparisonData} onProceed={() => setPage('roadmap')} />}
                    {page === 'roadmap' && <RoadmapView roadmapData={roadmapData} onEnterStudy={() => setPage('study')} />}
                    {page === 'study' && <StudyArea futureSelfPersona={futureSelfPersona} studyPlan={studyPlan} />}
                    {showPersonalityTest && <PersonalityTestModal onComplete={handleCompletePersonalityTest} />}
                </main>
            </div>
        </div>
    );
}

// --- Sidebar Navigation ---
const Sidebar = ({ currentPage, setPage, onStartPersonalityTest, isOpen, setIsOpen }) => {
    const navItems = [
        { id: 'landing', icon: icons.user, label: 'Career Strategy' },
        { id: 'comparison', icon: icons.target, label: 'Gap Analysis' },
        { id: 'roadmap', icon: icons.book, label: 'Learning Roadmap' },
        { id: 'study', icon: icons.brain, label: 'Main Study Area' },
    ];

    return (
        <>
        {/* Overlay for mobile */}
        <div onClick={() => setIsOpen(false)} className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

        <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-4 z-50 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center space-x-2 p-2">
                <div className="w-8 h-8 text-blue-600">{icons.compass}</div>
                <h1 className="text-xl font-bold text-black">Final Plan</h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button onClick={() => setPage(item.id)} className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${ currentPage === item.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200 hover:text-black' }`}>
                                <span className="w-6 h-6">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="border-t border-gray-200 pt-4 space-y-2">
                 <button onClick={onStartPersonalityTest} className="w-full flex items-center space-x-3 p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-200 hover:text-black">
                    <span className="w-6 h-6">{icons.bot}</span>
                    <span>Future Self Sim</span>
                </button>
                 <button className="w-full flex items-center space-x-3 p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-200 hover:text-black">
                    <span className="w-6 h-6">{icons.settings}</span>
                    <span>Settings</span>
                </button>
            </div>
        </aside>
        </>
    );
};


// --- Module 1: Landing Page ---
const LandingPage = ({ onStart, userResume, setUserResume, targetProfile, setTargetProfile, isLoading }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-16">
        <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-black">Design Your Future Self.</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">ONE PATH is your AI co-pilot to bridge the gap between who you are and who you want to become. Let's start by defining your path.</p>
            <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                <ProfileInput id="user-resume" icon={icons.user} title="Your Current Profile" subtitle="Upload your resume or link your profile." profileData={userResume} setProfileData={setUserResume}/>
                <ProfileInput id="target-profile" icon={icons.target} title="Your Target Goal" subtitle="Upload or link a profile you aspire to." profileData={targetProfile} setProfileData={setTargetProfile}/>
            </div>
            <div className="mt-12">
                <button onClick={onStart} disabled={isLoading || !userResume || !targetProfile} className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto">
                    {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Performing Granular Analysis...</>) : (<>Build My Path {icons.arrowRight}</>)}
                </button>
            </div>
        </div>
    </div>
);

const ProfileInput = ({ id, icon, title, subtitle, profileData, setProfileData }) => {
    const fileInputRef = useRef(null);
    const [inputType, setInputType] = useState('upload');
    const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) { setProfileData({ type: 'file', name: e.target.files[0].name }); } };
    const handleUrlChange = (e) => setProfileData({ type: 'url', name: e.target.value });

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-full flex flex-col shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
                <div><h2 className="font-bold text-lg text-black">{title}</h2><p className="text-sm text-gray-500">{subtitle}</p></div>
            </div>
            <div className="mt-4 flex bg-gray-100 border border-gray-300 rounded-lg p-1">
                <button onClick={() => setInputType('upload')} className={`flex-1 p-2 text-sm rounded-md transition-colors ${inputType === 'upload' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Upload</button>
                <button onClick={() => setInputType('url')} className={`flex-1 p-2 text-sm rounded-md transition-colors ${inputType === 'url' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>URL</button>
            </div>
            <div className="mt-4 flex-1">
                {inputType === 'upload' ? (
                     <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        {icons.upload}
                        <p className="mt-2 text-sm text-gray-500 text-center">{profileData && profileData.type === 'file' ? `File: ${profileData.name}` : 'Click to upload PDF, image, or doc'}</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"/>
                    </div>
                ) : (
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icons.link}</span>
                        <input type="text" placeholder="e.g., linkedin.com/in/..." onChange={handleUrlChange} value={(profileData && profileData.type === 'url') ? profileData.name : ''} className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"/>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Module 2a: Comparison View (Formerly RoadmapView) ---
const ComparisonView = ({ comparisonData, onProceed }) => {
    if (!comparisonData) return <div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Generating your analysis...</h1><p className="text-gray-500">Please wait a moment.</p></div>;

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Your AI-Generated Catch-up Plan</h1>
            <p className="mt-2 text-gray-600">Based on a granular analysis of your profile against the target, here is your step-by-step plan. Nothing is skipped.</p>
            <div className="mt-8 space-y-10">
                {comparisonData.map(section => (
                    <div key={section.sectionName}>
                         <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">{section.sectionName}</h2>
                         <div className="space-y-4">{section.comparisons.map(comp => <ComparisonCard key={comp.id} item={comp} />)}</div>
                    </div>
                ))}
            </div>
             <div className="mt-12 text-center">
                <button onClick={onProceed} className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                    Proceed to Detailed Roadmap
                </button>
            </div>
        </div>
    );
};

const ComparisonCard = ({ item }) => {
    const isGap = !item.user;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 flex items-center"><h3 className="font-bold text-lg text-black">{item.name}</h3>{isGap && <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2.5 py-1 rounded-full ml-2">Gap</span>}</div>
            <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Your Profile</h4>
                        <div className={`mt-2 p-3 rounded-lg text-sm ${isGap ? 'bg-gray-100 text-gray-500 italic' : 'bg-green-50 border-l-4 border-green-400'}`}>{isGap ? "Not present in your profile." : (<><p className="font-semibold text-gray-800">{item.user.level}</p><p className="text-gray-600">{item.user.details}</p></>)}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Target Profile</h4>
                         <div className="mt-2 p-3 rounded-lg text-sm bg-blue-50 border-l-4 border-blue-400"><p className="font-semibold text-gray-800">{item.target.level}</p><p className="text-gray-600">{item.target.details}</p></div>
                    </div>
                </div>
                <div><h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">AI Analysis</h4><p className="mt-2 text-sm text-gray-700">{item.analysis}</p></div>
                <div><h4 className="font-semibold text-sm text-yellow-700 uppercase tracking-wider">Path for Improvement</h4><p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{item.path}</p></div>
            </div>
        </div>
    );
};

// --- Module 2b: New Detailed Roadmap View ---
const RoadmapView = ({ roadmapData, onEnterStudy }) => {
    if (!roadmapData || !roadmapData.roadmaps || roadmapData.roadmaps.length === 0) {
        return <div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Loading your detailed roadmap...</h1></div>;
    }
    const [activeSkill, setActiveSkill] = useState(roadmapData.roadmaps[0].skill);

    const activeRoadmap = roadmapData.roadmaps.find(r => r.skill === activeSkill);

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Your Learning Roadmap</h1>
            <p className="mt-2 text-gray-600">A hyper-detailed, topic-level plan to acquire the skills you need. Track your progress and access curated resources.</p>
            
            <div className="mt-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {roadmapData.roadmaps.map(roadmap => (
                        <button key={roadmap.skill} onClick={() => setActiveSkill(roadmap.skill)} className={`${ activeSkill === roadmap.skill ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            {roadmap.skill}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-8">
                {activeRoadmap && <SkillRoadmap roadmap={activeRoadmap} />}
            </div>

            <div className="mt-12 text-center">
                <button onClick={onEnterStudy} className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                    Enter Main Study Area
                </button>
            </div>
        </div>
    );
};

const SkillRoadmap = ({ roadmap }) => {
    const [completedTopics, setCompletedTopics] = useState(new Set());
    
    const allTopics = useMemo(() => roadmap.phases.flatMap(p => p.subjects.flatMap(s => s.topics.map(t => ({...t, id: `${roadmap.skill}-${p.phase_name}-${s.subject_name}-${t.topic_name}`})))), [roadmap]);
    
    const handleTopicToggle = (topicId) => {
        setCompletedTopics(prev => {
            const newSet = new Set(prev);
            if (newSet.has(topicId)) {
                newSet.delete(topicId);
            } else {
                newSet.add(topicId);
            }
            return newSet;
        });
    };

    const overallProgress = allTopics.length > 0 ? Math.round((completedTopics.size / allTopics.length) * 100) : 0;

    return (
        <div className="space-y-8">
             <div>
                <h2 className="text-2xl font-bold text-gray-800">{roadmap.skill} Progress</h2>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full text-white text-xs flex items-center justify-center transition-all duration-500" style={{ width: `${overallProgress}%` }}>{overallProgress}%</div>
                </div>
            </div>
            {roadmap.phases.map(phase => (
                <details key={phase.phase_name} className="bg-gray-50 border border-gray-200 rounded-lg p-4" open>
                    <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center">
                        {phase.phase_name}
                        <span className="transform transition-transform duration-200 details-open:rotate-180">{icons.chevronDown}</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                        {phase.subjects.map(subject => <SubjectProgress key={subject.subject_name} subject={subject} phaseName={phase.phase_name} skillName={roadmap.skill} completedTopics={completedTopics} onToggle={handleTopicToggle}/>)}
                    </div>
                </details>
            ))}
        </div>
    )
}

const SubjectProgress = ({ subject, phaseName, skillName, completedTopics, onToggle }) => {
    const topics = subject.topics.map(t => ({...t, id: `${skillName}-${phaseName}-${subject.subject_name}-${t.topic_name}`}));
    const completedInSubject = topics.filter(t => completedTopics.has(t.id)).length;
    const progress = topics.length > 0 ? Math.round((completedInSubject / topics.length) * 100) : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold">{subject.subject_name}</h4>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-4 space-y-3">
                {topics.map(topic => (
                    <div key={topic.id} className="border-t border-gray-100 pt-3">
                        <label className="flex items-start cursor-pointer">
                            <input type="checkbox" checked={completedTopics.has(topic.id)} onChange={() => onToggle(topic.id)} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                            <span className={`ml-3 text-sm ${completedTopics.has(topic.id) ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{topic.topic_name}</span>
                        </label>
                         <div className="ml-7 mt-2 space-y-2">
                             {topic.resources.map(res => {
                                 const typeIcon = { "Video": icons.video, "Article": icons.article, "Blog": icons.blog, "Official Docs": icons.docs, "Interactive Tutorial": icons.tutorial };
                                 return (
                                     <a href={res.url} target="_blank" rel="noopener noreferrer" key={res.title} className="flex items-center space-x-2 text-xs text-blue-600 hover:underline">
                                         <span className="text-gray-500">{typeIcon[res.type] || icons.link}</span>
                                         <span>{res.title}</span>
                                     </a>
                                 )
                             })}
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Module 3: Main Study Area (Redesigned & Fixed) ---
const StudyArea = ({ futureSelfPersona, studyPlan }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
    const [mobilePanel, setMobilePanel] = useState(null); // null, 'classmates', 'futureSelf'
    const chatEndRef = useRef(null);

    const currentTopic = studyPlan && studyPlan[currentTopicIndex];
    const currentResource = currentTopic && currentTopic.resources[currentResourceIndex];
    
    const classmates = useMemo(() => [
        { name: 'Leo', avatar: '🧑‍💻', question: "So, the compilation process turns our C++ code into machine code, right? I wonder how that differs from an interpreted language like Python." },
        { name: 'Mia', avatar: '🤔', question: "I'm a little confused about the syntax. Why does C++ use semicolons at the end of every statement?" },
        { name: 'Chloe', avatar: '💡', question: "Hey everyone! I found a cool analogy: think of a class as a blueprint and an object as the house you build from that blueprint. It helped me get it!" },
        { name: 'Ben', avatar: '🧐', question: "What are the real-world performance advantages of using C++ over other languages?" }
    ], []);

    useEffect(() => {
        if (studyPlan && studyPlan.length > 0) {
            const firstTopic = studyPlan[0];
            const firstResource = firstTopic.resources[0];
            setMessages([
                { from: 'ai', text: `Welcome to your focused study session! We'll start with the basics of **${firstTopic.skill}**.` },
                { from: 'ai-reframed', text: `Let's dip our toes in the water! First up is a quick intro to what **${firstTopic.skill}** is all about. No pressure, just absorb the info.` },
                { from: 'ai-task', text: `Your first micro-task is to review this ${firstResource.type}: **"${firstResource.title}"**. I've loaded it up for you.`, resource: firstResource }
            ]);
        }
    }, [studyPlan]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;
        const newMessages = [...messages, { from: 'user', text: input }];
        
        if (input.toLowerCase().includes('done') || input.toLowerCase().includes('next')) {
            const nextResourceIndex = currentResourceIndex + 1;
            
            // If there are more resources for the CURRENT topic
            if (currentTopic && nextResourceIndex < currentTopic.resources.length) {
                setCurrentResourceIndex(nextResourceIndex);
                const nextResource = currentTopic.resources[nextResourceIndex];
                newMessages.push({from: 'ai', text: `Excellent. To solidify your understanding of **"${currentTopic.topic_name}"**, let's look at another resource.`});
                newMessages.push({from: 'ai-reframed', text: `Time to see this from a new angle. This should help connect the dots.`});
                newMessages.push({from: 'ai-task', text: `Here is the next micro-task: a ${nextResource.type} titled **"${nextResource.title}"**.`, resource: nextResource });
            } 
            // Else, move to the NEXT topic
            else {
                const nextTopicIndex = currentTopicIndex + 1;
                if (nextTopicIndex < studyPlan.length) {
                    setCurrentTopicIndex(nextTopicIndex);
                    setCurrentResourceIndex(0); // Reset resource index for the new topic
                    const nextTopic = studyPlan[nextTopicIndex];
                    const nextResource = nextTopic.resources[0];
                    newMessages.push({from: 'ai', text: `Great work completing that topic! Let's move on to **${nextTopic.subject}**.`});
                    newMessages.push({from: 'ai-reframed', text: `You're on a roll! Next up, let's untangle the concept of **"${nextTopic.topic_name.split(':')[0]}"**. It's easier than it sounds!`});
                    newMessages.push({from: 'ai-task', text: `Here is the first resource for this new topic, a ${nextResource.type} titled **"${nextResource.title}"**.`, resource: nextResource });
                } else {
                    newMessages.push({from: 'ai', text: "You've completed the entire study plan! Amazing work! What would you like to do now?"});
                }
            }
        } else {
             newMessages.push({from: 'ai', text: "That's a great question! I'll look into that. Remember to type 'next' or 'done' when you've finished with the current resource and are ready to proceed."});
        }

        setMessages(newMessages);
        setInput('');
    };
    
    const getYoutubeVideoId = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }
            return urlObj.searchParams.get('v');
        } catch (e) {
            console.error("Invalid URL for YouTube parsing", e);
            return null;
        }
    }

    const renderResource = () => {
        if (!currentResource) return <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg"><p className="text-gray-500">Study session complete!</p></div>;

        if (currentResource.type === 'Video') {
            const videoId = getYoutubeVideoId(currentResource.url);
            if (!videoId) {
                 return <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white p-4">Could not load video. Invalid YouTube URL.</div>;
            }
            return (
                <div className="w-full h-full bg-black rounded-lg overflow-hidden aspect-video">
                    <iframe
                        key={`${currentTopicIndex}-${currentResourceIndex}`} // More unique key
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={currentResource.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }

        // Simulating blog/article content
        return (
            <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-6 overflow-y-auto prose max-w-none">
                <h2>{currentResource.title}</h2>
                <p className="text-sm text-gray-500">Source: <a href={currentResource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{new URL(currentResource.url).hostname}</a></p>
                <hr className="my-4"/>
                <h3>{currentTopic.topic_name}</h3>
                <p>This is a simulated article view. In a real application, this content would be fetched or rendered from the source URL.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
                <p>Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales.</p>
                <pre><code>
{`// Example code snippet related to the topic
#include <iostream>

int main() {
    std::cout << "Hello, ${currentTopic.skill}!";
    return 0;
}`}
                </code></pre>
                <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi in harmonicas. Pellentesque ac diam in tellus mollis consequat. Ut vitae est. Vivamus vel dolor.</p>
            </div>
        );
    };
    
    const AiClassmatesPanel = () => (
         <div className="bg-gray-50 p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-black flex-shrink-0">AI Classmates</h3>
            <div className="space-y-4 overflow-y-auto">
                {classmates.map(c => (
                    <div key={c.name} className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{c.avatar}</span>
                        <div>
                            <p className="font-semibold text-sm text-black">{c.name}</p>
                            <p className="text-sm text-gray-600">{c.question}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const FutureSelfPanel = () => (
        <div className="bg-gray-50 p-4 h-full flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-4">{futureSelfPersona}</h3>
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-blue-500 flex items-center justify-center text-4xl text-white shadow-lg flex-shrink-0">{icons.bot}</div>
            <p className="mt-4 text-sm text-gray-600 italic">"Every concept you master brings you closer to the expert I know you can be. Keep pushing."</p>
        </div>
    );

    return (
        <div className="h-full w-full flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Left Panel: AI Classmates (Desktop) */}
            <div className="w-64 border-r border-gray-200 flex-col hidden lg:flex">
                <AiClassmatesPanel />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0"> {/* Added min-w-0 */}
                {/* NEW Study Title Bar */}
                {currentTopic && (
                    <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200">
                        <h2 className="text-lg sm:text-xl font-bold text-black truncate">Now Studying: {currentTopic.topic_name}</h2>
                        <p className="text-xs sm:text-sm text-gray-500">{currentTopic.skill} &gt; {currentTopic.subject}</p>
                    </div>
                )}
                
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Resource Viewer */}
                    <div className="flex-1 p-2 sm:p-4 min-h-0 overflow-y-auto">
                        {renderResource()}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-shrink-0 h-auto max-h-[50vh] md:max-h-[45vh] flex flex-col bg-white border-t border-gray-200">
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.from !== 'user' && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">{icons.bot}</div>}
                                    <div className={`max-w-xl p-3 sm:p-4 rounded-xl shadow-sm ${ msg.from === 'user' ? 'bg-blue-500 text-white rounded-br-none' : msg.from === 'ai-reframed' ? 'bg-purple-100 border border-purple-200 text-purple-900 rounded-bl-none' : 'bg-gray-100 text-gray-800 rounded-bl-none' }`}>
                                        {msg.from === 'ai-reframed' && <p className="text-xs font-bold text-purple-700 mb-1">TASK DE-HORRIFIED</p>}
                                        <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-2 sm:p-4 bg-white border-t border-gray-200">
                            <div className="max-w-3xl mx-auto">
                                <div className="relative">
                                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}} placeholder="Ask a question, or type 'done' to continue..." className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 pr-12 sm:pr-16 text-black resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" rows="1"></textarea>
                                    <button onClick={handleSend} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50" disabled={!input.trim()}>{icons.send}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Future Self (Desktop) */}
            <div className="w-64 border-l border-gray-200 flex-col items-center text-center hidden lg:flex">
                <FutureSelfPanel />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex justify-around p-2">
                 <button onClick={() => setMobilePanel(p => p === 'classmates' ? null : 'classmates')} className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${mobilePanel === 'classmates' ? 'text-blue-600' : 'text-gray-500'}`}>
                    {icons.users}
                    <span className="text-xs">Classmates</span>
                 </button>
                 <button onClick={() => setMobilePanel(p => p === 'futureSelf' ? null : 'futureSelf')} className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${mobilePanel === 'futureSelf' ? 'text-blue-600' : 'text-gray-500'}`}>
                    {icons.bot}
                    <span className="text-xs">Future Self</span>
                 </button>
            </div>
            
            {/* Mobile Panel Overlay */}
            {mobilePanel && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div onClick={() => setMobilePanel(null)} className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gray-50 rounded-t-2xl shadow-lg p-4 flex flex-col">
                        <button onClick={() => setMobilePanel(null)} className="absolute top-2 right-2 p-2 text-gray-500">&times;</button>
                        {mobilePanel === 'classmates' && <AiClassmatesPanel />}
                        {mobilePanel === 'futureSelf' && <FutureSelfPanel />}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Optional Module: Personality Test Modal ---
const PersonalityTestModal = ({ onComplete }) => {
    const [answers, setAnswers] = useState({});
    const questions = [ { id: 1, text: "When facing a tough challenge, you:", options: ["Analyze and strategize", "Dive in and learn by doing", "Seek advice from others"] }, { id: 2, text: "Your ideal learning style is:", options: ["Structured and methodical", "Creative and exploratory", "Collaborative and social"] }, { id: 3, text: "You feel most motivated by:", options: ["Clear goals and progress", "Personal growth and discovery", "Positive feedback and encouragement"] }, ];
    const handleSelect = (qId, option) => setAnswers(prev => ({ ...prev, [qId]: option }));
    const handleSubmit = () => { let persona = "The Architect"; if (answers[1] === "Dive in and learn by doing") persona = "The Trailblazer"; if (answers[3] === "Positive feedback and encouragement") persona = "The Mentor"; onComplete(persona); };
    const isComplete = Object.keys(answers).length === questions.length;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-black">Discover Your Future Self Persona</h2>
                <p className="text-gray-600 text-center mt-2 mb-6">Answer a few questions to tailor your AI co-pilot's motivational style.</p>
                <div className="space-y-6">{questions.map(q => (<div key={q.id}><p className="font-semibold mb-2 text-gray-800">{q.id}. {q.text}</p><div className="flex flex-col sm:flex-row gap-2">{q.options.map(opt => (<button key={opt} onClick={() => handleSelect(q.id, opt)} className={`flex-1 p-3 text-sm rounded-lg border-2 transition-colors ${ answers[q.id] === opt ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold' : 'border-gray-300 hover:border-blue-400' }`}>{opt}</button>))}</div></div>))}</div>
                <div className="mt-8 text-center"><button onClick={handleSubmit} disabled={!isComplete} className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Forge My Co-Pilot</button></div>
            </div>
        </div>
    );
};

