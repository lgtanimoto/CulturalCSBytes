# API Reference

This guide will detail what, when, and how to make specific API requests from the frontend to the backend. Please have the Milestone One Wireframe for reference.

## 1. Welcome Page

No API request from here. Everything here redirects to a new page. This can all be done on the frontend side of things:
- **Login** - Redirects to the login form
- **Create Account** - Redirects to the registration form
- **About** - Redirects to the about page (if we have one)

## 2. Student Account Creation

The form is submitted when we click "OK". This is where we make an API request. We want to make the following request:

```
POST http://localhost:3001/authentication/register
```

First we need to specify the form inputs we want to pass into the body of the API request:

```
const body = {
  username,
  password,
  nickname,
  email,
  age,
  zipcode
};
```

Then we await the response of the API request:

```
const response = await fetch('http://localhost:3001/authentication/register', {
  method: 'POST',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body)
});
```

Finally we retrieve the JSON (JavaScript object) that the API request returns:

```
const parseRes = await response.json();
```

The JSON object returned by this route will simply return a token which should be stored in `localStorage` when we make future API requests.

```
{ token: ... }
```

### 2a. Login

While there is no login form in the wireframe, we need to handle this route as well:

```
POST http://localhost:3001/authentication/login
```

I won't go in too much depth for this one since the steps are very similar to registration, so let's do this in one block here:

```
const body = {
  username,
  password
};

const response = await fetch('http://localhost:3001/authentication/login', {
  method: 'POST',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body)
});

const parseRes = await response.json();
```

Where the JSON object returned looks exactly the same as for registration: includes the token.

```
{ token: ... }
```

## 3. Course Enrollments

### Get All Enrollments

If we want to list all the enrollments, we make the following request:

```
GET http://localhost:3001/enrollments
```

No body for GET requests. But we must provide the JWT token that we retrieved from registration/login:

```
const res = await fetch('http://localhost:3001/enrollments', {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

`parseData` is a JSON object that lists the enrollment summary in the following format:

```
{
  username: ...,
  nickname: ...,
  enrollments: [
    {
      id: ...,
      completedSessions: ...,
      highScore: ...,
      date: ...,
      status: {
        started: ...,
        completed: ...
      }
    }
  ]
}
```

Here is a breakdown of each of the fields:
- `username` - Username to display.
- `nickname` - Nickname to display.
- `enrollments` - The list of enrollments for a student (only one for the initial milestone).
  - `id` - The numerical id of the enrollment. Use it when making future API requests with the enrollment id.
  - `completedSessions` - A number from 0 to 5.
  - `highScore` - The *percentage* of the high score
  - `date` - If `null`, then we haven't started the enrollment. Otherwise, the most recent date an official session was started or completed.
  - `status`
    - `started` - A boolean for if we started the enrollment.
    - `completed` - A boolean for if we completed the enrollment.

### Get Enrollment Stats

If we click on **Stats** for a certain enrollment, we need to redirect to the enrollment metrics page, hence Section 4.

### Continue Enrollment

If we click on **Continue** for a certain enrollment, we need to make this API GET request:

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/continue
```

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/continue`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

You will get a response of the following form:

```
{ redirect: ... }
```

This specified the route to redirect to. This field can take the following values:
- `new` - Redirect to the form where we start a new session. See Section 5.
- `:sessionId/questions/:order` - Redirect to the following question for the specified session. Section 7.

## 4. Enrollment Metrics

### Get Enrollment Metrics

To get the enrollment metrics, we make the following API request:

```
GET http://localhost:3001/enrollments/:enrollmentId
```

Where `:enrollmentId` is the `id` attribute that was returned for the enrollment specified. This attribute was returned when we tried to get all the enrollments from Section 3.

Make the API request as below:

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

You will get a response of the following form:

```
{
  username: ...,
  nickname: ...,
  sessions: [
    {
      id: ...,
      name: ...,
      date: ...,
      cultures: ...,
      correct: ...,
      totalQuestions: ...,
      isOfficialSession: ...
    },
  ],
  actions: {
    start: ...,
    practice: ...,
    continue: ...
  }
}
```

And a breakdown of what these fields mean (not including `username` and `nickname`):
- `sessions` - A list of sessions the student has completed, including official and practice sessions. Useful for the table.
  - `id` - The session id. Please keep track of this when making API requests for a session.
  - `name` - The name of the session.
  - `date` - Either the completion date, the start date, or the expected start date. Try to render in that order.
  - `cultures` - A string to list the cultures for the session.
  - `correct` - Number of questions correct.
  - `total` - Total questions, which will always be 20 (for the initial milestone).
  - `isOfficialSession` - A boolean for if it is an official or practice session.
- `actions` - Whether we can do each action, each represented as booleans.
  - `start` - Can we start a new *official* session?
  - `practice` - Can we start a new *practice* session?
  - `continue` - Can we continue a session that is currently in progress?

#### Errors

Now you could get this response, which means that you cannot access enrollment metrics until you start the initial session. We are blocking this access in case the user figures out how to navigate to this page using URL patterns even though the button is disabled.

```
{
  statusCode: 403,
  error: 'Cannot access until started initial session.'
}
```

## 5. Session Start

### Official Session

Even though we are filling out a form, we still need to make an API GET request. This is to retrieve the next official session we need to start.

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/new
```

