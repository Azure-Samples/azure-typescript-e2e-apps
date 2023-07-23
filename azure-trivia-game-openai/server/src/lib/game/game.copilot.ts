// new class called game which turns a new instance as the default
// export default class Game {
//     constructor() {
//         this.reset();
//     }
//   reset() {
//     this.turn = 0;
//     this.score = 0;
//     this.questions = [];
//     this.answers = [];
//   }
//   async question(gameTurn) {
//     this.turn = gameTurn;
//     const question = await this.getQuestion();
//     this.questions.push(question);
//     return question;
//   }
//   async answer(gameAnswer) {
//     this.answers.push(gameAnswer);
//     const answer = await this.getAnswer();
//     if (answer === gameAnswer) {
//       this.score++;
//     }
//     return answer;
//   }
//   async getQuestion() {
//     const question = await openai.complete({
//       engine: 'davinci',
//       prompt: `Q: ${this.turn}\nA:`,
//       maxTokens: 64,
//       temperature: 0.5,
//       topP: 1,
//       presencePenalty: 0,
//       frequencyPenalty: 0,
//       bestOf: 1,
//       n: 1,
//       stream: false,
//       stop: ['\n']
//     });
//     return question.data.choices[0].text.trim();
//   }
//   async getAnswer() {
//     const answer = await openai.complete({
//       engine: 'davinci',
//       prompt: `Q: ${this.turn}\nA: ${this.answers[this.answers.length - 1]}\nQ: ${this.turn + 1}\nA:`,
//       maxTokens: 64,
//       temperature: 0.5,
//       topP: 1,
//       presencePenalty: 0,
//       frequencyPenalty: 0,
//       bestOf: 1,
//       n: 1,
//       stream: false,
//       stop: ['\n']
//     });
//     return answer.data.choices[0].text.trim();
//   }
// }

