export interface StartGameDto {
  country: string;
  mode: 'SP' | 'MP'; // Single Player or Multi Player
  answerDuration: number;
}
