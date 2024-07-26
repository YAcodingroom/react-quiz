import { useQuizContext } from '../context/QuizContext'

function Options() {
	const { questions, index, answer, dispatch } = useQuizContext()

	const question = questions[index]

	const hasAnswered = answer !== null

	return (
		<div className="options">
			{question.options.map((option, i) => (
				<button
					className={`btn btn-option ${i === answer ? 'answer' : ''} ${
						hasAnswered
							? i === question.correctOption
								? 'correct'
								: 'wrong'
							: ''
					}`}
					onClick={() => dispatch({ type: 'newAnswer', payload: i })}
					disabled={hasAnswered}
					key={option}
				>
					{option}
				</button>
			))}
		</div>
	)
}

export default Options
