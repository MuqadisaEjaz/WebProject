import React, { useState ,useEffect} from "react";

function Quiz() {
    
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedNumQuestions, setSelectedNumQuestions] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [categories, setCategories] = useState([]);


  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleNumQuestionsChange = (event) => {
    setSelectedNumQuestions(event.target.value);
  };

  const handleQuizSubmit = async (event) => {
    event.preventDefault();

    const categoryId = selectedTopic
    console.log(selectedNumQuestions)
    console.log(selectedDifficulty)
    console.log(categoryId)
    if (selectedTopic && selectedDifficulty && selectedNumQuestions && selectedType){
    const response = await fetch(`http://localhost:4200/api/user/quizquestions/${selectedNumQuestions}/${categoryId}/${selectedDifficulty}/${selectedType}`);
    const data = await response.json();
    console.log(data);
   
    // const quizQuestions = data.map((question) => ({
    //   question: question.question,
    //   options: [...question.incorrect_answers, question.correct_answer],
    //   correctAnswer: question.correct_answer,
    // }));
    // setQuizQuestions(quizQuestions);
    //  console.log(setQuizQuestions)

    if (Array.isArray(data)) {
      const quizQuestions = data.map((question) => ({
        question: question.question,
        options: [...question.incorrect_answers, question.correct_answer],
        correctAnswer: question.correct_answer,
      }));
      setQuizQuestions(quizQuestions);
    } else {
      // handle the case where the response is not an array
      console.log("No quiz questions found.");
      console.log(data);
   
    }
  
    }
    else{
      console.log("enter all fields")
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('https://opentdb.com/api_category.php');
      const data = await response.json();
      setCategories(data.trivia_categories);
    }
    fetchCategories();
  }, []);


  return (
    <div>
      <form onSubmit={handleQuizSubmit}>
      <label>
  Topic:
  <select value={selectedTopic} onChange={handleTopicChange}>
    <option value="">Select a topic</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
</label>

        <label>
          Difficulty:
          <select value={selectedDifficulty} onChange={handleDifficultyChange}>
            {/* <option value="">Select a difficulty level</option> */}
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Number of questions:
          <input type="number" value={selectedNumQuestions} onChange={handleNumQuestionsChange} />
        </label>
        <label>   
          <select value={selectedType} onChange={handleTypeChange}>
          {/* <option value="">Select a type</option> */}
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
         </select>
        </label>
     
        <button type="submit">Start Quiz</button>
      </form>
      {quizQuestions.map((question, index) => (
        <div key={index}>
          <h3>{question.question}</h3>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Quiz;
