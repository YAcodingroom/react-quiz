import { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import Loader from './Loader'
import Error from './Error'
import StartScreen from '../StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishedScreen from './FinishedScreen'
import Footer from './Footer'
import Timer from './Timer'

const SECS_PER_QUESTION = 30

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

export default function App() {
	const [
		{ questions, phase, index, answer, points, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState)

	const numQuestions = questions.length
	const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0)

	useEffect(function () {
		async function fetchData() {
			try {
				const res = await fetch('http://localhost:8000/questions')
				if (!res.ok) throw new Error('Something went wrong')

				const data = await res.json()
				if (!data) throw new Error('Data not found')

				dispatch({ type: 'dataReceived', payload: data })
			} catch (err) {
				console.log(err.message)
				dispatch({ type: 'dataFailed' })
			}
		}
		fetchData()
	}, [])

	return (
		<div className="app">
			<Header />
			<Main>
				{phase === 'loading' && <Loader />}
				{phase === 'error' && <Error />}
				{phase === 'ready' && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{phase === 'active' && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPoints={maxPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{phase === 'finished' && (
					<FinishedScreen
						points={points}
						maxPoints={maxPoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	)
}
