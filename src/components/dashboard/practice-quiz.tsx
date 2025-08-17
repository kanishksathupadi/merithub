
"use client";

import React, { useState, useMemo } from 'react';
import type { GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface PracticeQuizProps {
    studyGuide: GenerateStudyGuideOutput;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export function PracticeQuiz({ studyGuide }: PracticeQuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const questions = useMemo(() => studyGuide.practiceQuestions, [studyGuide]);
    const currentQuestion = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / questions.length) * 100;


    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;

        const isCorrect = selectedAnswer === currentQuestion.answer;
        if (isCorrect) {
            setAnswerStatus('correct');
            setScore(s => s + 1);
        } else {
            setAnswerStatus('incorrect');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setAnswerStatus('unanswered');
        } else {
            setQuizFinished(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswerStatus('unanswered');
        setScore(0);
        setQuizFinished(false);
    };

    if (quizFinished) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <Award className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl">You scored:</p>
                    <p className="text-5xl font-bold my-4 text-primary">{score} / {questions.length}</p>
                    <p className="text-muted-foreground">{Math.round((score / questions.length) * 100)}%</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRestartQuiz} className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <Progress value={progress} className="mb-4" />
                <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedAnswer ?? ''}
                    onValueChange={setSelectedAnswer}
                    disabled={answerStatus !== 'unanswered'}
                    className="space-y-4"
                >
                    {currentQuestion.options.map((option, index) => {
                        const isCorrectAnswer = option === currentQuestion.answer;
                        const isSelected = option === selectedAnswer;

                        return (
                            <Label
                                key={index}
                                htmlFor={`option-${index}`}
                                className={cn(
                                    "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors",
                                    answerStatus !== 'unanswered' && isCorrectAnswer && "bg-green-500/10 border-green-500/50",
                                    answerStatus === 'incorrect' && isSelected && "bg-red-500/10 border-red-500/50",
                                    answerStatus === 'unanswered' && "hover:bg-accent"
                                )}
                            >
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <span className="flex-1">{option}</span>
                                {answerStatus === 'correct' && isSelected && <CheckCircle className="text-green-500" />}
                                {answerStatus === 'incorrect' && isSelected && <XCircle className="text-red-500" />}
                            </Label>
                        );
                    })}
                </RadioGroup>
                {answerStatus === 'incorrect' && (
                    <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-200 text-sm font-semibold">
                        Correct Answer: {currentQuestion.answer}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {answerStatus === 'unanswered' ? (
                    <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="w-full">
                        Check Answer
                    </Button>
                ) : (
                    <Button onClick={handleNextQuestion} className="w-full">
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

