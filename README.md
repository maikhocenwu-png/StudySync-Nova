# StudySync Nova

StudySync Nova is a web application designed to help College students organize their studying and practice what they learn. Students can take practice quizzes, track their performance, and receive recommendations about which topics they should study next.

The goal is to make studying more organized and help students focus on topics they need to improve.

## Features

### Implemented

- **User Authentication:** Register and log in using a password that is securely hashed.
- **Course List:** View available courses, including sample CISC courses.
- **Practice Quizzes:** Generate multiple-choice quizzes for a selected topic.
- **Automatic Scoring:** Grade submitted answers on the server and save quiz results.
- **Adaptive Difficulty:** Adjust the difficulty of a topic's next quiz based on the previous quiz score.
- **Progress Tracking:** View performance by topic and identify areas that need more practice.
- **Study Recommendations:** Recommend topics based on quiz performance.
- **AI Quiz Generation:** Use the Gemini API to generate questions, with a mock-question fallback when the AI service is unavailable or returns an invalid response.


## Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| React Router | Frontend navigation |
| Node.js | Backend JavaScript runtime |
| Express.js | Backend API and routing |
| PostgreSQL | Store application data |
| Sequelize | Interact with the database using JavaScript |
| Supabase | Hosted PostgreSQL database |
| JWT | Handle authenticated sessions |
| bcrypt | Hash user passwords |
| Gemini API | Generate practice quiz questions |

## How It Works

1. A student creates an account and logs in.
2. The student chooses a course and a topic to practice.
3. The backend generates a multiple-choice quiz using the AI service or mock questions.
4. The student submits their answers.
5. The backend calculates the score and saves the results.
6. The application uses the student's recent performance to adjust the next quiz's difficulty.
7. The progress system identifies stronger topics and topics that need more practice.

### Adaptive Difficulty

StudySync Nova uses the previous completed quiz score for a topic to determine the next difficulty level:

## Project Structure

The repository is organized into a backend and a frontend.

```text
StudySync-Nova/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
├── .gitignore
└── README.md
```

- **config/** — Database and application configuration.
- **models/** — Sequelize models that represent database tables.
- **routes/** — Define API endpoints.
- **controllers/** — Handle requests and application logic.
- **middleware/** — Handle tasks such as checking authentication.
- **server.js** — Starts the Express server.
- **frontend/** — React and Vite frontend application.

## Database

The application uses PostgreSQL to store its data. Sequelize provides the connection between the backend JavaScript code and the database.
