import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

const QuizApp = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);


    const questions = [
        {
            question: "2+2=?",
            options: [
                { key: '1', value: '3' },
                { key: '2', value: '5' },
                { key: '3', value: '6' },
                { key: '4', value: '4' }
            ],
            correctAnswer: '4',
        },
        {
            question: "4+4=?",
            options: [
                { key: '1', value: '6' },
                { key: '2', value: '8' },
                { key: '3', value: '7' },
                { key: '4', value: '5' }
            ],
            correctAnswer: '8',
        },
        {
            question: "4+3=?",
            options: [
                { key: '1', value: '6' },
                { key: '2', value: '8' },
                { key: '3', value: '7' },
                { key: '4', value: '5' }
            ],
            correctAnswer: '7',
        }
    ];

    const handleNextQuestion = () => {
        if (selectedOption == questions[currentQuestion].correctAnswer) {
            setScore(score + 10);
        }
        setSelectedOption(null);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsQuizFinished(true);
        }
    };

    const handleFinish = () => {
        if (selectedOption == questions[currentQuestion].correctAnswer) {
            setScore(score + 10);
        }
        setIsQuizFinished(true);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setScore(0);
        setIsQuizFinished(false);
    };

    return (
        <ScrollView>
            <View style={styles.background}>
                <View style={styles.header}>
                    <Text style={styles.Quiztaxt}>Quiz</Text>
                </View>

                {isQuizFinished ? (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>Summary</Text>
                        <Text>Total Questions: {questions.length}</Text>
                        <Text>Total Correct Answers: {score / 10}</Text>
                        <Text>Total Score: {score}</Text>
                        <Button title="Restart Quiz" onPress={resetQuiz} />
                    </View>
                ) : (
                    <View>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>
                                Question: {questions[currentQuestion].question}
                            </Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            <Text style={styles.optionsTitle}>Options:</Text>
                            {questions[currentQuestion].options.map((option) => (
                                <RadioButton.Group
                                    key={option.key}
                                    onValueChange={(value) => setSelectedOption(value)}
                                    value={selectedOption}
                                >
                                    <View style={styles.optionItem}>
                                        <RadioButton value={option.value} />
                                        <Text>{option.value}</Text>
                                    </View>
                                </RadioButton.Group>
                            ))}
                        </View>

                        {currentQuestion < questions.length - 1 ? (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                                <Text style={styles.nextButtonText}>Next Question</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                                <Text style={styles.finishButtonText}>Finish</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: 'orange',
        marginBottom: 10
    },
    Quiztaxt: {
        textAlign: 'center',
        fontSize: 30,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
    questionContainer: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionsContainer: {
        backgroundColor: '#b3e5fc',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    optionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    nextButton: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    nextButtonText: {
        color: 'yellow',
        fontWeight: 'bold',
        fontSize: 16,
    },
    finishButton: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    finishButtonText: {
        color: 'yellow',
        fontWeight: 'bold',
        fontSize: 16,
    },
    summaryContainer: {
        backgroundColor: '#a5d6a7',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default QuizApp;
