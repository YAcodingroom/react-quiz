import { createContext, useContext, useEffect, useReducer } from 'react'

const SECS_PER_QUESTION = 30
const BASE_URL = '../questions.json'

const QuizContext = createContext()

const initialState = {
	questions: [],
	phase: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
}

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, phase: 'ready' }
		case 'dataFailed':
			return { ...state, phase: 'error' }
		case 'start':
			return {
				...state,
				phase: 'active',
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			}
		case 'newAnswer':
			const question = state.questions.at(state.index)

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			}
		case 'nextQuestion':
			return { ...state, index: state.index + 1, answer: null }
		case 'finish':
			return {
				...state,
				phase: 'finished',
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			}
		case 'restart':
			return { ...initialState, questions: state.questions, phase: 'ready' }
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				phase: state.secondsRemaining === 0 ? 'finished' : state.phase,
			}
		default:
			throw new Error('Action unknown')
	}
}

function QuizProvider({ children }) {
	const [
		{ questions, phase, index, answer, points, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState)

	useEffect(function () {
		async function fetchData() {
			try {
				const res = await fetch(BASE_URL, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				})
				if (!res.ok) throw new Error('Something went wrong')

				const data = await res.json()
				if (!data) throw new Error('Data not found')

				const { questions } = data
				dispatch({ type: 'dataReceived', payload: questions })
			} catch (err) {
				console.log(err.message)
				dispatch({ type: 'dataFailed' })
			}
		}
		fetchData()
	}, [])

	return (
		<QuizContext.Provider
			value={{
				questions,
				phase,
				index,
				answer,
				points,
				highscore,
				secondsRemaining,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	)
}

function useQuizContext() {
	const value = useContext(QuizContext)
	if (value === undefined)
		throw new Error('QuizContext was used outside QuizProvider')
	return value
}

export { QuizProvider, useQuizContext }
