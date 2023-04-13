import './App.css';
import Button from '@mui/material/Button';
import {useEffect, useState} from "react"
const HTMLDecoderEncoder = require("html-encoder-decoder");

function App() {
  const [triviaquest, setTriviaquest] = useState();

  //grabs the json from the api
  const generateQuestions = () => {
    fetch("https://opentdb.com/api.php?amount=10&category=20")
    .then((res) => res.json())
    .then((quest) => setTriviaquest(quest.results))
  }
  //A hook that runs after every render, allows new questions after every render
  useEffect(() => {
    generateQuestions()
  }, [])

  if (triviaquest) {
    return (
      <div className="App">
        <h1>Trivia App!</h1>
        {triviaquest.map((question) => <QuestionList question_quest={question} key={question.question} />)}   
      </div>
    );
  } else {
    return(<h1> One Moment Please </h1>)
  }

}

function QuestionList(props){
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState()
    const [isAnswers, setIsAnswers] = useState([]); 

    //Doing this so i dont have to keep typing prop.question_quest
    const quest = props.question_quest;
  
    if (isAnswers.length === 0) { 
      const choices = [...quest.incorrect_answers] 
      const randomizer = Math.floor(Math.random() * (choices.length + 1))
      choices.splice(randomizer, 0, quest.correct_answer);
      setIsAnswers(choices) 
    }
  
    const handleClick = (answer) => {
      setIsAnswered(true)
      if (answer === quest.correct_answer) {
        setIsCorrect(true)
      } else {
        setIsCorrect(false)
      }
    }
  
    // determine question color based on state
    let questionColor = "purple";
    if (isAnswered) {
      questionColor = isCorrect? "green" : "red"
    }
  
    return(
      <div>
        <h2 style={{color: questionColor}}>{HTMLDecoderEncoder.decode(quest.question)}</h2>
        {isAnswers.map((answer)=> <Button variant="contained" disabled={isAnswered} key={answer} onClick={() => handleClick(answer)}>{HTMLDecoderEncoder.decode(answer)}</Button>)}
        {isAnswered && <p> Correct Answer Was: {HTMLDecoderEncoder.decode(quest.correct_answer)}</p>}
        <br />
      </div>
    )
}

export default App;