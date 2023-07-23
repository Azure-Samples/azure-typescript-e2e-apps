export type Answer = string;  
  
export type Game = {
    location: string;
    questions: Question[];
}

export type Question = {  
  question: string;  
  answers: Answer[];  
  correct_answer: string;
  explanation: string;  
};  
   
