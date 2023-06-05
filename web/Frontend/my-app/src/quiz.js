import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function Quiz() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedNumQuestions, setSelectedNumQuestions] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState('');
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

    const categoryId = selectedTopic;
    console.log(selectedNumQuestions);
    console.log(selectedDifficulty);
    console.log(categoryId);
    if (selectedTopic && selectedDifficulty && selectedNumQuestions && selectedType) {
      const response = await fetch(`http://localhost:4200/api/teacher/quizquestions/${selectedNumQuestions}/${categoryId}/${selectedDifficulty}/${selectedType}`);
      const data = await response.json();
      console.log(data);

      if (Array.isArray(data)) {
        const quizQuestions = data.map((question) => ({
          question: question.question,
          options: [...question.incorrect_answers, question.correct_answer],
          correctAnswer: question.correct_answer,
        }));
        setQuizQuestions(quizQuestions);
      } else {
        // handle the case where the response is not an array
        console.log('No quiz questions found.');
        console.log(data);
      }
    } else {
      console.log('enter all fields');
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
        <FormControl style={{ marginLeft: '10px' }}>
          <InputLabel >Topic</InputLabel>
          <Select value={selectedTopic} onChange={handleTopicChange}>
            <MenuItem value="">
              <em>Select a topic</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ marginLeft: '10px' }}>
          <InputLabel >Difficulty</InputLabel>
          <Select value={selectedDifficulty} onChange={handleDifficultyChange}>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <TextField style={{ marginLeft: '10px' }}
          label="Number of questions"
          type="number"
          value={selectedNumQuestions}
          onChange={handleNumQuestionsChange}
        />

        <FormControl style={{ marginLeft: '10px' }}>
          <InputLabel>Type</InputLabel>
          <Select value={selectedType} onChange={handleTypeChange}>
            <MenuItem value="multiple">Multiple Choice</MenuItem>
            <MenuItem value="boolean">True / False</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px' }}>
          Start Quiz
        </Button>
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
