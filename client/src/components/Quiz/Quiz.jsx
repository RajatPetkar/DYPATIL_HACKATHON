import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuizQuestions } from "../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./quiz.css";

const Quiz = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [LearningStyle, setLearningStyle] = useState("");
  const [time_commitment, settime_commitment] = useState("");
  const [domain_interest, setdomain_interest] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate(); // Initialize history for navigation

  const processQuestions = (fetchedQuestions) => {
    return fetchedQuestions.map((q) => {
      const options = Array.isArray(q.options)
        ? q.options.map((opt, index) => {
            if (typeof opt === "object" && opt !== null) {
              return {
                id: opt.id
                  ? opt.id.toUpperCase()
                  : String.fromCharCode(65 + index),
                text: opt.text || opt,
              };
            } else {
              return {
                id: String.fromCharCode(65 + index),
                text: opt,
              };
            }
          })
        : [];

      const answerKey = (q.answer || q.correct_answer || "").toUpperCase();

      return {
        ...q,
        options,
        answer: answerKey,
        explanation: q.explanation || "No explanation provided.",
      };
    });
  };

  const handleFetchQuestions = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic before fetching questions.");
      return;
    }
    if (!difficulty) {
      alert("Please select a difficulty level.");
      return;
    }
    setLoading(true);
    try {
      const fetchedQuestions = await fetchQuizQuestions(
        topic,
        difficulty,
        LearningStyle,
        time_commitment,
        domain_interest
      );
      if (!fetchedQuestions.length) {
        alert("No questions found for the selected topic and difficulty.");
        setLoading(false);
        return;
      }
      const processedQuestions = processQuestions(fetchedQuestions);
      setQuestions(processedQuestions);
      setCurrentQuestion(0);
      setScore(null);
      setSubmitted(false);
      setSelectedAnswers({});
    } catch (error) {
      alert("Error fetching quiz. Try again.");
    }
    setLoading(false);
  };

  const handleSelect = (optionId) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionId }));
  };

  const handleSubmit = () => {
    const unanswered = questions.some((q, index) => !selectedAnswers[index]);

    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle reattempt by resetting quiz states
  const handleReattempt = () => {
    setTopic("");
    setDifficulty("");
    LearningStyle("");
    time_commitment("");
    domain_interest("");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  // Handle continue by navigating to the home route
  const handleContinue = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      console.error("User email not found in localStorage");
      return;
    }

    const quizData = {
      email,
      score,
      topic,
      questionsAnswered: questions.map((q, index) => ({
        questionText: q.question,
        userAnswer: selectedAnswers[index] || "Not Answered",
        correctAnswer: q.answer,
      })),
    };

    const PathData= {
     email, score,topic,LearningStyle,difficulty,time_commitment,domain_interest
    }

    try {
      const response = await fetch("http://localhost:5000/saveQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      const response2 = await fetch("http://localhost:5000/savePath", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(PathData),
      });
      console.log(PathData);

      if (!response.ok || response2.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const result = response.json();
      const result2 = response2.json();
      console.log("Quiz results saved successfully:", result);
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
    navigate("/home");
  };

  return (
    <div className="quiz-container">
      {!submitted ? (
        <>
          {/* Show Setup Section only when questions are not fetched */}
          {!questions.length && (
            <div className="setup-section">
              <h1>Tell About Yourself?</h1>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic's which you know ..."
                className="input-fields"
                required
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">Select Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={LearningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">Select Learning Style</option>
                <option value="Visual">Visual</option>
                <option value="Auditory">Auditory</option>
                <option value="Kinesthetic">Kinesthetic</option>
              </select>
              <select
                value={time_commitment}
                onChange={(e) => settime_commitment(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">
                  On average, how many hours per week can you dedicate to
                  learning?
                </option>
                <option value="1">Less than 2 hours</option>
                <option value="3">2-5 hours</option>
                <option value="7">5-10 hours</option>
                <option value="10">More than 10 hours</option>
              </select>
              <select
                value={domain_interest}
                onChange={(e) => setdomain_interest(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">
                  What is your primary goal for learning computer science?
                </option>
                <option value="job_interview ">Career advancement</option>
                <option value="learning">Personal projects and hobbies</option>
                <option value="learning">Academic requirements</option>
                <option value="startup">Entrepreneurship</option>
              </select>

              <button
                onClick={handleFetchQuestions}
                disabled={loading}
                className="btns"
              >
                {loading ? "Generating ..." : "Submit"}
              </button>
              <p onClick={() => navigate("/home")} className="skip-link">
                Want to skip?
              </p>
            </div>
          )}

          {/* Show Questions once fetched */}
          {questions.length > 0 && (
            <div className="question-card">
              <div className="question-header">
                <h3>
                  {currentQuestion + 1}) {questions[currentQuestion]?.question}
                </h3>
                <p>
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <div className="options-list">
                {questions[currentQuestion]?.options.map((option) => (
                  <label key={option.id} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option.id}
                      checked={selectedAnswers[currentQuestion] === option.id}
                      onChange={() => handleSelect(option.id)}
                      required
                    />
                    <span className="option-text">{`${option.text}`}</span>
                  </label>
                ))}
              </div>
              <div className="nav-buttons">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className="btns"
                >
                  Previous
                </button>
                {currentQuestion < questions.length - 1 && (
                  <button onClick={handleNext} className="btns">
                    Next
                  </button>
                )}
                {currentQuestion === questions.length - 1 && (
                  <button onClick={handleSubmit} className="btns submit-btns">
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="results-section">
          <h2>
            Your Score: <span className="score">{score}</span> /{" "}
            {questions.length}
          </h2>
          <h3>Review Your Answers:</h3>
          <div className="reviews">
            {questions.map((q, index) => {
              const correctOption = q.options.find(
                (opt) => opt.id === q.answer
              );
              const userOption = q.options.find(
                (opt) => opt.id === selectedAnswers[index]
              );
              const isCorrect = selectedAnswers[index] === q.answer;
              return (
                <div
                  key={index}
                  className={`review-card ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <h4>{`${index + 1}) ${q.question}`}</h4>
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {correctOption ? correctOption.text : "N/A"}
                  </p>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {userOption ? userOption.text : "Not Answered"}
                  </p>
                  <p className="explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                  {isCorrect ? (
                    <p className="status correct-status">✅ Correct</p>
                  ) : (
                    <p className="status incorrect-status">❌ Incorrect</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="result-buttons">
            <button onClick={handleReattempt} className="btns reattempt-btn">
              Reattempt
            </button>
            <button onClick={handleContinue} className="btns continue-btn">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;