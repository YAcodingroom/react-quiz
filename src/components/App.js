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
import { useQuizContext } from '../context/QuizContext'

export default function App() {
	const { phase } = useQuizContext()

	return (
		<div className="app">
			<Header />
			<Main>
				{phase === 'loading' && <Loader />}
				{phase === 'error' && <Error />}
				{phase === 'ready' && <StartScreen />}
				{phase === 'active' && (
					<>
						<Progress />
						<Question />
						<Footer>
							<Timer />
							<NextButton />
						</Footer>
					</>
				)}
				{phase === 'finished' && <FinishedScreen />}
			</Main>
		</div>
	)
}
