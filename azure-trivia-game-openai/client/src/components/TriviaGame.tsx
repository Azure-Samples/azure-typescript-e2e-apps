import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import Explanation from "./SourceCited";
import { Game } from "../models";
import { splitString } from "../lib/utils";

type Props = {
  game: Game;
  reset: (game: Game | null) => void;
};

const TriviaGame = ({ game, reset }: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerSelect = (event: any) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (
      selectedAnswer === game.questions[currentQuestionIndex].correct_answer
    ) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    if (currentQuestionIndex === game.questions.length - 1) {
      setShowScore(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowScore(false);
    reset(null);
  };

  return (
    <Card>
      <CardContent>
        {showScore ? (
          <div>
            <Typography>
              Your score is {score} out of {game.questions.length}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleReset}>
              Play Again
            </Button>
            {game.questions.map((question) => (
              <p align="left" key={question.correct_answer}>
                <Explanation data={splitString(question.explanation)} />
              </p>
            ))}
          </div>
        ) : (
          <div>
            <Typography>
              Question {currentQuestionIndex + 1} of {game.questions.length}
            </Typography>
            <Typography variant="h6" component="h2">
              {game.questions[currentQuestionIndex].question}
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select an answer:</FormLabel>
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={selectedAnswer}
                onChange={handleAnswerSelect}
              >
                {game.questions[currentQuestionIndex].answers.map((answer) => (
                  <FormControlLabel
                    key={answer}
                    value={answer}
                    control={<Radio />}
                    label={answer}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TriviaGame;
