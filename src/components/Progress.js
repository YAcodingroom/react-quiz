import { useQuizContext } from '../context/QuizContext'

function Progress() {
	const { questions, index, answer, points } = useQuizContext()

	const numQuestions = questions.length
	const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0)

	return (
		<header className="progress">
			<progress
				max={numQuestions}
				value={index + Number(answer !== null)}
			></progress>
			<p>
				Question <strong>{index + 1}</strong> / {numQuestions}
			</p>
			<p>
				<strong>{points}</strong> / {maxPoints}
			</p>
		</header>
	)
}

export default Progress