This is a simple API GET request:

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/new`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

And the response looks like this:

```
{
  sessionId: ...,
  sessionName: ...,
  cultures: [
    {
      code: ...,
      name: ...,
      lang: ...,
      icon: ...
    },
    ...
  ],
  difficulties: [...]
}
```

And a breakdown of the fields:
- `sessionId` - The id of the session we are starting. Use for later.
- `sessionName` - Name of session to display on form.
- `cultures` - A list of cultures to display on the dropdown and additional cultures.
  - `code` - A code as means of identifying the culture.
  - `name` - The name of the culture.
  - `lang` - The language for the culture (not sure it is needed).
  - `icon` - The culture icon (probably not needed here).
- `difficulties` - A list of difficulties as dropdown on the form.

## 6. Session Confirmation Screen

No GET requests here. The point is to start official or practice sessions.

### Official Session

Now we will make a PATCH request. This is because the sessions have already been created in the database, so all we need to do is modify them to indicate that we have started the session.

```
PATCH http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId
```

And we can do it via the following snippet:

```
const body = {
  preferredCulture,
  difficulty,
  additionalCultures
};

const response = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/${sessionId}`, {
  method: 'PATCH',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body)
});

const parseRes = await response.json();
```

Specifying the input fields:
- `preferredCulture` - A string representing the preferred culture for the session.
- `difficulty` - A string for the difficulty of the session requested.
- `additionalCultures` - A list of strings for additional cultures specified.

Now for the response, ideally you get a response like this:

```
{ success: 'Started official session!' }
```

Now you can navigate to question one for the session! Here's how to do it in Section 7.

## 7. Question

### Get Question

Let's say we want to get question one for the session. Specifying `order=1`, we need to make a GET request like the following:

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/questions/:order
```

This GET request is very similar to other GET requests:

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/${sessionId}/questions/${order}`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

And the response data is of the form:

```
{
  cultureIcon: ...,
  totalQuestions: ...,
  questionJson: ...,
  imagesBlob: ...,
  answerOrder: ...,
  studentAnswer: ...
}
```

And a breakdown of the fields:
- `cultureIcon` - Would be a blob to store the culture icon, but right now no functionality.
- `totalQuestions` - Total questions for the "out of...".
- `questionJson` - Please refer to the **content** folder of this directory for information on what this looks like.
- `imagesBlob` - This is a blob that stores the `QuestionImage` as referred to in the `questionJson`.
- `answerOrder` - This is a 4-digit number that looks like e.g. 2143. This specifies the order to display the answers in.
- `studentAnswer` - If the student hasn't answered the question, this will be `null`. Otherwise it will specify the student answer.

### Answer Question

Now we want to answer a question. We make a `PATCH` request like the following:

```
PATCH http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/questions/:order
```

And we can do it via the following snippet (`answer` is an integer representing the number of the answer chosen):

```
const body = {answer};

const response = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/${sessionId}/questions/${order}`, {
  method: 'PATCH',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body)
});

const parseRes = await response.json();
```

It's really that simple. After that we should get the following response:

```
{ success: 'Answered question!' }
```

## 8. Question Results

### Get Question Results

Follow the conventions for making the same request below:

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/questions/:order
```

The response will be exactly the same, except `studentAnswer` will have a numerical value. You can compare this to `questionJson.CorrectAnswer` to display if the student got the question correct or wrong.

### Next Question

We make the same `PATCH` request like the following:

```
PATCH http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/questions/:order
```

The only difference is what we put in the body, which will now look like this to specify that we are moving on from this question:

```
const body = {next: true};
```

#### Success

It turns out there are one of two possibilities. If you answered all the questions in the session, you will see the following:

```
{ success: 'Completed session!' }
```

Otherwise, you will see this, where in this case you add one to the current question order in getting the next question:

```
{ success: 'Started next question!' }
```

## 9. Recommendations

This is a GET request like below:

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/recommendations
```

And done via the following:

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/${sessionId}/recommendations`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

With a response that appears in the following format:

```
{
  nickname: ...,
  correct: ...,
  totalQuestions: ...,
  sessionName: ...,
  resources: {
    culture: [],
    questionSet: [],
    questionMissed: []
  }
}
```

I will go over the fields we have not touched upon yet:
- `resources` - JSON object that lists resources available for the following:
  - `culture` - Resources available for cultures
  - `questionSet` - Resources available for the chosen question set
  - `questionMissed` - Resources that correspond to the questions missed

## 10. Session Results

This is a GET request like below:

```
GET http://localhost:3001/enrollments/:enrollmentId/sessions/:sessionId/results
```

And done via the following:

```
const res = await fetch(`http://localhost:3001/enrollments/${enrollmentId}/sessions/${sessionId}/results`, {
  method: 'GET',
  headers: { token: localStorage.token }
}

const parseData = await res.json();
```

With a response that appears in the following format:

```
{
  nickname: ...,
  correct: ...,
  totalQuestions: ...,
  sessions: [
    {
      id: ...,
      name: ...,
      date: ...,
      cultures: ...,
      correct: ...,
      totalQuestions: ...,
      isOfficialSession: ...
    },
  ],
  actions: {
    start: ...,
    practice: ...,
    continue: ...
  }
}
```

Hopefully the fields are self explanatory at this point.
